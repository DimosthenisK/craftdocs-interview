import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { BearerAuthGuard } from './authentication/guards/bearer.guard';
import { CurrentUser } from './decorators';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@ApiBearerAuth('bearer')
@UseGuards(BearerAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findOne(@CurrentUser() user: User) {
    return this.userService.findOne(user.id);
  }

  @Patch()
  update(@CurrentUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(user.id, updateUserDto);
  }
}
