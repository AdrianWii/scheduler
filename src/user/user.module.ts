import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Meeting } from 'src/meeting/meeting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Meeting])],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
