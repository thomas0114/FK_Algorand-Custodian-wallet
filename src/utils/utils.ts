import {
  generateAlgoWallet,
  algorandGetAccountBalance,
  sendAlgoSignedTransaction,
  algorandGetTransaction,
  AlgoTransaction,
  prepareAlgoSignedTransaction,
  Currency
} from '@tatumio/tatum';
import axios from 'axios';
import { add } from 'winston';
import HttpException from '../exceptions/HttpException';
import { Transaction } from '../interfaces/wallet.interface';
const instance = axios.create({
  baseURL: 'https://api-eu1.tatum.io/',
  headers: { 'x-api-key': process.env.TATUM_API_KEY || '' },
});

export const Transact = (data: Transaction): Promise<any> => {
  return instance.post('v3/algorand/transaction', data);
};

export const TransactHistroy = (data: string): Promise<any> => {
  return axios.request({
    method: 'get',
    url: `https://api-eu1.tatum.io/v3/algorand/transaction/${data}`,
    headers: {
      'x-api-key': process.env.TATUM_API_KEY || '',
    },
  });
};
/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

export const CreateAlgoWallet = async () => {
  const Algorand = await generateAlgoWallet();

  return {
    address: Algorand.address,
    Key: Algorand.secret,
  };
};

export const AlgoWalletBalance = async (address?: string) => {
  const balance = await algorandGetAccountBalance(address);
  return balance;
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
export const AlgoTransactions = async (tx: Transaction, key: string) => {
  tx.fromPrivateKey = key;
  const txId = await Transact(tx);
  if (txId.data) {
    await sleep(9000);
    const tran_history = await algorandGetTransaction(txId.data);
    console.log(tran_history);

    return {
      transaction_hash: String(txId.data),
      recipient: tx.to,
      amount: tran_history.paymentTransaction.amount,
      network_fee: tran_history.fee,
      status: tran_history.txType,
    };
  }
};

export const UserNFTS = async (address: string) => {
  return await instance.post(`/v3/nft/address/balance/${Currency.ALGO}/${address}`);
};
