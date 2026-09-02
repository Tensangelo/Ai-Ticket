import { Injectable } from '@nestjs/common';
import { Category } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  public async findAllCategories(): Promise<Category[]> {
    return this.prismaService.category.findMany({
      where: { active: true },
      orderBy: { id: 'asc' },
    });
  }
}
