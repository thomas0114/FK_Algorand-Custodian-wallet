import {
  Column,
  Entity,
  JoinColumn,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { AddressContact, TransactionHistory, Wallet } from '../wallet/wallet.entity';

@Entity()
class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public fullName: string;

  @Column()
  public email: string;

  @Column()
  public password: string;

  @OneToMany(() => TransactionHistory, (history) => history.user)
  transactHistroy: TransactionHistory;

  @OneToMany(() => AddressContact, (contact) => contact.user)
  contact: AddressContact;

  @CreateDateColumn()
  public created_date: string;

  @UpdateDateColumn()
  public update_date: string;
}

export default User;
