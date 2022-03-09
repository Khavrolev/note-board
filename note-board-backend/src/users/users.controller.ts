import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUserDto';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { CheckUser, UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAll() {
    return this.usersService.getAll();
  }

  @Get(':name')
  getOneByName(@Param('name') name: string) {
    return this.usersService.getOneByName(name, CheckUser.MustBe);
  }

  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Put()
  updateUser(@Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(dto);
  }

  @Delete(':name')
  deleteUser(@Param('name') name: string) {
    return this.usersService.deleteUser(name);
  }
}
