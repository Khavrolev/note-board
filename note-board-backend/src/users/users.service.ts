import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/CreateUserDto';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { User, UserDocument } from './schemas/users.schema';

export enum CheckUser {
  DontCheck,
  MustBe,
  MustNotBe,
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly usersModel: Model<UserDocument>,
  ) {}

  getAll() {
    return this.usersModel.find().populate('notes').exec();
  }

  async getOneByName(name: string, check: CheckUser, isPopulate: boolean) {
    const user = isPopulate
      ? await this.usersModel.findOne({ name }).populate('notes').exec()
      : await this.usersModel.findOne({ name }).exec();

    if (check === CheckUser.MustBe) {
      this.checkUser(user, name);
    } else if (check === CheckUser.MustNotBe) {
      this.checkNoUser(user);
    }

    return user;
  }

  async createUser(dto: CreateUserDto) {
    const user = await this.usersModel.findOne({ name: dto.name }).exec();

    this.checkNoUser(user);

    const newUser = new this.usersModel(dto);
    return newUser.save();
  }

  async updateUser(dto: UpdateUserDto) {
    const user = await this.usersModel
      .findOne({ name: dto.newName })
      .populate('notes')
      .exec();

    this.checkNoUser(user);

    const updatedUser = await this.usersModel.findOneAndUpdate(
      { name: dto.name },
      { name: dto.newName },
      { returnOriginal: false },
    );

    this.checkUser(updatedUser, dto.name);

    return updatedUser;
  }

  async deleteUser(name: string) {
    const user = await this.getOneByName(name, CheckUser.MustBe, false);

    if (user?.notes.length !== 0) {
      throw new BadRequestException(
        `There's Notes of this user = '${user.name}'`,
      );
    }

    return this.usersModel.findOneAndRemove({ name });
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
