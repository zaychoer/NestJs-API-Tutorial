import { ForbiddenException, Injectable } from '@nestjs/common';
import { Todo } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './dto';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async createTodo(userId: string, dto: CreateTodoDto): Promise<Todo> {
    return await this.prisma.todo
      .create({
        data: {
          userId,
          ...dto,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException('Duplicate todo title');
          }
        }
        throw error;
      });
  }

  updateTodo() {}
}
