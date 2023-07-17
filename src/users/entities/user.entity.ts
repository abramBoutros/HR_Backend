import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { UserRoles } from '../../common/enums';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: UserRoles;

  @Column({ nullable: true })
  attendance: string;
}
