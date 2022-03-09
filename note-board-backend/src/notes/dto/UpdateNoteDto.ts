import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class UpdateNoteDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  readonly text: string;

  @IsNumber()
  readonly top: number;

  @IsNumber()
  readonly left: number;
}
