import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { User } from './user.entity';
import { CreateUpdateUserDto } from './dto/create-update-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
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
}
