import { Note } from '@kroms/notes/notes.entity'
import { NotesModule } from '@kroms/notes/notes.module'
import { User } from '@kroms/notes/users.entity'
import { INestApplication, Injectable, Module } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import {
  InjectRepository,
  TypeOrmModule,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm'
import * as chalk from 'chalk'
import Axios from 'axios'
import { Repository } from 'typeorm'

import * as generate from './seed'

require('dotenv').config()

const HOST = process.env.SERVER_HOST || 'localhost'
const PORT = +process.env.SERVER_PORT || 3000

const options: TypeOrmModuleOptions = {
  type: (process.env.TYPEORM_CONNECTION as 'mariadb') || 'mysql' || 'mariadb',
  host: process.env.TYPEORM_HOST || 'localhost',
  port: +process.env.TYPEORM_PORT || 3306,
  username: process.env.TYPEORM_USERNAME || 'root',
  password: process.env.TYPEORM_PASSWORD || 'root',
  database: process.env.TYPEORM_DATABASE || 'test_nestjs_decorators',
  entities: [User, Note],
  synchronize: true,
  dropSchema: true,
}

const COUNT_USERS = 3
const COUNT_NOTES = 5
let users
let notes

@Injectable()
class SeederService {
  constructor(
    @InjectRepository(User) private readonly users_repo: Repository<User>,
    @InjectRepository(Note) private readonly notes_repo: Repository<Note>,
  ) {}
  public async seed(): Promise<void> {
    const generatedUsers = generate.users(COUNT_USERS).slice()
    const { generatedMaps: usersIds } = await this.users_repo.manager.connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(generatedUsers)
      .execute()
    users = usersIds
      .map(({ id }, index) => ({ id, ...generatedUsers[index] }))
      .slice()
    const generatedNotes = generate.notes(COUNT_NOTES, users).slice()
    const { generatedMaps: notesIds } = await this.notes_repo.manager.connection
      .createQueryBuilder()
      .insert()
      .into(Note)
      .values(generatedNotes)
      .execute()
    notes = notesIds
      .map(({ id }, index) => ({ id, ...generatedNotes[index] }))
      .slice()
    // console.info(chalk.green('seeded', '\n', '-----'));
    // console.info(users);
    // console.info(notes);
  }
}

@Module({
  imports: [TypeOrmModule.forRoot(options), NotesModule],
  providers: [SeederService],
})
class AppModule {}

const bootstrap = async (): Promise<INestApplication> => {
  const app = await NestFactory.create(AppModule)
  const seeder = app.get(SeederService)
  await seeder.seed()
  await app.listen(PORT)
  return app
}
const teardown = async (app: INestApplication): Promise<void> => {
  await app.close()
  app = undefined
}

describe('tests', () => {
  let app
  beforeAll(async () => {
    app = await bootstrap()
  })
  afterAll(async () => {
    await teardown(app)
  })
  describe('notes', () => {
    it('can fetch all the notes', async () => {
      const { data } = await Axios.get(`http://${HOST}:${PORT}/notes`)
      // console.info(chalk.magenta('received', '\n', '-----'));
      // console.info(data);
      expect(data).toBeDefined()
      expect(data).toHaveLength(COUNT_NOTES)
      expect(data).toEqual(
        expect.arrayContaining(notes.map(expect.objectContaining)),
      )
    })
  })
})
