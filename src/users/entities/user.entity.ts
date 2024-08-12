import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BeforeInsert,
} from 'typeorm';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { RoleEntity } from './role.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: false })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: 'M' })
  gender: string;

  @Column({ select: false })
  @Exclude()
  password: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  isValidated: boolean;

  @ManyToOne(() => RoleEntity)
  role: RoleEntity;

  @Column({
    type: 'date',
    nullable: true,
  })
  expirationDate: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  birthAt: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;

  @BeforeInsert()
  setDefaultRole() {
    if (!this.role) {
      this.role = new RoleEntity();
      this.role.id = 1;
    }
  }
}
