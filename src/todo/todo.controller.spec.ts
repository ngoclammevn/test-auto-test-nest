import { Test, TestingModule } from '@nestjs/testing';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

describe('TodoController', () => {
  let controller: TodoController;
  let todoService: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TodoController>(TodoController);
    todoService = module.get<TodoService>(TodoService);
  });

  describe('create', () => {
    it('should call todoService.create', () => {
      const createTodoDto: CreateTodoDto = {
        title: 'test',
        isCompleted: false,
      };
      controller.create(createTodoDto);
      expect(todoService.create).toHaveBeenCalledWith(createTodoDto);
    });
  });

  describe('findAll', () => {
    it('should call todoService.findAll', () => {
      controller.findAll();
      expect(todoService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call todoService.findOne with the correct id', () => {
      const id = '1';
      controller.findOne(id);
      expect(todoService.findOne).toHaveBeenCalledWith(+id);
    });
  });

  describe('update', () => {
    it('should call todoService.update with the correct id and updateTodoDto', () => {
      const id = '1';
      const updateTodoDto: UpdateTodoDto = { title: 'updated test' };
      controller.update(id, updateTodoDto);
      expect(todoService.update).toHaveBeenCalledWith(+id, updateTodoDto);
    });
  });

  describe('remove', () => {
    it('should call todoService.remove with the correct id', () => {
      const id = '1';
      controller.remove(id);
      expect(todoService.remove).toHaveBeenCalledWith(+id);
    });
  });
});
