export type EntityType = 'DAO' | 'Protocol' | 'Company' | 'Other';
export type BaseToken = 'eAVAX' | 'eUSDC' | 'eUSDT';
export type TransactionStatus = 'Pending' | 'Completed' | 'Failed';

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  baseToken: BaseToken;
  smartWalletAddress: string;
  balance: number;
  walletBalance?: WalletBalance;
}

export interface WalletBalance {
  avax?: {
    balance: string;
    balanceWei: string;
  };
  eusdc?: {
    tokenBalance: string;
    tokenBalanceWei: string;
    encryptedBalance: string;
    encryptedBalanceWei: string;
    isRegistered: boolean;
  };
  eusdt?: {
    tokenBalance: string;
    tokenBalanceWei: string;
    encryptedBalance: string;
    encryptedBalanceWei: string;
    isRegistered: boolean;
  };
}

export interface SubUser {
  id: string;
  entityId: string;
  name: string;
  role: string;
  email_id?: string;
  walletAddress: string;
  walletBalance?: WalletBalance;
  allocationType?: 'Fixed' | 'Percentage';
  allocation?: number;
}

export interface Transaction {
  id: string;
  entityId: string;
  fromAddress: string;
  toAddress: string;
  toName: string;
  amount: number;
  token: BaseToken;
  status: TransactionStatus;
  txHash: string;
  timestamp: string;
}

export interface TransferRecipient {
  subUserId: string;
  amount: number;
}

export interface TransferRequest {
  entityId: string;
  recipients: TransferRecipient[];
  token: BaseToken;
}

export interface CreateEntityRequest {
  name: string;
  type: EntityType;
  baseToken: BaseToken;
}

export interface CreateSubUserRequest {
  name: string;
  email_id: string;
  role: string;
  walletAddress?: string;
  allocationType?: 'Fixed' | 'Percentage';
  allocation?: number;
}
