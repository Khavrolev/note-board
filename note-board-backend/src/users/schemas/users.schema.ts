import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Note } from '../../notes/schemas/notes.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Note' }) //почему не попадает?
  note: Note;
}

export const UserSchema = SchemaFactory.createForClass(User);
