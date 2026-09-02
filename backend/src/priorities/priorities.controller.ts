import { Controller, Get } from '@nestjs/common';
import { Priority } from '../generated/prisma/client.js';
import { PrioritiesService } from './priorities.service.js';

@Controller('priorities')
export class PrioritiesController {
  constructor(private readonly prioritiesService: PrioritiesService) {}

  @Get()
  public async findAllPriorities(): Promise<Priority[]> {
    return this.prioritiesService.findAllPriorities();
  }
}
