import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { BearerAuthGuard } from './authentication/guards/bearer.guard';
import { CurrentUser } from './decorators';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('User')
@ApiBearerAuth('bearer')
@UseGuards(BearerAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOkResponse({ type: UserEntity })
  findOne(@CurrentUser() user: User) {
    return this.userService.findOne(user.id);
  }

  @Patch()
  @ApiOkResponse({ type: UserEntity })
  update(@CurrentUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(user.id, updateUserDto);
  }
}
