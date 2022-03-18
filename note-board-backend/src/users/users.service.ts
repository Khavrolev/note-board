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

  async getOneByName(name: string, isPopulate: boolean) {
    const user = isPopulate
      ? await this.usersModel.findOne({ name }).populate('notes').exec()
      : await this.usersModel.findOne({ name }).exec();

    this.checkUser(user, name);

    return user;
  }

  async createUser(dto: CreateUserDto) {
    const user = await this.usersModel.findOne({ name: dto.name }).exec();

    this.checkNoUser(user);

    const newUser = new this.usersModel(dto);
    return newUser.save();
  }

  private checkUser(user: User, name: string) {
    if (!user) {
      throw new NotFoundException(`No User with name = '${name}'`);
    }
  }

  private checkNoUser(user: User) {
    if (user) {
      throw new BadRequestException(`There's User with name = '${user.name}'`);
    }
  }
}
