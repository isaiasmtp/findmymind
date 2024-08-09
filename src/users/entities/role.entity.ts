import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';


@Entity({ name: 'roles' })
export class RoleEntity {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: false })
  name: string;
  
  @Column("text", { array: true })
  audience: string[];

  @Column("text", { array: true })
  featurePermissions: string[];

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
}
