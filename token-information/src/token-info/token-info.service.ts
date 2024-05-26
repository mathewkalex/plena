import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import * as RedisClient from 'ioredis';

@Injectable()
export class TokenInfoService implements OnModuleInit {
  private keysCache = new Map<string, any>();

  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClient.Redis,
  ) { }

  onModuleInit() {
    this.redisClient.subscribe('key-events', (err, count) => {
      if (err) {
        console.error('Failed to subscribe: %s', err.message);
      } else {
        console.log(`Subscribed successfully! This client is currently subscribed to ${count} channels.`);
      }
    });

    this.redisClient.on('message', (channel, message) => {
      if (channel === 'key-events') {
        const event = JSON.parse(message);
        switch (event.event) {
          case 'create':
          case 'update':
            this.keysCache.set(event.key.key, event.key);
            break;
          case 'delete':
          case 'disable':
            this.keysCache.delete(event.key.key);
            break;
        }
      }
    });
  }

  async getTokenInfo(key: string) {
    const keyData = this.keysCache.get(key);
    if (!keyData || !keyData.isActive || new Date(keyData.expiration) < new Date()) {
      return { error: 'Invalid or expired key' };
    }

    if (keyData.requestCount >= keyData.rateLimit) {
      return { error: 'Rate limit exceeded' };
    }

    keyData.requestCount = (keyData.requestCount || 0) + 1;
    await this.redisClient.hset('keys', key, JSON.stringify(keyData));
    return { data: 'Mock token information' };
  }
}
