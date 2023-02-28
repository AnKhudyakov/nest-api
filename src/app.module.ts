import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot(
      `mongodb+srv://Duhless:Duhless153@cluster0.ffk9bnw.mongodb.net/payever`,
    ),
    MailerModule.forRoot({
      transport: 'smtp://localhost:25',
      defaults: {
        from: '"Andrey" <khandrewv@gmail.com>',
        to: 'khandrewv@gmail.com',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
