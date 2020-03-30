import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { NotesController } from './notes.controller'
import { Note } from './notes.entity'
import { NotesService } from './notes.service'
import { User } from './users.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, Note])],
  providers: [NotesService],
  controllers: [NotesController],
  exports: [TypeOrmModule],
})
export class NotesModule {}
