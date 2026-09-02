import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { Status } from '../../generated/prisma/client.js';

export class UpdateTicketDto {
  @IsOptional()
  @IsEnum(Status)
  public readonly status?: Status;

  @IsOptional()
  @IsUUID()
  public readonly ownerId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  public readonly categoryId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  public readonly priorityId?: number;

  @IsOptional()
  @IsString()
  @MinLength(3)
  public readonly summary?: string;
}
