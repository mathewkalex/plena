import { Test, TestingModule } from '@nestjs/testing';
import { KeysController } from './keys.controller';
import { KeysService } from './keys.service';
import { AuthService } from '../../src/auth/auth.service';

const keysService = jest.fn().mockReturnValue({
  createKey: jest.fn().mockReturnValue({}),
  deleteKey: jest.fn().mockReturnValue({})
});

const authService = jest.fn();

describe('KeysController', () => {
  let controller: KeysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeysController],
      providers: [
        {
          provide: KeysService,
          useClass: keysService
        },
        {
          provide: AuthService,
          useClass: authService
        }
      ]
    }).compile();
    controller = module.get<KeysController>(KeysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createKey function ', () => {
    it('should create a key', async () => {
      const userId = 'test_user_id';
      const rateLimit = 11;
      const expiration = new Date();
      const result = await controller.createKey(userId, rateLimit, expiration);
      expect(result).toEqual({});
    });
  });

  describe('deleteKey function ', () => {
    it('should delete a key', async () => {
      const key = 'test_key';
      const result = await controller.deleteKey(key);
      expect(result).toEqual({});
    });
  });
});