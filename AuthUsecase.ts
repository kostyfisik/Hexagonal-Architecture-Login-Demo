import { AuthPort, AuthCredentials } from './AuthPort.js';
import { StoragePort } from './StoragePort.js';
import { AuthResult, STORAGE_KEYS } from './types.js';

export class AuthUsecase {
  constructor(private storageAdapter: StoragePort) {}
  
  async login<T extends AuthCredentials>(authAdapter: AuthPort<T>, credentials: T): Promise<AuthResult> {
    console.log('[AuthUsecase] Login initiated');
    
    try {
      const user = await authAdapter.authenticate(credentials);
      
      if (user) {
        this.storageAdapter.setItem(STORAGE_KEYS.USER_ID, user.id);
        return { success: true, userId: user.id };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      console.error('[AuthUsecase] Authentication error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }
  
  logout(): void {
    this.storageAdapter.removeItem(STORAGE_KEYS.USER_ID);
  }
  
  getCurrentUserId(): string | null {
    const userId = this.storageAdapter.getItem(STORAGE_KEYS.USER_ID);
    return userId;
  }
}