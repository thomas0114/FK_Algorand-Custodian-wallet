import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import User from '../authentication/user.entity';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  public_key: string;

  @Column()
  private_key: string;

  @OneToOne(() => User, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @OneToMany(() => TransactionHistory, (history) => history.wallet)
  transactHistroy: TransactionHistory;

  @CreateDateColumn()
  public created_date: string;

  @UpdateDateColumn()
  public update_date: string;
}

@Entity()
export class WalletBalance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: string;

  @OneToOne(() => User, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  user: User;

  @OneToOne(() => Wallet, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  wallet: Wallet;

  @CreateDateColumn()
  public created_date: string;

  @UpdateDateColumn()
  public update_date: string;
}

@Entity()
export class TransactionHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  transaction_hash: string;

  @Column()
  recipient: string;

  @Column()
  network_fee: string;

  @Column()
  status: string;

  @Column()
  amount: string;

  @ManyToOne(() => User, (user) => user.transactHistroy)
  user: User;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactHistroy)
  wallet: Wallet;

  @CreateDateColumn()
  public created_date: string;

  @UpdateDateColumn()
  public update_date: string;
}

@Entity()
export class AddressContact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @ManyToOne(() => User, (user) => user.contact)
  user: User;

  @CreateDateColumn()
  public created_date: string;

  @UpdateDateColumn()
  public update_date: string;
}
