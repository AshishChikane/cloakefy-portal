import { 
  Entity, 
  SubUser, 
  Transaction, 
  CreateEntityRequest, 
  CreateSubUserRequest, 
  TransferRequest 
} from '@/types/api';

// Simulated delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate random hex string
const randomHex = (length: number) => 
  Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join('');

// Mock data store
let mockEntities: Entity[] = [
  {
    id: '1',
    name: 'Avalanche DAO',
    type: 'DAO',
    baseToken: 'eAVAX',
    smartWalletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    balance: 1250.75,
  },
  {
    id: '2',
    name: 'DeFi Protocol X',
    type: 'Protocol',
    baseToken: 'eUSDC',
    smartWalletAddress: '0x8ba1f109551bD432803012645Hc136E54e987f44',
    balance: 50000.00,
  },
];

let mockSubUsers: SubUser[] = [
  {
    id: 'su1',
    entityId: '1',
    name: 'Alice Johnson',
    role: 'Core Contributor',
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    allocationType: 'Percentage',
    allocation: 25,
  },
  {
    id: 'su2',
    entityId: '1',
    name: 'Bob Smith',
    role: 'Developer',
    walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    allocationType: 'Fixed',
    allocation: 100,
  },
];

let mockTransactions: Transaction[] = [
  {
    id: 'tx1',
    entityId: '1',
    fromAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    toAddress: '0x1234567890abcdef1234567890abcdef12345678',
    toName: 'Alice Johnson',
    amount: 50,
    token: 'eAVAX',
    status: 'Completed',
    txHash: '0x' + randomHex(64),
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'tx2',
    entityId: '1',
    fromAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    toAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    toName: 'Bob Smith',
    amount: 100,
    token: 'eAVAX',
    status: 'Completed',
    txHash: '0x' + randomHex(64),
    timestamp: new Date(Date.now() - 172800000).toISOString(),
  },
];

// API functions
export async function getEntities(): Promise<Entity[]> {
  await delay(500);
  return [...mockEntities];
}

export async function createEntity(data: CreateEntityRequest): Promise<Entity> {
  await delay(800);
  const newEntity: Entity = {
    id: String(mockEntities.length + 1),
    name: data.name,
    type: data.type,
    baseToken: data.baseToken,
    smartWalletAddress: '0x' + randomHex(40),
    balance: 0,
  };
  mockEntities.push(newEntity);
  return newEntity;
}

export async function getEntity(id: string): Promise<Entity | undefined> {
  await delay(300);
  return mockEntities.find(e => e.id === id);
}

export async function getEntityBalance(id: string): Promise<number> {
  await delay(400);
  const entity = mockEntities.find(e => e.id === id);
  if (entity) {
    // Simulate slight balance change
    entity.balance = entity.balance + (Math.random() * 0.5 - 0.25);
  }
  return entity?.balance ?? 0;
}

export async function getSubUsers(entityId: string): Promise<SubUser[]> {
  await delay(400);
  return mockSubUsers.filter(su => su.entityId === entityId);
}

export async function createSubUser(entityId: string, data: CreateSubUserRequest): Promise<SubUser> {
  await delay(600);
  const newSubUser: SubUser = {
    id: 'su' + (mockSubUsers.length + 1),
    entityId,
    name: data.name,
    role: data.role,
    walletAddress: data.walletAddress,
    allocationType: data.allocationType,
    allocation: data.allocation,
  };
  mockSubUsers.push(newSubUser);
  return newSubUser;
}

export async function createTransfer(data: TransferRequest): Promise<Transaction> {
  await delay(1000);
  const entity = mockEntities.find(e => e.id === data.entityId);
  const subUser = mockSubUsers.find(su => su.id === data.subUserId);
  
  if (!entity || !subUser) {
    throw new Error('Entity or SubUser not found');
  }
  
  if (entity.balance < data.amount) {
    throw new Error('Insufficient balance');
  }
  
  entity.balance -= data.amount;
  
  const newTx: Transaction = {
    id: 'tx' + (mockTransactions.length + 1),
    entityId: data.entityId,
    fromAddress: entity.smartWalletAddress,
    toAddress: subUser.walletAddress,
    toName: subUser.name,
    amount: data.amount,
    token: data.token,
    status: 'Completed',
    txHash: '0x' + randomHex(64),
    timestamp: new Date().toISOString(),
  };
  
  mockTransactions.unshift(newTx);
  return newTx;
}

export async function getTransactions(entityId: string): Promise<Transaction[]> {
  await delay(400);
  return mockTransactions.filter(tx => tx.entityId === entityId);
}
