import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateMeetingDto {
    @ApiProperty({ example: 'Weekly Team Meeting' })
    @IsNotEmpty({ message: 'Field email must be added' })
    title: string;
    
    @ApiProperty({ example: '2024-02-01T10:00:00Z' })
    @IsNotEmpty({ message: 'Field email must be added' })
    startTime: Date;
    
    @ApiProperty({ example: ['user1@example.com', 'user2@example.com'] })
    participantEmails: string[];
}