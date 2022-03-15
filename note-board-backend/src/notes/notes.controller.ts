import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/CreateNoteDto';
import { NoteIdDto } from './dto/NoteIdDto';
import { UpdateNoteDto } from './dto/UpdateNoteDto';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  getAll() {
    return this.notesService.getAll();
  }

  @Get('user/:name')
  getByUserName(@Param('name') name: string) {
    return this.notesService.getByUserName(name);
  }

  @Get(':id')
  getById(@Param() dto: NoteIdDto) {
    return this.notesService.getById(dto._id);
  }

  @Post()
  createNote(@Body() dto: CreateNoteDto) {
    return this.notesService.createNote(dto);
  }

  @Put()
  updateNote(@Body() dto: UpdateNoteDto) {
    return this.notesService.updateNote(dto);
  }

  @Delete(':id')
  deleteNote(@Param() dto: NoteIdDto) {
    return this.notesService.deleteNote(dto._id);
  }
}
