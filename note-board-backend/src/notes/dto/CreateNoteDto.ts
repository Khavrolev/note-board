import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  readonly text: string;

  @IsString()
  @IsNotEmpty()
  readonly userName: string;

  @IsString()
  @IsNotEmpty()
  readonly color: string;

  @IsNumber()
  readonly top: number;

  @IsNumber()
  readonly left: number;
}
