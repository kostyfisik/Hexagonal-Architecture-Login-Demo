import { AuthPort } from './AuthPort.js';
import { User } from './User.js';

export interface PwdCredentials {
  username: string;
  password: string;
}

export class PwdAdapter implements AuthPort {
  async authenticate(credentials: PwdCredentials): Promise<User | null> {
    // Mock implementation - in a real app, this would call an API
    if (credentials.username === 'admin' && credentials.password === 'password') {
      return {
        id: 'user-123',
        username: credentials.username,
        email: `${credentials.username}@example.com`
      };
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return null; // Authentication failed
  }
}