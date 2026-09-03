import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Status } from '../../generated/prisma/client.js';

export class UpdateTicketDto {
  @IsOptional()
  @IsEnum(Status)
  public readonly status?: Status;

  @IsOptional()
  @ValidateIf((_, value: unknown) => value !== null)
  @IsUUID()
  public readonly ownerId?: string | null;

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
