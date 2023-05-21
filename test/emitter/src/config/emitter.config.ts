import { registerAs } from '@nestjs/config';

export default registerAs('emitter', () => ({
  httpPort: process.env.HTTP_PORT || 3000,
  redis: {
    host: process.env.REDIS_HOST || '0.0.0.0',
    port: process.env.REDIS_PORT || 6379,
    db: 0, // Defaults to 0
  },
}));
