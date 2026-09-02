import { Injectable } from '@nestjs/common';
import { User } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Devuelve todos los usuarios, incluidos los del seed.
   */
  public async findAllUsers(): Promise<User[]> {
    return this.prismaService.user.findMany({
      orderBy: { fullName: 'asc' },
    });
  }

  /**
   * Crea un perfil simulado. No es una cuenta con autenticación.
   */
  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.prismaService.user.create({
      data: {
        fullName: createUserDto.fullName,
        dateOfBirth: new Date(createUserDto.dateOfBirth),
        role: createUserDto.role,
        profession: createUserDto.profession,
      },
    });
  }
}
