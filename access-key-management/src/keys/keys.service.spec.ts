import { Test, TestingModule } from '@nestjs/testing';
import { KeysService } from './keys.service';
import { Redis } from 'ioredis';

describe('KeysService', () => {
  let service: KeysService;
  let redisClient: Redis;

  beforeEach(async () => {
    const mockRedisClient = {
      hset: jest.fn(),
      publish: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeysService,
        {
          provide: 'REDIS_CLIENT',
          useValue: mockRedisClient,
        },
      ],
    }).compile();
    service = module.get<KeysService>(KeysService);
    redisClient = module.get<Redis>('REDIS_CLIENT');
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('createKey', () => {
    it('should create a key and publish an event', async () => {
      const userId = 'test-user-id';
      const rateLimit = 100;
      const expiration = new Date();
      const key = 'test-key';
      const keyData = {
        userId,
        key,
        rateLimit,
        expiration: expiration.toISOString(),
        isActive: true,
        requestCount: 0,
      };
      (redisClient.hset as jest.Mock).mockResolvedValue('OK');
      (redisClient.publish as jest.Mock).mockResolvedValue(1);
      const result = await service.createKey(userId, rateLimit, expiration);
      expect(redisClient.hset).toHaveBeenCalled();
      expect(redisClient.publish).toHaveBeenCalled();
    });
  });
});