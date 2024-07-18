import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let todoService: TodoService;
  let todoRepo: Repository<Todo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(Todo),
          useClass: Repository,
        },
      ],
    }).compile();

    todoService = module.get<TodoService>(TodoService);
    todoRepo = module.get<Repository<Todo>>(getRepositoryToken(Todo));
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      const createTodoDto: CreateTodoDto = {
        title: 'Test Todo',
        isCompleted: false,
      };
      const savedTodo: Todo = {
        id: 1,
        title: 'Test Todo',
        isCompleted: false,
      };

      jest.spyOn(todoRepo, 'create').mockReturnValue(savedTodo);
      jest.spyOn(todoRepo, 'save').mockResolvedValue(savedTodo);

      const result = await todoService.create(createTodoDto);

      expect(todoRepo.create).toHaveBeenCalledWith(createTodoDto);
      expect(todoRepo.save).toHaveBeenCalledWith(savedTodo);
      expect(result).toEqual(savedTodo);
    });
  });

  describe('findAll', () => {
    it('should return all todos', async () => {
      const todos: Todo[] = [
        {
          id: 1,
          title: 'Todo 1',
          isCompleted: false,
        },
        {
          id: 2,
          title: 'Todo 2',
          isCompleted: false,
        },
      ];

      jest.spyOn(todoRepo, 'find').mockResolvedValue(todos);

      const result = await todoService.findAll();

      expect(todoRepo.find).toHaveBeenCalled();
      expect(result).toEqual(todos);
    });
  });

  describe('findOne', () => {
    it('should return a todo by id', async () => {
      const todoId = 1;
      const todo: Todo = {
        id: todoId,
        title: 'Test Todo',
        isCompleted: false,
      };

      jest.spyOn(todoRepo, 'findOne').mockResolvedValue(todo);

      const result = await todoService.findOne(todoId);

      expect(todoRepo.findOne).toHaveBeenCalledWith({ where: { id: todoId } });
      expect(result).toEqual(todo);
    });

    it('should throw NotFoundException if todo is not found', async () => {
      const todoId = 1;

      jest.spyOn(todoRepo, 'findOne').mockResolvedValue(undefined);

      await expect(todoService.findOne(todoId)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const todoId = 1;
      const updateTodoDto: UpdateTodoDto = { title: 'Updated Todo' };
      const todo: Todo = {
        id: todoId,
        title: 'Test Todo',
        isCompleted: false,
      };
      const updatedTodo: Todo = {
        id: todoId,
        title: 'Updated Todo',
        isCompleted: false,
      };

      jest.spyOn(todoService, 'findOne').mockResolvedValue(todo);
      jest.spyOn(todoRepo, 'save').mockResolvedValue(updatedTodo);

      const result = await todoService.update(todoId, updateTodoDto);

      expect(todoService.findOne).toHaveBeenCalledWith(todoId);
      expect(todoRepo.save).toHaveBeenCalledWith(updatedTodo);
      expect(result).toEqual(updatedTodo);
    });
  });

  describe('remove', () => {
    it('should remove a todo', async () => {
      const todoId = 1;
      const todo: Todo = {
        id: todoId,
        title: 'Test Todo',
        isCompleted: false,
      };

      jest.spyOn(todoService, 'findOne').mockResolvedValue(todo);
      jest.spyOn(todoRepo, 'remove').mockResolvedValue(undefined);

      const result = await todoService.remove(todoId);

      expect(todoService.findOne).toHaveBeenCalledWith(todoId);
      expect(todoRepo.remove).toHaveBeenCalledWith(todo);
      expect(result).toBeUndefined();
    });
  });
});
