import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AiService } from '../ai/ai.service.js';
import { ClassificationResult } from '../ai/classify-ticket.result.js';
import { catalogNames } from '../catalogs/catalog-names.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';

const ticketDetailInclude = {
  category: true,
  priority: true,
  owner: true,
  comments: {
    orderBy: { createdAt: 'asc' as const },
  },
};

const ticketListInclude = {
  category: true,
  priority: true,
  owner: true,
} as const;

@Injectable()
export class TicketsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly aiService: AiService,
  ) {}

  public async findAllTickets() {
    return this.prismaService.ticket.findMany({
      include: ticketListInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  public async findTicketById(ticketId: string) {
    const ticket = await this.prismaService.ticket.findUnique({
      where: { id: ticketId },
      include: ticketDetailInclude,
    });
    if (!ticket) {
      throw new NotFoundException(`Ticket ${ticketId} was not found`);
    }
    return ticket;
  }

  /**
   * Alta de ticket. Orden:
   * 1) Guardar siempre (Unclassified + Medium + PENDING) — la IA no bloquea la creacion
   * 2) Pedir clasificacion a AiService (Groq)
   * 3) Actualizar el mismo ticket con SUCCESS o FAILED
   * 4) Devolver el ticket ya enriquecido (o con error visible)
   */
  public async createTicket(createTicketDto: CreateTicketDto) {
    const savedTicket = await this.savePendingTicket(createTicketDto);
    const classification = await this.aiService.classifyTicket({
      title: createTicketDto.title,
      description: createTicketDto.description,
    });
    return this.applyClassification(savedTicket.id, classification);
  }

  private async savePendingTicket(createTicketDto: CreateTicketDto) {
    const unclassifiedCategory = await this.prismaService.category.findUnique({
      where: { name: catalogNames.unclassified },
    });
    const mediumPriority = await this.prismaService.priority.findUnique({
      where: { name: catalogNames.medium },
    });
    if (!unclassifiedCategory || !mediumPriority) {
      throw new InternalServerErrorException(
        'Catalog seed is missing Unclassified or Medium',
      );
    }
    return this.prismaService.ticket.create({
      data: {
        customerName: createTicketDto.customerName,
        title: createTicketDto.title,
        description: createTicketDto.description,
        attachmentUrl: createTicketDto.attachmentUrl,
        categoryId: unclassifiedCategory.id,
        priorityId: mediumPriority.id,
        classificationStatus: 'PENDING',
      },
    });
  }

  private async applyClassification(
    ticketId: string,
    classification: ClassificationResult,
  ) {
    if (classification.status === 'FAILED') {
      return this.prismaService.ticket.update({
        where: { id: ticketId },
        data: {
          classificationStatus: 'FAILED',
          classificationError: classification.error,
        },
        include: ticketDetailInclude,
      });
    }
    return this.prismaService.ticket.update({
      where: { id: ticketId },
      data: {
        categoryId: classification.categoryId,
        priorityId: classification.priorityId,
        summary: classification.summary,
        classificationStatus: 'SUCCESS',
        classificationError: null,
      },
      include: ticketDetailInclude,
    });
  }


  public async updateTicket(
    ticketId: string,
    updateTicketDto: UpdateTicketDto,
  ) {
    await this.findTicketById(ticketId);
    if (updateTicketDto.ownerId) {
      await this.findExistingUser(updateTicketDto.ownerId);
    }
    if (updateTicketDto.categoryId !== undefined) {
      await this.findActiveCategory(updateTicketDto.categoryId);
    }
    if (updateTicketDto.priorityId !== undefined) {
      await this.findActivePriority(updateTicketDto.priorityId);
    }
    return this.prismaService.ticket.update({
      where: { id: ticketId },
      data: {
        status: updateTicketDto.status,
        ownerId: updateTicketDto.ownerId,
        categoryId: updateTicketDto.categoryId,
        priorityId: updateTicketDto.priorityId,
        summary: updateTicketDto.summary,
      },
      include: ticketDetailInclude,
    });
  }

  /* Agrega un comentario al ticket. 404 si el ticket no existe. */
  public async createComment(
    ticketId: string,
    createCommentDto: CreateCommentDto,
  ) {
    await this.findTicketById(ticketId);
    return this.prismaService.comment.create({
      data: {
        ticketId,
        content: createCommentDto.content,
      },
    });
  }

  private async findExistingUser(userId: string): Promise<void> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new BadRequestException(`User ${userId} was not found`);
    }
  }

  private async findActiveCategory(categoryId: number): Promise<void> {
    const category = await this.prismaService.category.findFirst({
      where: { id: categoryId, active: true },
    });
    if (!category) {
      throw new BadRequestException(`Category ${categoryId} is not available`);
    }
  }

  private async findActivePriority(priorityId: number): Promise<void> {
    const priority = await this.prismaService.priority.findFirst({
      where: { id: priorityId, active: true },
    });
    if (!priority) {
      throw new BadRequestException(`Priority ${priorityId} is not available`);
    }
  }
}
