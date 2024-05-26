import { Module } from '@nestjs/common';
import { TokenInfoService } from './token-info.service';
import { TokenInfoController } from './token-info.controller';
import { Redis } from 'ioredis';

@Module({
  imports: [ ],
  providers: [TokenInfoService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const client = new Redis({
          host: 'redis', // replace with your Redis server host
          port: 6379, // replace with your Redis server port
        });

        client.on('connect', () => {
          console.log('Connected to Redis');
        });

        client.on('error', (err) => {
          console.error('Redis error', err);
        });

        return client;
      },
    },
  ],
  controllers: [TokenInfoController],
})
export class TokenInfoModule {}
