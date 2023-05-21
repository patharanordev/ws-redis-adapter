import { registerAs } from '@nestjs/config';
import { IRedisConfig } from 'src/ecosystem/redis/redis.interface';

export default registerAs('redis', (): IRedisConfig => {
  return {
    connection: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
    pubsub: {
      subscribe: {
        prefix: process.env.REDIS_PSUBSCRIBE_PREFIX,
      },
      eventNames: {
        adapter: process.env.REDIS_EVENT_ADAPTER,
      },
    },
  };
});
