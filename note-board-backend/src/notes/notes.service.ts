import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { CreateNoteDto } from './dto/CreateNoteDto';
import { UpdateNoteDto } from './dto/UpdateNoteDto';
import { Note, NoteDocument } from './schemas/notes.schema';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name)
    private readonly notesModel: Model<NoteDocument>,
    private readonly usersService: UsersService,
  ) {}

  getAll() {
    return this.notesModel.find().populate('user').exec();
  }

  async createNote(dto: CreateNoteDto) {
    const user = await this.usersService.getOneById(dto.userId);

    const newNote = new this.notesModel({ ...dto, user });

    return newNote.save();
  }

  async updateNote(dto: UpdateNoteDto) {
    const { _id, text, top, left } = dto;

    const updatedNote = await this.notesModel
      .findOneAndUpdate({ _id }, { text, top, left }, { returnOriginal: false })
      .populate('user');

    this.checkNote(updatedNote, _id);

    return updatedNote;
  }

  async deleteNote(_id: string) {
    const note = await this.notesModel.findOneAndRemove({ _id });

    this.checkNote(note, _id);

    return note;
  }

  private checkNote(note: Note, id: string) {
    if (!note) {
      throw new NotFoundException(`No Note with id = '${id}'`);
    }
  }
}
