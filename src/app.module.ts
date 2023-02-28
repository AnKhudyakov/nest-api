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
      `${process.env.MONGO_URL}`,
    ),
    MailerModule.forRoot({
      transport: 'smtp://localhost:25',
      defaults: {
        from: `"Andrey" <${process.env.EMAIL}>`,
        to: `${process.env.EMAIL}`,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
