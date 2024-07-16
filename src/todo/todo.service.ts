import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TodoService {
  constructor(@InjectRepository(Todo) private todoRepo: Repository<Todo>) {}

  create(createTodoDto: CreateTodoDto) {
    const newTodo = this.todoRepo.create(createTodoDto);
    return this.todoRepo.save(newTodo);
  }

  findAll() {
    return this.todoRepo.find();
  }

  async findOne(id: number): Promise<Todo> {
    const todo = await this.todoRepo.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo not found`);
    }
    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    const todo = await this.findOne(id);
    const updatedTodo = { ...todo, ...updateTodoDto };
    return this.todoRepo.save(updatedTodo);
  }

  async remove(id: number) {
    const todo = await this.findOne(id);
    return this.todoRepo.remove(todo);
  }
}
