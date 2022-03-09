import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

  async getOneByUserName(name: string) {
    const user = await this.usersService.getOneByName(name, CheckUser.MustBe);

    const note = await this.notesModel
      .findOne({ user: user._id })
      .populate('user')
      .exec();

    this.checkNote(note, name);

    return note;
  }

  async createNote(dto: CreateNoteDto) {
    const user = await this.usersService.getOneByName(
      dto.userName,
      CheckUser.MustBe,
    );

    this.checkNoNote(user?.note, user.name);

    const newNote = new this.notesModel({ ...dto, user });

    user.note = newNote._id;
    await user.save();

    return newNote.save();
  }

  async updateNote(dto: UpdateNoteDto) {
    const user = await this.usersService.getOneByName(
      dto.userName,
      CheckUser.MustBe,
    );

    const updatedNote = await this.notesModel
      .findOneAndUpdate(
        { user: user._id },
        { text: dto.text, top: dto.top, left: dto.left },
        { returnOriginal: false },
      )
      .populate('user');

    this.checkNote(updatedNote, dto.userName);

    return updatedNote;
  }

  async deleteNote(name: string) {
    const user = await this.usersService.getOneByName(name, CheckUser.MustBe);

    const note = await this.notesModel
      .findOneAndRemove({ user: user._id })
      .populate('user');

    this.checkNote(note, name);

    user.note = undefined;
    await user.save();

    return note;
  }

  private checkNote(note: Note, name: string) {
    if (!note) {
      throw new NotFoundException(`No Note with author's username = '${name}'`);
    }
  }

  private checkNoNote(note: Note, name: string) {
    if (note) {
      throw new BadRequestException(
        `There's Note with author's username = '${name}'`,
      );
    }
  }
}
