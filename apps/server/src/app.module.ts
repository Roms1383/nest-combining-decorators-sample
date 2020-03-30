import { Module } from '@nestjs/common'
import { NotesModule } from '@kroms/notes/notes.module'

@Module({
  imports: [NotesModule],
})
export class AppModule {}
