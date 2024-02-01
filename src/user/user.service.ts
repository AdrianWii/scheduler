import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { User } from './user.entity';
import { CreateUpdateUserDto } from './dto/create-update-user.dto';
import { Meeting } from 'src/meeting/meeting.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Meeting)
        private readonly meetingRepository: Repository<Meeting>,
    ) { }

    async create(createUserDto: CreateUpdateUserDto): Promise<User> {
        const user = this.userRepository.create(createUserDto);
        return await this.userRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async findOne(id: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return (user);
    }

    async remove(id: string) {

        const result = await this.userRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`The user "${id}" was not found`);
        }
        return { message: 'User successfully deleted' };
    }

    async getUpcomingMeetingsByUserId(id: string): Promise<Meeting[]> {
        const user = await this.userRepository.findOne({ where: { id: id } });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        const now = new Date();
        return await this.meetingRepository
            .createQueryBuilder('meeting')
            .innerJoin('meeting.participants', 'participant')
            .where('participant.id = :id', { id })
            .andWhere('meeting.startTime > :now', { now })
            .orderBy('meeting.startTime', 'ASC')
            .getMany();
    }
}
