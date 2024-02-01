import { ApiProperty } from "@nestjs/swagger";

export class SuggestMeetingDto {
    @ApiProperty({ example: ['user1@example.com', 'user2@example.com'] })
    participantEmails: string[];
}