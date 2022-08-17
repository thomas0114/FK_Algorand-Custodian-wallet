import {
  IsString,
  ValidateNested,
  Min,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { StringLiteralLike } from 'typescript';

class CreateUserDto {
  @IsString()
  public fullName: string;

  @IsString()
  public email: string;

  @IsString()
  public password: string;
}

export default CreateUserDto;
