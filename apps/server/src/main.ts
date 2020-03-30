import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

const bootstrap = async (): Promise<INestApplication> => {
  const app = await NestFactory.create(AppModule)
  await app.listen(3000)
  return app
}

bootstrap()
