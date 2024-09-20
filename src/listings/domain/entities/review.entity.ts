import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Listing } from './listing.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Listing)
  listing: Listing;

  @Column()
  userId: number;

  @Column()
  score: number;

  @Column()
  comment: string;

  @Column()
  createdDate: Date;
}
