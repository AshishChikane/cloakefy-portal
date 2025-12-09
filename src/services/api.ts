import { 
  Entity, 
  SubUser, 
  Transaction, 
  CreateEntityRequest, 
  CreateSubUserRequest, 
  TransferRequest 
} from '@/types/api';
import axiosInstance from '@/lib/axios.config';

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

// API Response Types
interface ApiEntityResponse {
  entity_id: number;
  email_id: string;
  name: string;
  entity_type: string;
  base_token: string;
  createdAt: string;
  updatedAt: string;
  wallet_address: string;
}

interface GetEntitiesApiResponse {
  isSuccess: boolean;
  result: ApiEntityResponse[];
  message: string;
  statusCode: number;
}

// API functions
export async function getEntities(): Promise<Entity[]> {
  try {
    const response = await axiosInstance.get<GetEntitiesApiResponse>('/v1/entities');
    
    if (response.data.isSuccess && response.data.result) {
      // Map API response to Entity interface
      return response.data.result.map((apiEntity): Entity => ({
        id: String(apiEntity.entity_id),
        name: apiEntity.name,
        type: apiEntity.entity_type as Entity['type'],
        baseToken: apiEntity.base_token as Entity['baseToken'],
        smartWalletAddress: apiEntity.wallet_address,
        balance: 0, // Default balance, can be fetched separately if needed
      }));
    }
    
    // Fallback to mock data if API fails
    console.warn('API response format unexpected, using mock data');
    await delay(500);
    return [...mockEntities];
  } catch (error) {
    console.error('Error fetching entities:', error);
    // Fallback to mock data on error
    await delay(500);
    return [...mockEntities];
  }
}

// API Response Types for Create Entity
interface CreateEntityApiResponse {
  isSuccess: boolean;
  result: {
    entity_id: number;
    email_id: string;
    name: string;
    entity_type: string;
    base_token: string;
    createdAt: string;
    updatedAt: string;
    wallet_address?: string;
    api_key: string;
  };
  message: string;
  statusCode: number;
}

export async function createEntity(data: CreateEntityRequest, emailId: string): Promise<Entity> {
  try {
    const response = await axiosInstance.post<CreateEntityApiResponse>('/v1/entities', {
      name: data.name.trim(),
      email_id: emailId,
      entity_type: data.type,
      base_token: data.baseToken,
    });

    if (response.data.isSuccess && response.data.result) {
      const apiEntity = response.data.result;
      
      // Store API key in localStorage
      if (apiEntity.api_key) {
        localStorage.setItem('api_key', apiEntity.api_key);
      }

      // Map API response to Entity interface
      return {
        id: String(apiEntity.entity_id),
        name: apiEntity.name,
        type: apiEntity.entity_type as Entity['type'],
        baseToken: apiEntity.base_token as Entity['baseToken'],
        smartWalletAddress: apiEntity.wallet_address || '',
        balance: 0,
      };
    }

    throw new Error(response.data.message || 'Failed to create entity');
  } catch (error: any) {
    console.error('Error creating entity:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to create entity';
    throw new Error(errorMessage);
  }
}

// API Response Types for Get Entity by ID
interface WalletResponse {
  wallet_id: number;
  entity_id: number;
  address: string;
  network: string;
  chain_id: string;
  createdAt: string;
  updatedAt: string;
  balances?: WalletBalancesResponse;
}

interface WalletBalancesResponse {
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

interface SubEntityWalletResponse {
  wallet_id: number;
  sub_entity_id: number;
  address: string;
  network: string;
  chain_id: string;
  createdAt: string;
  updatedAt: string;
  balances?: WalletBalancesResponse;
}

interface SubEntityResponse {
  sub_entity_id: number;
  email_id: string;
  name: string;
  role: string;
  entity_id: number;
  createdAt: string;
  updatedAt: string;
  wallet: SubEntityWalletResponse;
}

interface GetEntityApiResponse {
  isSuccess: boolean;
  result: {
    entity_id: number;
    email_id: string;
    name: string;
    entity_type: string;
    base_token: string;
    createdAt: string;
    updatedAt: string;
    wallet: WalletResponse;
    sub_entities: SubEntityResponse[];
  };
  message: string;
  statusCode: number;
}

export async function getEntity(id: string): Promise<Entity | undefined> {
  try {
    const response = await axiosInstance.get<GetEntityApiResponse>(`/v1/entities/${id}`);
    
    if (response.data.isSuccess && response.data.result) {
      const apiEntity = response.data.result;
      const wallet = apiEntity.wallet;
      // Map API response to Entity interface
      return {
        id: String(apiEntity.entity_id),
        name: apiEntity.name,
        type: apiEntity.entity_type as Entity['type'],
        baseToken: apiEntity.base_token as Entity['baseToken'],
        smartWalletAddress: wallet.address,
        balance: 0, // Balance might need separate API call
        walletBalance: wallet.balances ? {
          avax: wallet.balances.avax,
          eusdc: wallet.balances.eusdc,
          eusdt: wallet.balances.eusdt,
        } : undefined,
      };
    }
    
    // Fallback to mock data if API fails
    console.warn('API response format unexpected, using mock data');
    await delay(300);
    return mockEntities.find(e => e.id === id);
  } catch (error) {
    console.error('Error fetching entity:', error);
    // Fallback to mock data on error
    await delay(300);
    return mockEntities.find(e => e.id === id);
  }
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
  try {
    // Get entity details which includes sub_entities
    const entity = await getEntity(entityId);
    if (!entity) {
      return [];
    }

    const response = await axiosInstance.get<GetEntityApiResponse>(`/v1/entities/${entityId}`);
    
    if (response.data.isSuccess && response.data.result?.sub_entities) {
      // Map sub_entities to SubUser interface
      return response.data.result.sub_entities.map((subEntity): SubUser => {
        const wallet = subEntity.wallet;
        return {
          id: String(subEntity.sub_entity_id),
          entityId: String(subEntity.entity_id),
          name: subEntity.name,
          role: subEntity.role,
          email_id: subEntity.email_id,
          walletAddress: wallet?.address || '',
          walletBalance: wallet?.balances ? {
            avax: wallet.balances.avax,
            eusdc: wallet.balances.eusdc,
            eusdt: wallet.balances.eusdt,
          } : undefined,
          allocationType: undefined,
          allocation: undefined,
        };
      });
    }
    
    // Fallback to mock data
    await delay(400);
    return mockSubUsers.filter(su => su.entityId === entityId);
  } catch (error) {
    console.error('Error fetching sub users:', error);
    // Fallback to mock data on error
    await delay(400);
    return mockSubUsers.filter(su => su.entityId === entityId);
  }
}

// API Response Types for Create Sub Entity
interface CreateSubEntityApiResponse {
  isSuccess: boolean;
  result: {
    sub_entity_id: number;
    email_id: string;
    name: string;
    role: string;
    entity_id: number;
    createdAt: string;
    updatedAt: string;
    wallet?: SubEntityWalletResponse;
  };
  message: string;
  statusCode: number;
}

export async function createSubUser(entityId: string, data: CreateSubUserRequest): Promise<SubUser> {
  try {
    // Get API key from localStorage
    const apiKey = localStorage.getItem('api_key');
    
    if (!apiKey) {
      throw new Error('API key not found. Please create an entity first.');
    }

    // Call the API endpoint
    const response = await axiosInstance.post<CreateSubEntityApiResponse>(
      '/v1/sub-entities',
      {
        name: data.name.trim(),
        email_id: data.email_id.trim(),
        role: data.role.trim(),
      },
      {
        headers: {
          'x-secret-key': apiKey,
        },
      }
    );

    if (response.data.isSuccess && response.data.result) {
      const apiSubEntity = response.data.result;
      
      // Map API response to SubUser interface
      const wallet = apiSubEntity.wallet;
      return {
        id: String(apiSubEntity.sub_entity_id),
        entityId: String(apiSubEntity.entity_id),
        name: apiSubEntity.name,
        role: apiSubEntity.role,
        email_id: apiSubEntity.email_id,
        walletAddress: wallet?.address || '',
        walletBalance: wallet?.balances ? {
          avax: wallet.balances.avax,
          eusdc: wallet.balances.eusdc,
          eusdt: wallet.balances.eusdt,
        } : undefined,
        allocationType: data.allocationType,
        allocation: data.allocation,
      };
    }

    throw new Error(response.data.message || 'Failed to create sub user');
  } catch (error: any) {
    console.error('Error creating sub user:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to create sub user';
    throw new Error(errorMessage);
  }
}

// API Response Types for Transfer
interface TransferApiResponse {
  isSuccess: boolean;
  result?: any;
  message: string;
  statusCode: number;
}

interface TransferApiRequest {
  entity_id: number;
  recipients: Array<{
    address: string;
    amount: string;
  }>;
  network: string;
}

export async function createTransfer(data: TransferRequest, subUsers: SubUser[], includePaymentHeader: boolean = false): Promise<any> {
  try {
    // Get API key from localStorage
    const apiKey = localStorage.getItem('api_key');
    
    if (!apiKey) {
      throw new Error('API key not found. Please create an entity first.');
    }

    // Map recipients from sub-user IDs to wallet addresses
    const recipients = data.recipients.map(recipient => {
      const subUser = subUsers.find(su => su.id === recipient.subUserId);
      
      if (!subUser || !subUser.walletAddress) {
        throw new Error(`SubUser with ID ${recipient.subUserId} not found or has no wallet address`);
      }
      
      return {
        address: subUser.walletAddress,
        amount: String(recipient.amount), // Convert to string as API expects
      };
    });

    // Prepare headers
    const headers: Record<string, string> = {
      'x-secret-key': apiKey,
    };
    
    // Add x-payment header if requested
    if (includePaymentHeader) {
      headers['x-payment'] = 'true';
    }

    // Call the API endpoint
    const response = await axiosInstance.post<TransferApiResponse>(
      '/v1/facilitator/run',
      {
        entity_id: Number(data.entityId),
        recipients: recipients,
        network: 'avalanche-fuji',
      },
      {
        headers: headers,
      }
    );
    console.log({response})
    
    // If statusCode is 402, return true
    if (response.data.statusCode === 402) {
      return true;
    }
    
    if (response.data.isSuccess) {
      return response.data.result;
    }

    throw new Error(response.data.message || 'Failed to create transfer');
  } catch (error: any) {
    console.error('Error creating transfer:', error);
    if (error.response?.data?.statusCode === 402) {
      return true;
    }
    const errorMessage = error.response?.data?.message || error.message || 'Failed to create transfer';
    throw new Error(errorMessage);
  }
}

export async function getTransactions(entityId: string): Promise<Transaction[]> {
  await delay(400);
  return mockTransactions.filter(tx => tx.entityId === entityId);
}

// API Response Types for Get Private Key
interface GetPrivateKeyApiResponse {
  isSuccess: boolean;
  result: {
    private_key: string;
    sub_entity_id: number;
  };
  message: string;
  statusCode: number;
}

export async function getSubUserPrivateKey(subEntityId: string): Promise<string> {
  try {
    // Get API key from localStorage
    const apiKey = localStorage.getItem('api_key');
    
    if (!apiKey) {
      throw new Error('API key not found. Please create an entity first.');
    }

    // Call the API endpoint
    const response = await axiosInstance.post<GetPrivateKeyApiResponse>(
      '/v1/facilitator/private-key',
      {
        sub_entity_id: Number(subEntityId),
      },
      {
        headers: {
          'x-secret-key': apiKey,
        },
      }
    );

    if (response.data.isSuccess && response.data.result) {
      return response.data.result.private_key;
    }

    throw new Error(response.data.message || 'Failed to get private key');
  } catch (error: any) {
    console.error('Error fetching private key:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to get private key';
    throw new Error(errorMessage);
  }
}

// API Response Types for Deposit
interface DepositApiResponse {
  isSuccess: boolean;
  result?: any;
  message: string;
  statusCode: number;
}

export async function depositToEntity(entityId: string, amount: number): Promise<void> {
  try {
    // Call the API endpoint
    const response = await axiosInstance.post<DepositApiResponse>(
      '/v1/entities/deposit',
      {
        entity_id: Number(entityId),
        amount: amount,
      },
      {
        headers: {
          'x-secret-key': localStorage.getItem('api_key'),
        },
      }
    );

    if (response.data.isSuccess) {
      return;
    }

    throw new Error(response.data.message || 'Failed to deposit funds');
  } catch (error: any) {
    console.error('Error depositing funds:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to deposit funds';
    throw new Error(errorMessage);
  }
}

// API Response Types for Withdraw
interface WithdrawApiResponse {
  isSuccess: boolean;
  result?: any;
  message: string;
  statusCode: number;
}

export async function withdrawFromEntity(entityId: string, amount: number): Promise<void> {
  try {
    // Call the API endpoint
    const response = await axiosInstance.post<WithdrawApiResponse>(
      '/v1/entities/withdraw',
      {
        entity_id: Number(entityId),
        amount: String(amount), // API expects string format
      },
      {
        headers: {
          'x-secret-key': localStorage.getItem('api_key'),
        },
      }
    );

    if (response.data.isSuccess) {
      return;
    }

    throw new Error(response.data.message || 'Failed to withdraw funds');
  } catch (error: any) {
    console.error('Error withdrawing funds:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to withdraw funds';
    throw new Error(errorMessage);
  }
}

// API Response Types for Resend Verification
interface ResendVerificationApiResponse {
  isSuccess: boolean;
  result?: any;
  message: string;
  statusCode: number;
}

export async function resendVerification(entityId: string): Promise<void> {
  try {
    // Call the API endpoint
    const response = await axiosInstance.post<ResendVerificationApiResponse>(
      '/v1/entities/resend-verification',
      {
        entity_id: Number(entityId),
      },
      {
        headers: {
          'x-secret-key': localStorage.getItem('api_key'),
        },
      }
    );

    if (response.data.isSuccess) {
      return;
    }

    throw new Error(response.data.message || 'Failed to resend verification');
  } catch (error: any) {
    console.error('Error resending verification:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to resend verification';
    throw new Error(errorMessage);
  }
}

// API Response Types for Google Auth Callback
interface GoogleAuthCallbackApiResponse {
  isSuccess: boolean;
  result?: {
    user?: {
      email: string;
      name: string;
      picture?: string;
    };
    token?: string;
    [key: string]: any;
  };
  message: string;
  statusCode: number;
}

export interface GoogleAuthCallbackRequest {
  credential?: string;
  access_token?: string;
  code?: string;
}

export async function googleAuthCallback(data: GoogleAuthCallbackRequest): Promise<{
  email: string;
  name: string;
  picture: string;
  token?: string;
}> {
  try {
    // Call the API endpoint
    const response = await axiosInstance.post<GoogleAuthCallbackApiResponse>(
      '/v1/auth/google/callback',
      data
    );

    if (response.data.isSuccess && response.data.result) {
      const result = response.data.result;
      
      // Extract user info from response
      const userInfo = {
        email: result.user?.email || '',
        name: result.user?.name || '',
        picture: result.user?.picture || '',
        token: result.token,
      };

      // Store token if provided
      if (result.token) {
        const platformUser = {
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          token: result.token,
        };
        localStorage.setItem('platform_user', JSON.stringify(platformUser));
      }

      return userInfo;
    }

    throw new Error(response.data.message || 'Failed to authenticate with Google');
  } catch (error: any) {
    console.error('Error in Google auth callback:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to authenticate with Google';
    throw new Error(errorMessage);
  }
}
