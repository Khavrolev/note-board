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
import { UpdateNoteDto } from './dto/UpdateNoteDto';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  getAll() {
    return this.notesService.getAll();
  }

  @Get(':name')
  getOneByUserName(@Param('name') name: string) {
    return this.notesService.getOneByUserName(name);
  }

  @Post()
  createNote(@Body() dto: CreateNoteDto) {
    return this.notesService.createNote(dto);
  }

  @Put()
  updateNote(@Body() dto: UpdateNoteDto) {
    return this.notesService.updateNote(dto);
  }

  @Delete(':name')
  deleteNote(@Param('name') name: string) {
    return this.notesService.deleteNote(name);
  }
}
