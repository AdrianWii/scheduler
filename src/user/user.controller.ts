import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { CreateUpdateUserDto } from './dto/create-update-user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags("User")
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Post()
    create(@Body() createUserDto: CreateUpdateUserDto): Promise<User> {
        return this.userService.create(createUserDto);
    }

    @Get()
    findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<User> {
        return this.userService.findOne(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userService.remove(id);
    }
}
