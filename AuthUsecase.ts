import { AuthPort, AuthCredentials } from './AuthPort.js';
import { User } from './User.js';
import { AuthResult, STORAGE_KEYS } from './types.js';

export class AuthUsecase<T extends AuthCredentials> {
  constructor(private authAdapter: AuthPort<T>) {}
  
  async login(credentials: T): Promise<AuthResult> {
    console.log('[AuthUsecase] Login initiated');
    
    try {
      const user = await this.authAdapter.authenticate(credentials);
      
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER_ID, user.id);
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
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
  }
  
  getCurrentUserId(): string | null {
    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    return userId;
  }
}