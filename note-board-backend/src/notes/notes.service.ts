import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CheckUser, UsersService } from '../users/users.service';
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

  async getByUserName(name: string) {
    const user = await this.usersService.getOneByName(
      name,
      CheckUser.MustBe,
      false,
    );

    const notes = await this.notesModel
      .find({ user: user._id })
      .populate('user')
      .exec();

    return notes;
  }

  async getById(_id: string) {
    const note = await this.notesModel
      .findOne({ _id: new Types.ObjectId(_id) })
      .populate('user')
      .exec();

    this.checkNote(note, _id);

    return note;
  }

  async createNote(dto: CreateNoteDto) {
    const user = await this.usersService.getOneByName(
      dto.userName,
      CheckUser.MustBe,
      false,
    );

    const newNote = new this.notesModel({ ...dto, user });

    user.notes.push(newNote._id);
    await user.save();

    return newNote.save();
  }

  async updateNote(dto: UpdateNoteDto) {
    const updatedNote = await this.notesModel
      .findOneAndUpdate(
        { _id: dto.id },
        { text: dto.text, top: dto.top, left: dto.left },
        { returnOriginal: false },
      )
      .populate('user');

    this.checkNote(updatedNote, dto.id);

    return updatedNote;
  }

  async deleteNote(_id: string) {
    const note = await this.notesModel
      .findOneAndRemove({ _id })
      .populate('user');

    this.checkNote(note, _id);

    const user = await this.usersService.getOneByName(
      note.user.name,
      CheckUser.MustBe,
      false,
    );

    const index = user.notes.indexOf(note._id);
    if (index > -1) {
      user.notes.splice(index, 1);
    }

    await user.save();

    return note;
  }

  private checkNote(note: Note, id: string) {
    if (!note) {
      throw new NotFoundException(`No Note with id = '${id}'`);
    }
  }
}
