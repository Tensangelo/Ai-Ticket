import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from '../generated/prisma/client.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('test')
  public getTestStatus(): { status: string } {
    return { status: 'ok' };
  }

  @Get()
  public async findAllUsers(): Promise<User[]> {
    return this.usersService.findAllUsers();
  }

  @Post()
  public async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }
}
