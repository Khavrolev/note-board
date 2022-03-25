import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/CreateUserDto';
import { User, UserDocument } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly usersModel: Model<UserDocument>,
  ) {}

  async getOneByName(name: string) {
    const user = await this.usersModel.findOne({ name }).exec();

    this.checkUser(user, name, true);

    return user;
  }

  async getOneById(_id: string) {
    const user = await this.usersModel.findOne({ _id }).exec();

    this.checkUser(user, _id, false);

    return user;
  }

  async createUser(dto: CreateUserDto) {
    const { name } = dto;

    const user = await this.usersModel.findOne({ name }).exec();

    this.checkNoUser(user);

    const newUser = new this.usersModel(dto);
    return newUser.save();
  }

  private checkUser(user: User, value: string, checkByName: boolean) {
    if (!user) {
      throw new NotFoundException(
        `No User with ${checkByName ? 'name' : 'id'} = '${value}'`,
      );
    }
  }

  private checkNoUser(user: User) {
    if (user) {
      throw new BadRequestException(`There's User with name = '${user.name}'`);
    }
  }
}
