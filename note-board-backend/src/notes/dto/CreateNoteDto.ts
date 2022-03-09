import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  readonly text: string;

  @IsString()
  @IsNotEmpty()
  readonly userName: string;

  @IsNumber()
  readonly top: number;

  @IsNumber()
  readonly left: number;
}
