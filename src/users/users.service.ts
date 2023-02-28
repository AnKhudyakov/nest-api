import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import axios from 'axios';
import * as fs from 'fs';
import { RabbitMQService } from './rabbit-mq.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly rabbitMQService: RabbitMQService,
    private readonly mailerService: MailerService,
  ) {}

  async getById(id: string): Promise<User> {
    const url = `https://reqres.in/api/users/${id}`;
    const response = await axios.get(url);
    const user = response.data;
    return user;
  }

  async create(userDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(userDto);
    const createdUser = await newUser.save();
    const message = `User added ${createdUser._id}`;
    // RabbitMQ
    this.rabbitMQService.send('rabbit-mq-producer', {
      message,
    });
    // send Email
    this.mailerService.sendMail({
      subject: message,
      text: message,
    });
    return createdUser;
  }

  removeByUserId(id: string): void {
    if (fs.existsSync(`./avatars/${id}`)) {
      fs.unlinkSync(`./avatars/${id}`);
    }
  }

  async getAvatarById(id: string): Promise<string> {
    let avatarFile: Buffer;
    if (fs.existsSync(`./avatars/${id}`)) {
      avatarFile = fs.readFileSync(`./avatars/${id}`);
    } else {
      const url = `https://reqres.in/api/users/${id}`;

      const response = await axios.get(url);
      const user = response.data;
      const { avatar } = user.data;
      const responseAvatar = await axios.get(avatar, {
        responseType: 'arraybuffer',
      });
      avatarFile = responseAvatar.data;

      fs.writeFileSync(`./avatars/${id}`, avatarFile);
    }
    return avatarFile.toString('base64');
  }
}
