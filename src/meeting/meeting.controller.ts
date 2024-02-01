import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MeetingService } from './meeting.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { Meeting } from './meeting.entity';

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
}
