import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
// import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import User from '../authentication/user.entity';
import HttpException from '../exceptions/HttpException';
import { TransactionHistoryType } from '../interfaces/wallet.interface';
import { CreateAlgoWallet, AlgoTransactions, AlgoWalletBalance } from '../utils/utils';
import { Wallet, WalletBalance, TransactionHistory } from '../wallet/wallet.entity';
import { AlgoTransaction } from './transaction.dto';

class WalletService {
  private userRepository = getRepository(User);
  private WalletRepository = getRepository(Wallet);
  private WalletBalance = getRepository(WalletBalance);
  private History = getRepository(TransactionHistory);

  public async balance(user_id: string) {
    const data = await this.WalletBalance.findOne({ where: { user: user_id } });
    return { amount: data.amount };
  }

  public async Transaction(AlgoTranData: AlgoTransaction, email?: string, user_id?: string) {
    const findUser: User = await this.userRepository.findOne({ where: { email: email } });
    const wallet = await this.WalletRepository.findOne({ where: { user: findUser.id } });
    const walletBal: WalletBalance = await this.WalletBalance.findOne({ where: { user: findUser.id, wallet: wallet.id } });
    if (Number(walletBal.amount) < Number(AlgoTranData.amount)) throw new HttpException(403, "you don't enought algo");
    if (Number(walletBal.amount) == Number(AlgoTranData.amount)) throw new HttpException(403, "you don't enought algo");

    const Trans: TransactionHistoryType = await AlgoTransactions(AlgoTranData, wallet.private_key);
    if (Trans) {
      const balance = await AlgoWalletBalance(wallet.public_key);
      walletBal.amount = String(balance);
      await this.WalletBalance.save(walletBal);

      const history = this.History.create({
        transaction_hash: Trans.transaction_hash,
        recipient: Trans.recipient,
        network_fee: Trans.network_fee,
        status: Trans.status,
        amount: Trans.amount,
        user: findUser,
        wallet: wallet,
      });
      await this.History.save(history);
    }
    return Trans;
  }

  public async UserTransactionHistory(user_id: string): Promise<any> {
    const history = await this.History.find({
      where: { user: user_id },
      order: {
        created_date: 'ASC',
      },
    });
    return history;
  }
}

export default WalletService;
