import { Controller, Get, Post, Body, BadRequestException } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MeetingService } from './meeting.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { Meeting } from './meeting.entity';
import { SuggestMeetingDto } from './dto/suggest-meeting.dto';

@Controller('meeting')
@ApiTags("Meeting")
export class MeetingController {

    constructor(private readonly meetingService: MeetingService) { }

    @Get()
    async findAl(): Promise<Meeting[]> {
      return await this.meetingService.getAllMeetingsWithParticipants();
    }

    @Post()
    @ApiResponse({ status: 201, description: 'Meeting created successfully', type: Meeting })
    @ApiResponse({ status: 400, description: 'One or more participants not found' })
    @ApiResponse({ status: 409, description: 'A meeting already exists for one or more participants during the given time slot.' })
    async createMeeting(@Body() createMeetingDto: CreateMeetingDto) {
        return await this.meetingService.createMeeting(createMeetingDto);
    }

    @Post('suggestion')
    @ApiResponse({ status: 201, description: 'Meeting timeslots finded', type: Date })
    @ApiResponse({ status: 400, description: 'At least two participant emails are required.' })
    async suggestMeetingTime(@Body() suggestMeetingDto: SuggestMeetingDto) {
        const { participantEmails } = suggestMeetingDto;

        if (participantEmails.length < 2) {
          throw new BadRequestException('At least two participant emails are required.');
        }

        return await this.meetingService.suggestMeetingTime(participantEmails);
    }
}
