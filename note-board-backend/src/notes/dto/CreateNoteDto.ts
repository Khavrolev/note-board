import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  readonly text: string;

  @IsMongoId()
  readonly userId: string;

  @IsString()
  @IsNotEmpty()
  readonly color: string;

  @IsNumber()
  readonly top: number;

  @IsNumber()
  readonly left: number;
}
