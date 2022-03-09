import { IsMongoId } from 'class-validator';
export class NoteIdDto {
  @IsMongoId()
  readonly id: string;
}
