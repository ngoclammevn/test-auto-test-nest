import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;
  let mockTodoRepository: Partial<Repository<Todo>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(Todo),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    mockTodoRepository = module.get<Repository<Todo>>(getRepositoryToken(Todo));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Test get data', async () => {
    jest.spyOn(mockTodoRepository, 'find').mockResolvedValue([
      { id: 1, title: 'test', isCompleted: false },
      { id: 2, title: 'test2', isCompleted: false },
    ]);
    const todoList = await service.findAll();

    expect(todoList.length).toBe(2);
  });

  describe('findOne', () => {
    it('should return a todo by id', async () => {
      jest
        .spyOn(mockTodoRepository, 'findOne')
        .mockResolvedValue({ id: 1, title: 'test', isCompleted: false });

      const todo = await service.findOne(1);
      expect(mockTodoRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(todo).toEqual({ id: 1, title: 'test', isCompleted: false });
    });

    it('should throw an error if todo not found', async () => {
      jest.spyOn(mockTodoRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(
        new NotFoundException('Todo not found'),
      );
    });
  });
});
