import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Meeting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'datetime' })
  startTime: Date;

  @ManyToMany(() => User)
  @JoinTable()
  participants: User[];

  constructor(title: string, startTime: Date, participants: User[]) {
    this.title = title;
    this.startTime = startTime;
    this.participants = participants;
  }
}