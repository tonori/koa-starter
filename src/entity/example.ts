import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Example {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column()
  name: string = '';

  @Column()
  age: number = 1;
}
