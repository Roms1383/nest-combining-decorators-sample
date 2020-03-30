import { Controller, Get, UseInterceptors } from '@nestjs/common'
import * as chalk from 'chalk'

import { IOInterceptor } from './io.interceptor'
import { Note } from './notes.entity'
import { NotesService } from './notes.service'

@Controller('notes')
@UseInterceptors(IOInterceptor)
export class NotesController {
  constructor(private readonly service: NotesService) {}
  @Get()
  async fetch(): Promise<Note[]> {
    try {
      const notes = await this.service.fetch()
      // console.info(chalk.blue('sending back', '\n', '-----'));
      // console.info(notes);
      return notes
    } catch (e) {
      console.error(e)
    }
  }
}
