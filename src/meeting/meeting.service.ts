import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
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

        const overlappingMeetings = await this.getOverlappingMeetings(startTime, participants);
        if (overlappingMeetings.length > 0) {
            throw new ConflictException('A meeting already exists for one or more participants during the given time slot.');
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

    private async getOverlappingMeetings(startTime: Date, participants: User[]) {
        const meetingStartTime = new Date(startTime);
        const endTime = new Date(meetingStartTime.getTime() + 3600000);

        const overlappingMeetings = await this.meetingRepository.createQueryBuilder('meeting')
        .innerJoin('meeting.participants', 'participant')
        .where('participant.email IN (:...participantEmails)', { participantEmails: participants.map(participant => participant.email) })
        .andWhere('(meeting.startTime < :endTime AND :startTime < datetime(meeting.startTime, "+60 minutes"))', { startTime: meetingStartTime, endTime: endTime })
        .getMany();

        return overlappingMeetings;
    }
}
