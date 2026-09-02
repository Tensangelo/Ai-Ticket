import { IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @MinLength(2)
  public readonly customerName: string;

  @IsString()
  @MinLength(3)
  public readonly title: string;

  @IsString()
  @MinLength(10)
  public readonly description: string;

  @IsOptional()
  @IsUrl()
  public readonly attachmentUrl?: string;
}
