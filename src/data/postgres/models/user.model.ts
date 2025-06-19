import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    OneToMany,
} from 'typeorm';
import { PetPost } from './petpost.model';

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('varchar', {
        length: 100,
        nullable: false,
    })
    name!: string;

    @Column('varchar', {
        unique: true,
        nullable: false,
    })
    email!: string;

    @Column('varchar', {
        nullable: false,
    })
    password!: string;

    @Column('enum', {
        enum: UserRole,
        default: UserRole.USER,
        nullable: false,
    })
    role!: UserRole;

    @Column({ type: 'boolean', default: false, nullable: false })
    status: boolean;

    @CreateDateColumn()
    created_at!: Date;

    @OneToMany(() => PetPost, (petPost) => petPost.user)
    pet: PetPost[];
}
