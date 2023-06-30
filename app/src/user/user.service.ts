import { CreateUserDto } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  findOne(id: string) {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  findOneByName(name: string) {
    return this.prismaService.user.findUnique({ where: { name } });
  }

  create(createUserDto: CreateUserDto) {
    return this.prismaService.user.create({ data: createUserDto });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }
}
