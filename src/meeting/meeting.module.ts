import { Module } from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { MeetingController } from './meeting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meeting } from './meeting.entity';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Meeting, User])],
  providers: [MeetingService],
  controllers: [MeetingController]
})
export class MeetingModule {}
