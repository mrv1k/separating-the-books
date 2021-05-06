import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class Book {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  title!: string;

  @Column()
  subtitle!: string;

  // authors: []
}

export default Book;
