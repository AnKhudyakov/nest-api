import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  HttpCode,
  Header,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';
import {
  MessagePattern,
  RmqContext,
  Ctx,
  Payload
} from '@nestjs/microservices';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header('Cache-Control', 'none')
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

}

@Controller('/api/user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  getById(@Param('id') id: string): Promise<User> {
    return this.usersService.getById(id);
  }

  @Get(':id/avatar')
  getAvatarById(@Param('id') id: string): Promise<string> {
    return this.usersService.getAvatarById(id);
  }

  @Delete(':id/avatar')
  removeByUserId(@Param('id') id: string): string {
    this.usersService.removeByUserId(id);
    return `Remove successfull`;
  }
}
