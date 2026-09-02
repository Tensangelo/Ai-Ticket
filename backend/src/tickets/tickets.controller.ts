import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';
import { TicketsService } from './tickets.service.js';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get('test')
  public getTestStatus(): { status: string } {
    return { status: 'ok' };
  }

  @Get()
  public async findAllTickets() {
    return this.ticketsService.findAllTickets();
  }

  @Get(':id')
  public async findTicketById(@Param('id', ParseUUIDPipe) ticketId: string) {
    return this.ticketsService.findTicketById(ticketId);
  }

  /**
   * Crea el ticket, llama a Groq y devuelve el registro ya clasificado o con FAILED.
   */
  @Post()
  public async createTicket(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.createTicket(createTicketDto);
  }

  @Patch(':id')
  public async updateTicket(
    @Param('id', ParseUUIDPipe) ticketId: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    return this.ticketsService.updateTicket(ticketId, updateTicketDto);
  }

  @Post(':id/comments')
  public async createComment(
    @Param('id', ParseUUIDPipe) ticketId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.ticketsService.createComment(ticketId, createCommentDto);
  }
}
