import { Exclude, Expose, Transform } from 'class-transformer'
import { IsDateString, IsUUID } from 'class-validator'
import { Moment, utc } from 'moment'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { TIME } from './constants'
import { User } from './users.entity'

@Entity()
export class Note {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  @Expose()
  id: string

  @Column()
  @Expose()
  description: string

  // validation
  @IsDateString()
  // from db to class
  @Column({
    type: 'varchar',
    transformer: {
      from: value => utc(value),
      to: value => utc(value).format(TIME),
    },
  })
  // from plain to class
  @Transform(value => utc(value), { toClassOnly: true })
  // from class to plain
  @Transform(value => utc(value).format(TIME), { toPlainOnly: true })
  // expose when transformed into plain
  @Expose()
  on: Moment

  @ManyToOne(
    type => User,
    user => user.notes,
  )
  @JoinColumn({ name: 'owner' })
  @Exclude()
  user: User

  @Column({ nullable: false })
  @Expose()
  owner: string
}
