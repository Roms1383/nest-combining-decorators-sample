import { Exclude, Expose, Type } from 'class-transformer'
import { IsEmail, IsHash, IsUUID, MinLength } from 'class-validator'
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm'
import { Note } from './notes.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  @Expose()
  id: string

  @Column({ nullable: true })
  @MinLength(2)
  @Expose()
  firstname?: string

  @Column({ nullable: true })
  @Expose()
  lastname?: string

  @Column({ length: 255 })
  @IsEmail()
  @Expose()
  email!: string

  @Column()
  @IsHash('sha256')
  @Exclude()
  password: string

  @Type(() => Note)
  @OneToMany(
    type => Note,
    note => note.owner,
  )
  @JoinColumn({ name: 'notes' })
  @Exclude()
  notes?: Note[]
}
