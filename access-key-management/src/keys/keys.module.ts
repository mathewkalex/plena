import { Module } from '@nestjs/common';
import { KeysService } from './keys.service';
import { KeysController } from './keys.controller';
import { Redis } from 'ioredis';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule
  ],
  providers: [KeysService,
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
  controllers: [KeysController],
  exports:['REDIS_CLIENT']
})
export class KeysModule {}
