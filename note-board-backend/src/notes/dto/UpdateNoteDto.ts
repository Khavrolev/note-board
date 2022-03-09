import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class UpdateNoteDto {
  @IsMongoId()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  readonly text: string;

  @IsNumber()
  readonly top: number;

  @IsNumber()
  readonly left: number;
}
