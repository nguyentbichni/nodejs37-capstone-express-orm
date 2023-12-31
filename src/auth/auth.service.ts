import { Injectable, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private prisma: PrismaClient;
  constructor(private jwtService: JwtService) {
    this.prisma = new PrismaClient();
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    // check user
    const user = await this.prisma.users.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new HttpException(
        {
          status: 400,
          message: 'User not found',
        },
        400,
      );
    }

    // check password
    const isPasswordValid = await bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(
        {
          status: 400,
          message: 'Password is not valid',
        },
        400,
      );
    }

    // generate token
    const token = await this.jwtService.signAsync(
      {
        data: {
          id: user.id,
          email: user.email,
        },
      },
      {
        expiresIn: '1h',
        secret: 'BI_MAT',
      },
    );
    return token;
  }

  async register(registerDto: RegisterDto) {
    const { email, password, fullName } = registerDto;
    // check user
    const user = await this.prisma.users.findFirst({
      where: {
        email: email,
      },
    });
    if (user) {
      throw new HttpException(
        {
          status: 400,
          message: 'Email is already in use',
        },
        400,
      );
    }

    // hash password
    const hashPassword = await bcrypt.hashSync(password, 10);

    // create user
    const newUser = this.prisma.users.create({
      data: {
        email,
        password: hashPassword,
        full_name: fullName,
      },
    });
    return newUser;
  }
}
