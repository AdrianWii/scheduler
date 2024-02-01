import { Meeting } from 'src/meeting/meeting.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({nullable: false})
  name: string;

  @Column()
  @Column({nullable: false, unique: true })
  email: string;

  @ManyToMany(() => Meeting)
  @JoinTable()
  meetings: Meeting[];

  constructor(name: string, email: string) {
    this.id = uuidv4();
    this.name = name;
    this.email = email;
  }
}