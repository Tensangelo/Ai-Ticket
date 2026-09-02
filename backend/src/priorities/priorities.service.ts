import { Injectable } from '@nestjs/common';
import { Priority } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PrioritiesService {
  constructor(private readonly prismaService: PrismaService) {}

  public async findAllPriorities(): Promise<Priority[]> {
    return this.prismaService.priority.findMany({
      where: { active: true },
      orderBy: { id: 'asc' },
    });
  }
}
