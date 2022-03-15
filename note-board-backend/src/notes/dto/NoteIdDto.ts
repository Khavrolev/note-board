import { IsMongoId } from 'class-validator';
export class NoteIdDto {
  @IsMongoId()
  readonly _id: string;
}
