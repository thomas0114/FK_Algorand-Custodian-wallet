import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import WalletService from './wallet.service';
import validationMiddleware from '../middleware/validation.middleware';
import authMiddleware from '../middleware/auth.middleware';
import { AlgoTransaction } from './transaction.dto';

class WalletController implements Controller {
  public path = '/wallet';
  public router = express.Router();
  private walletService = new WalletService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/balance`, authMiddleware, this.WalletBalance);
    this.router.post(`${this.path}/sendAlgo`, authMiddleware, this.SendTransaction);
    this.router.get(`${this.path}/transactionHistory`, authMiddleware, this.TransactionHistory);
  }

  private WalletBalance = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    try {
      const { id, email, pasword } = request.user;
      const balance = await this.walletService.balance(id);
      response.status(200).send(balance);
    } catch (error) {
      next(error);
    }
  };

  private SendTransaction = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    try {
      const AlgoTransactionData: AlgoTransaction = request.body;
      const { id, email } = request.user;
      const transaction = await this.walletService.Transaction(AlgoTransactionData, email, id);
      response.status(201).send(transaction);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  private TransactionHistory = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    try {
      const { id, email } = request.user;
      const transaction = await this.walletService.UserTransactionHistory(id);
      response.status(200).send(transaction);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

export default WalletController;
