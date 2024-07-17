import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

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
    const b = 1;
    const todo = await this.findOne(id);
    const updatedTodo = { ...todo, ...updateTodoDto };
    console.log(updatedTodo);

    return 1;
    // return this.todoRepo.save(updatedTodo);
  }

  async remove(id: number) {
    const todo = await this.findOne(id);
    return this.todoRepo.remove(todo);
  }
}
