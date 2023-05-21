import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './ecosystem/websocket/events.module';
import adapterConfig from './config/adapter.config';
import redisConfig from './config/redis.config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [adapterConfig, redisConfig],
      envFilePath: `${process.cwd()}/.env.${process.env.NODE_ENV}`,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('Test', 'Local', 'Develop', 'QA', 'UAT', 'Production')
          .default('Local')
          .required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
