import { Test } from '@nestjs/testing';
import * as argon from 'argon2';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto';
import { UserService } from 'src/user/user.service';
import { inspect } from 'util';

describe('UserService Int', () => {
  let prisma: PrismaService;
  let userService: UserService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleRef.get(PrismaService);
    userService = moduleRef.get(UserService);
    await prisma.cleanDatabase();
  });

  describe('createUser()', () => {
    const dto: CreateUserDto = {
      email: 'zaycho@gmail.com',
      password: 'Admin123',
      firstName: 'Zay',
      lastName: 'Cho',
    };
    it('should create user', async () => {
      const password = await argon.hash(dto.password);
      const user = await userService.createUser(dto);
      user.password = password;
      expect(user.email).toBe(dto.email);
      expect(user.password).toBe(password);
      expect(user.firstName).toBe(dto.firstName);
      expect(user.lastName).toBe(dto.lastName);
    });
    it('should throw on duplicate email', async () => {
      try {
        await userService.createUser(dto);
      } catch (error) {
        expect(error.status).toBe(403);
      }
    });
  });
});
