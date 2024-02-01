import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Meeting } from './meeting.entity';
import { User } from 'src/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { resolve } from 'path';

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

    async suggestMeetingTime(emails: string[]): Promise<Date[]> {
        const meetings = await this.meetingRepository.createQueryBuilder('meeting')
            .innerJoin('meeting.participants', 'participant')
            .where('participant.email IN (:...emails)', { emails })
            .andWhere('meeting.startTime > :currentTime', { currentTime: new Date() })
            .getMany();

        if (!meetings || meetings.length === 0) {
            return this.recommendTimeSlots();
        }

        const existingStartTimes: Date[] = meetings.map(meeting => new Date(meeting.startTime));

        return this.recommendTimeSlots(existingStartTimes);
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

    private recommendTimeSlots(existingStartTimes: Date[] | null = null): Date[] {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const timeSlots: Date[] = [];
        // Assuming office hours are from 9 AM to 5 PM
        for (let i = 9; i <= 17; i++) {
            const slotStart = new Date(tomorrow);
            slotStart.setHours(i, 0, 0);

            // UUser haven't planned any time slots, we can recommend the next in office hours
            if (existingStartTimes === null) {
                timeSlots.push(slotStart);
                continue;
            }

            // Checking if hour is in existibg start times
            if (!existingStartTimes.some(startTime => startTime.getHours() === slotStart.getHours())) {
                timeSlots.push(slotStart);
            }
        }

        return timeSlots;
    }
}
