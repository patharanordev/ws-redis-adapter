import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter } from 'events';
import { IRedisConfig } from './redis.interface';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private redisClient: Redis;
  private emitter = new EventEmitter();
  private config: IRedisConfig;

  constructor(private readonly configService: ConfigService) {
    this.config = this.configService.get('redis');
    this.connect();
  }

  async connect() {
    if (this.config) {
      try {
        this.redisClient = new Redis(this.config.connection);
        Logger.debug('Initial Redis...');

        this.redisClient.on('error', this.onError);
        this.redisClient.on('connect', this.onReady);
      } catch (err) {
        Logger.error('Redis service error:', err.message);
      }
    } else {
      Logger.error('Redis config not found!');
    }
  }

  async psubscribe(prefix: string): Promise<void> {
    await this.redisClient.psubscribe(`${prefix}*`);
    this.redisClient.on('pmessage', (channel, msgPattern, message) => {
      this.emitter.emit(this.config.pubsub.eventNames.adapter, message);
    });
  }

  async subscribe(
    channel: string,
    handler: (message: any) => void,
  ): Promise<void> {
    await this.redisClient.subscribe(channel);
    this.redisClient.on(
      'message',
      (subscribedChannel: string, message: any) => {
        if (subscribedChannel === channel) {
          handler(message);
        }
      },
    );
  }

  onError(err) {
    if (err instanceof Error && err.message.includes('ECONNREFUSED')) {
      Logger.error('Connection to Redis refused');
    } else if (err instanceof Error && err.message.includes('ETIMEDOUT')) {
      Logger.error('Connection to Redis timed out');
    } else {
      Logger.error(`Redis error: ${err}`);
    }
  }

  onReady() {
    Logger.debug('Redis is now ready!');
  }

  onSuccess(r) {
    return { data: r, error: null };
  }

  onFail(e) {
    return { data: null, error: e };
  }

  async del(key: string) {
    return await this.redisClient
      .del(key)
      .then(this.onSuccess)
      .catch(this.onFail);
  }

  async get(key: string) {
    return await this.redisClient
      .get(key)
      .then(this.onSuccess)
      .catch(this.onFail);
  }

  async set(key: string, value: string): Promise<any> {
    return await this.redisClient
      .set(key, value)
      .then(this.onSuccess)
      .catch(this.onFail);
  }

  async exists(key: string) {
    return await this.redisClient
      .exists(key)
      .then(this.onSuccess)
      .catch(this.onFail);
  }

  emit(): EventEmitter {
    return this.emitter;
  }
}
