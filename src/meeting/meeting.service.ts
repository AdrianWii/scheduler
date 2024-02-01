import { BadRequestException, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Meeting } from './meeting.entity';
import { User } from 'src/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMeetingDto } from './dto/create-meeting.dto';

@Injectable()
export class MeetingService {
    constructor(
        @InjectRepository(Meeting)
        private readonly meetingRepository: Repository<Meeting>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async createMeeting(createMeetingDto: CreateMeetingDto): Promise<Meeting> {
        const { title, startTime, participantEmails } = createMeetingDto;
        const emails = this.removeDuplicateEmails(participantEmails);

        const participants = await this.userRepository.findBy({ email: In(emails) })

        if (participants.length !== emails.length) {
            throw new BadRequestException('One or more participants not found. Make sure all users belong to your organization.');
        }

        const meeting = new Meeting(title, startTime, participants);
        return await this.meetingRepository.save(meeting);
    }

    async getAllMeetingsWithParticipants(): Promise<Meeting[]> {
        return await this.meetingRepository.find({ relations: ['participants'] });
    }

    private removeDuplicateEmails(emails: string[]): string[] {
        const uniqueEmailsSet: Set<string> = new Set();
        emails.forEach(email => uniqueEmailsSet.add(email));

        return Array.from(uniqueEmailsSet);
    }
}
