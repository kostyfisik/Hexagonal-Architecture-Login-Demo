import { AuthPort } from './AuthPort.js';
import { User } from './User.js';

export class AuthUsecase {
  constructor(private authAdapter: AuthPort) {}
  
  async login(credentials: any): Promise<{ success: boolean; userId?: string; error?: string }> {
    try {
      const user = await this.authAdapter.authenticate(credentials);
      
      if (user) {
        // Save user ID to localStorage on successful authentication
        localStorage.setItem('userId', user.id);
        return { success: true, userId: user.id };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, error: 'Authentication failed' };
    }
  }
  
  logout(): void {
    localStorage.removeItem('userId');
  }
  
  getCurrentUserId(): string | null {
    return localStorage.getItem('userId');
  }
}