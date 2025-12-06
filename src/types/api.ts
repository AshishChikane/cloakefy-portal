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
}

export interface SubUser {
  id: string;
  entityId: string;
  name: string;
  role: string;
  walletAddress: string;
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

export interface TransferRequest {
  entityId: string;
  subUserId: string;
  amount: number;
  token: BaseToken;
}

export interface CreateEntityRequest {
  name: string;
  type: EntityType;
  baseToken: BaseToken;
}

export interface CreateSubUserRequest {
  name: string;
  role: string;
  walletAddress: string;
  allocationType?: 'Fixed' | 'Percentage';
  allocation?: number;
}
