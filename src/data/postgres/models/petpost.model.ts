import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.model';

export enum PetPostStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity()
export class PetPost extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', {
    length: 50,
    nullable: false,
  })
  pet_name!: string;

  @Column('text', {
    nullable: false,
  })
  description!: string;

  @Column('varchar', {
    nullable: false,
  })
  image_url!: string;

  @Column('enum', {
    enum: PetPostStatus,
    default: PetPostStatus.PENDING,
    nullable: false,
  })
  status!: PetPostStatus;

  // puede ser ID de usuario, email o nombre (ajustar según tu diseño)

  @Column('boolean', {
    default: false,
    nullable: false,
  })
  hasfound!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne(() => User, (user) => user.pet)
  @JoinColumn({ name: 'owner' })
  user: User;
}
