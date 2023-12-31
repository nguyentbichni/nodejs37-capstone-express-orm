import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UserService {
  private readonly prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  create(createUserDto: CreateUserDto) {
    const user = this.prisma.users.create({
      data: {
        ...createUserDto,
      },
    });
    return user;
  }

  findAll() {
    const users = this.prisma.users.findMany();
    return users;
  }

  findOne(id: number) {
    const user = this.prisma.users.findUnique({
      where: {
        id: id,
      },
    });
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const user = this.prisma.users.update({
      where: {
        id: id,
      },
      data: {
        ...updateUserDto,
      },
    });
    return user;
  }

  remove(id: number) {
    this.prisma.users.update({
      where: {
        id: id,
      },
      data: {
        deleted_at: new Date(),
      },
    });
    return `This action removes a #${id} user`;
  }
}
