import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { RedisService } from '../redis/redis.service';
import { decode } from '../../utils/custom.parser';
import { Logger } from '@nestjs/common';
import { EventEmitter } from 'events';
import { ConfigService } from '@nestjs/config';
import { IRedisConfig } from '../redis/redis.interface';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class EventsGateway {
  @WebSocketServer()
  private readonly server: Server;

  private emitter: EventEmitter;
  private config: IRedisConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly redisSubscriber: RedisService,
  ) {
    this.config = this.configService.get('redis');

    if (this.config) {
      this.redisSubscriber.psubscribe(
        `${this.config.pubsub.subscribe.prefix}#/*`,
      );
    }
  }

  afterInit() {
    this.emitter = this.redisSubscriber.emit();
    this.emitter.on(
      this.config.pubsub.eventNames.adapter,
      (message: string) => {
        const decoded = decode(message);
        // Logger.debug(decoded);

        decoded[2].rooms.map((room) => {
          Logger.debug(`Emitting to client :`, {
            namespace: decoded[1].nsp,
            rooms: room,
            event: decoded[1].data[0],
            send: decoded[1].data[1],
          });

          this.server
            .of(decoded[1].nsp)
            .emit(`${room}#${decoded[1].data[0]}`, decoded[1].data[1]);
        });
      },
    );
  }
}
