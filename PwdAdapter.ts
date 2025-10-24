import { AuthPort } from './AuthPort.js';
import { User } from './User.js';

export interface PwdCredentials {
  username: string;
  password: string;
}

export class PwdAdapter implements AuthPort {
  async authenticate(credentials: PwdCredentials): Promise<User | null> {
    console.log('[PwdAdapter] Authenticating with credentials:', credentials);
    
    // Mock implementation - in a real app, this would call an API
    if (credentials.username === 'admin' && credentials.password === 'password') {
      console.log('[PwdAdapter] Valid credentials provided, returning mock user');
      
      return {
        id: 'user-123',
        username: credentials.username,
        email: `${credentials.username}@example.com`
      };
    }
    
    console.log('[PwdAdapter] Invalid credentials provided, authentication failed');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return null; // Authentication failed
  }
}