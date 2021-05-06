import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class Author {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  first_name!: string;

  @Column()
  last_name!: string;
}
