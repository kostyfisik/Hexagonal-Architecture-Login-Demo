import { AuthPort, AuthCredentials } from './AuthPort.js';
import { User } from './User.js';

export class AuthUsecase<T extends AuthCredentials> {
  constructor(private authAdapter: AuthPort<T>) {
    console.log('[AuthUsecase] Created with auth adapter:', authAdapter.constructor.name);
  }
  
  async login(credentials: T): Promise<{ success: boolean; userId?: string; error?: string }> {
    console.log('[AuthUsecase] Login initiated with credentials:', credentials);
    
    try {
      const user = await this.authAdapter.authenticate(credentials);
      console.log('[AuthUsecase] Authentication result:', user);
      
      if (user) {
        console.log('[AuthUsecase] Authentication successful, saving user ID to localStorage');
        
        localStorage.setItem('userId', user.id);
        console.log('[AuthUsecase] User ID saved to localStorage:', user.id);
        
        return { success: true, userId: user.id };
      } else {
        console.log('[AuthUsecase] Authentication failed - invalid credentials');
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      console.error('[AuthUsecase] Authentication error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }
  
  logout(): void {
    console.log('[AuthUsecase] Logout initiated');
    localStorage.removeItem('userId');
    console.log('[AuthUsecase] User ID removed from localStorage');
  }
  
  getCurrentUserId(): string | null {
    console.log('[AuthUsecase] Getting current user ID from localStorage');
    const userId = localStorage.getItem('userId');
    console.log('[AuthUsecase] Current user ID:', userId);
    return userId;
  }
}