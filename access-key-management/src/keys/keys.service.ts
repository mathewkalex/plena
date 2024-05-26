import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Redis } from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
//import * as Redis from 'ioredis';

@Injectable()
export class KeysService {

  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) { }

  async createKey(userId: string, rateLimit: number, expiration: Date): Promise<any> {
    const key = uuidv4();
    const keyData = {
      userId,
      key,
      rateLimit,
      expiration: expiration.toISOString(),
      isActive: true,
      requestCount: 0
    };
    await this.redisClient.hset('keys', key, JSON.stringify(keyData));
    await this.redisClient.publish('key-events', JSON.stringify({ event: 'create', key: keyData }));
    return keyData;
  }

  async deleteKey(key: string): Promise<void> {
    const keyData = await this.redisClient.hget('keys', key);
    if (!keyData) {
      throw new NotFoundException('Key not found');
    }
    await this.redisClient.hdel('keys', key);
    await this.redisClient.publish('key-events', JSON.stringify({ event: 'delete', key: JSON.parse(keyData) }));
  }

  async listKeys(): Promise<any[]> {
    const keys = await this.redisClient.hvals('keys');
    return keys.map((key) => JSON.parse(key));
  }

  async updateKey(key: string, rateLimit: number, expiration: Date): Promise<any> {
    const keyData = await this.redisClient.hget('keys', key);
    if (!keyData) {
      throw new NotFoundException('Key not found');
    }
    const updatedKey = {
      ...JSON.parse(keyData),
      rateLimit,
      expiration: expiration.toISOString()
    };
    await this.redisClient.hset('keys', key, JSON.stringify(updatedKey));
    await this.redisClient.publish('key-events', JSON.stringify({ event: 'update', key: updatedKey }));
    return updatedKey;
  }

  async getKeyDetails(key: string): Promise<any> {
    const keyData = await this.redisClient.hget('keys', key);
    if (!keyData) {
      throw new NotFoundException('Key not found');
    }
    return JSON.parse(keyData);
  }

  async disableKey(key: string): Promise<void> {
    const keyData = await this.redisClient.hget('keys', key);
    if (!keyData) {
      throw new NotFoundException('Key not found');
    }
    const updatedKey = {
      ...JSON.parse(keyData),
      isActive: false
    };
    await this.redisClient.hset('keys', key, JSON.stringify(updatedKey));
    await this.redisClient.publish('key-events', JSON.stringify({ event: 'disable', key: updatedKey }));
  }
}
