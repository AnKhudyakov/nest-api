import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController , UserController} from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { RabbitMQModule } from './rabbit-mq.module';

@Module({
  providers: [UsersService],
  controllers: [UsersController, UserController],
  imports: [
    RabbitMQModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class UsersModule {}
