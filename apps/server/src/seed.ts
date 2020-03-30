import { Note } from '@kroms/notes/notes.entity'
import { User } from '@kroms/notes/users.entity'
import * as Chance from 'chance'
import * as crypto from 'crypto'
import * as moment from 'moment'
import { TIME } from '@kroms/notes/constants'

const chance = Chance()
export const users = (howMany: number): User[] => {
  const users: User[] = []
  let user: User
  for (let i = 0; i < howMany; i++) {
    user = new User()
    user.firstname = chance.first()
    user.lastname = chance.last()
    user.email = chance.email()
    user.password = crypto
      .createHmac('sha256', 'secret-key')
      .update('password')
      .digest('hex')
    users.push(user)
  }
  return users
}

export const notes = (howMany: number, owners?: User[]): Note[] => {
  const notes: Note[] = []
  let note: Note
  for (let i = 0; i < howMany; i++) {
    note = new Note()
    note.description = chance.sentence({ words: 5 })
    note.on = (moment
      .utc(chance.date({ year: 1983 }))
      .format(TIME) as unknown) as moment.Moment
    note.owner = owners[Math.floor(Math.random() * (owners.length - 1))].id
    notes.push(note)
  }
  return notes
}
