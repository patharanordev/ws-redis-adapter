import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { RedisService } from '../redis/redis.service';

@Module({
  providers: [EventsGateway, RedisService],
})
export class EventsModule {}
