import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { PrismaService } from '../prisma/prisma.service.js';
import { ClassifyTicketInput } from './classify-ticket.input.js';
import { ClassificationResult } from './classify-ticket.result.js';

const AI_REQUEST_TIMEOUT_MS = 15000;

interface GroqClassificationJson {
  readonly category: string;
  readonly priority: string;
  readonly summary: string;
}

/* Unica pieza que habla con Groq. TicketsService no arma prompts ni parsea JSON.

 * Orden interno de classifyTicket:
 * 1) Comprobar API key
 * 2) Leer catalogos de PostgreSQL (nombres permitidos)
 * 3) Pedir JSON estructurado a Groq
 * 4) Validar que category/priority existan en esas tablas
 * 5) Devolver SUCCESS con ids, o FAILED con un error corto
 */

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly openai: OpenAI;
  private readonly model: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('AI_API_KEY') ?? '',
      baseURL:
        this.configService.get<string>('AI_BASE_URL') ??
        'https://api.groq.com/openai/v1',
      timeout: AI_REQUEST_TIMEOUT_MS,
    });
    this.model =
      this.configService.get<string>('AI_MODEL') ?? 'openai/gpt-oss-20b';
  }

  /* Clasifica un ticket recien creado. Nunca lanza: un fallo de IA no debe tumbar el POST. */

  public async classifyTicket(
    input: ClassifyTicketInput,
  ): Promise<ClassificationResult> {
    const apiKey = this.configService.get<string>('AI_API_KEY');
    if (!apiKey) {
      return {
        status: 'FAILED',
        error: 'AI_API_KEY is not configured',
      };
    }
    const categories = await this.prismaService.category.findMany({
      where: { active: true },
      orderBy: { id: 'asc' },
    });
    const priorities = await this.prismaService.priority.findMany({
      where: { active: true },
      orderBy: { id: 'asc' },
    });
    if (categories.length === 0 || priorities.length === 0) {
      return {
        status: 'FAILED',
        error: 'Category or priority catalog is empty',
      };
    }
    try {
      const rawJson = await this.requestStructuredClassification(
        input,
        categories.map((category) => category.name),
        priorities.map((priority) => priority.name),
        this.buildCatalogGuide(categories, priorities),
      );
      return this.parseAndValidateClassification(
        rawJson,
        categories,
        priorities,
      );
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown AI error';
      this.logger.warn(`Groq classification failed: ${errorMessage}`);
      return {
        status: 'FAILED',
        error: this.toPublicError(errorMessage),
      };
    }
  }

  private buildCatalogGuide(
    categories: { name: string; description: string }[],
    priorities: { name: string; description: string }[],
  ): string {
    const categoryLines = categories
      .map((category) => `- ${category.name}: ${category.description}`)
      .join('\n');
    const priorityLines = priorities
      .map((priority) => `- ${priority.name}: ${priority.description}`)
      .join('\n');
    return `Categories:\n${categoryLines}\n\nPriorities:\n${priorityLines}`;
  }

  private async requestStructuredClassification(
    input: ClassifyTicketInput,
    categoryNames: string[],
    priorityNames: string[],
    catalogGuide: string,
  ): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      model: this.model,
      temperature: 0,
      messages: [
        {
          role: 'system',
          content:
            'You classify operational tickets. Use only the provided category and priority names. If the request does not fit Finance, Legal, Procurement or Operations, use Unclassified. Reply with JSON only.',
        },
        {
          role: 'user',
          content: `${catalogGuide}\n\nTicket title: ${input.title}\n\nTicket description:\n${input.description}`,
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'ticket_classification',
          strict: true,
          schema: {
            type: 'object',
            additionalProperties: false,
            required: ['category', 'priority', 'summary'],
            properties: {
              category: { type: 'string', enum: categoryNames },
              priority: { type: 'string', enum: priorityNames },
              summary: { type: 'string' },
            },
          },
        },
      },
    });
    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from Groq');
    }
    return content;
  }

  private parseAndValidateClassification(
    rawJson: string,
    categories: { id: number; name: string }[],
    priorities: { id: number; name: string }[],
  ): ClassificationResult {
    const parsed = JSON.parse(rawJson) as GroqClassificationJson;
    const category = categories.find((item) => item.name === parsed.category);
    const priority = priorities.find((item) => item.name === parsed.priority);
    const summary = parsed.summary?.trim();
    if (!category || !priority || !summary) {
      return {
        status: 'FAILED',
        error: 'AI returned a value outside the catalog or an empty summary',
      };
    }
    return {
      status: 'SUCCESS',
      categoryId: category.id,
      priorityId: priority.id,
      summary,
    };
  }

  private toPublicError(errorMessage: string): string {
    if (errorMessage.toLowerCase().includes('timeout')) {
      return 'AI provider timed out';
    }
    if (
      errorMessage.includes('401') ||
      errorMessage.toLowerCase().includes('api key')
    ) {
      return 'AI provider rejected the API key';
    }
    return 'AI provider request failed';
  }
}
