import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/users.schema';

export type NoteDocument = Note & Document;

@Schema()
export class Note {
  @Prop()
  text: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true, min: 0 })
  top: number;

  @Prop({ required: true, min: 0 })
  left: number;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
