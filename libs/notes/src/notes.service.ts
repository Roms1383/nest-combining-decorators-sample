import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Note } from './notes.entity'

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private readonly repository: Repository<Note>,
  ) {}
  async fetch(): Promise<Note[]> {
    return this.repository.find({ relations: ['user'] })
  }
}
