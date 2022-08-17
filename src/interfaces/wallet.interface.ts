export interface WalletBalance {
  amount: string | number;
}

export interface TransactionHistoryType {
  readonly transaction_hash: string;
  readonly recipient: string;
  readonly amount: number;
  readonly network_fee: number;
  readonly status: string;
}

export interface Transaction {
  from: string;
  to: string;
  fee: string;
  amount: string;
  note: string;
  fromPrivateKey: string;
}