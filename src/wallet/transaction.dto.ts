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

export class AlgoTransaction {
  @IsNotEmpty()
  @Length(58, 58)
  public from: string;

  @IsNotEmpty()
  @Length(58, 58)
  public to: string;

  @IsNotEmpty()
  @IsNumberString()
  @Matches(/^[+]?((\d+(\.\d*)?)|(\.\d+))$/)
  public fee: string;

  @IsNotEmpty()
  @IsNumberString()
  @Matches(/^[+]?((\d+(\.\d*)?)|(\.\d+))$/)
  public amount: string;

  @IsOptional()
  @MaxLength(30)
  public note: string;

  @IsNotEmpty()
  public fromPrivateKey: string;
}
