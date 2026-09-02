import { Module } from '@nestjs/common';
import { PrioritiesController } from './priorities.controller.js';
import { PrioritiesService } from './priorities.service.js';

@Module({
  controllers: [PrioritiesController],
  providers: [PrioritiesService],
})
export class PrioritiesModule {}
