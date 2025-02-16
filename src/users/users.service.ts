import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userModel: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    try {
      const user = this.userModel.create(createUserDto);
      await this.userModel.save(user);
      return {
        user,
        message: 'User created successfully',
      };
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e);
    }
  }

  async findAll() {
    try {
      const users = await this.userModel.find({
        order: { createdAt: 'DESC' },
      });
      return {
        data: users,
        message: 'Users retrieved successfully',
      };
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e);
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      if (!isUUID(id)) {
        throw new BadRequestException('Invalid ID provided', id);
      }
      const user = await this.userModel.findOne({
        where: { id: id },
      });
      if (!user) {
        throw new BadRequestException(
          'User not found with the provided ID',
          id,
        );
      }
      return {
        data: user,
        message: 'User retrieved successfully',
      };
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    try {
      if (!isUUID(id)) {
        throw new BadRequestException('Invalid ID provided', id);
      }
      let user = await this.userModel.findOne({
        where: { id: id },
      });
      if (!user) {
        throw new BadRequestException(
          'User not found with the provided ID',
          id,
        );
      }
      Object.assign(user, updateUserDto);
      user = await this.userModel.save(user);
      return {
        data: user,
        message: 'User updated successfully',
      };
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e);
    }
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
