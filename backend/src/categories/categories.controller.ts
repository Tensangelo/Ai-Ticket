import { Controller, Get } from '@nestjs/common';
import { Category } from '../generated/prisma/client.js';
import { CategoriesService } from './categories.service.js';

/**
 * GET /categories — catálogo de solo lectura.
 */
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  public async findAllCategories(): Promise<Category[]> {
    return this.categoriesService.findAllCategories();
  }
}
