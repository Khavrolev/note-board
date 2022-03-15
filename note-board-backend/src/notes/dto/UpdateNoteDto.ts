import { IsMongoId, IsNumber, IsString } from 'class-validator';
export class UpdateNoteDto {
  @IsMongoId()
  readonly _id: string;

  @IsString()
  readonly text: string;

  @IsNumber()
  readonly top: number;

  @IsNumber()
  readonly left: number;
}
