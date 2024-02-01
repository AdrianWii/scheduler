import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { MeetingModule } from './meeting/meeting.module';
import { Meeting } from './meeting/meeting.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db/sql',
      synchronize: true,
      entities: [User, Meeting],
    }),
    UserModule,
    MeetingModule
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
