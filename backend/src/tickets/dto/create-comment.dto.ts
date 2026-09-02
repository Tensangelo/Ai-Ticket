import { IsString, MinLength } from 'class-validator';

/* Comentario firmado con el nombre local del operador (no hay login). */
export class CreateCommentDto {
  @IsString()
  @MinLength(2)
  public readonly content: string;

  @IsString()
  @MinLength(2)
  public readonly authorName: string;

  @IsString()
  @MinLength(2)
  public readonly authorRole: string;
}
