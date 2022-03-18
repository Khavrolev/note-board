import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { NotesService } from './notes.service';
import { Note, NoteSchema } from './schemas/notes.schema';

@Module({
  providers: [NotesService],
  imports: [
    MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
    UsersModule,
  ],
  exports: [NotesService],
})
export class NotesModule {}
