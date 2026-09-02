import { IsDateString, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  public readonly fullName: string;

  @IsDateString()
  public readonly dateOfBirth: string;

  @IsString()
  @MinLength(2)
  public readonly role: string;

  @IsString()
  @MinLength(2)
  public readonly profession: string;
}
