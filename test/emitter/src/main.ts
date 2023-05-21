import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Emitter } from '@socket.io/redis-emitter';
import { ConfigService } from '@nestjs/config';
import { Encoder } from './utils/custom.parser';
import { Logger } from '@nestjs/common';
import Redis from 'ioredis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const emitterConfig = configService.get('emitter');
  const redisClient = new Redis(emitterConfig.redis);

  const namespace = '/nsp1';
  const room = 'room1';
  const event = 'time';
  const encoder = new Encoder();
  const emitter = new Emitter(
    redisClient,
    {
      key: 'redis-adapter',
      parser: encoder,
    },
    namespace,
  );
  setInterval(() => {
    const d = { message: new Date() };
    const isEmitted = emitter.in(room).emit(event, d);
    Logger.log(`Emitted (status: ${isEmitted}) => `, d);
  }, 5000);

  await app.listen(emitterConfig.httpPort);
}
bootstrap();
