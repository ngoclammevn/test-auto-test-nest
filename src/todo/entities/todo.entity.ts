import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Todo {
  @PrimaryColumn()
  id: number;

  @Column()
  title: string;

  @Column({ name: 'is_completed' })
  isCompleted: boolean;
}
