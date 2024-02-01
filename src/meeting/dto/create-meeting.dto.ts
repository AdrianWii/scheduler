import { ApiProperty } from "@nestjs/swagger";

export class CreateMeetingDto {
    @ApiProperty({ example: 'Weekly Team Meeting' })
    title: string;
    
    @ApiProperty({ example: '2024-02-01T10:00:00Z' })
    startTime: Date;
    
    @ApiProperty({ example: ['user1@example.com', 'user2@example.com'] })
    participantEmails: string[];
}