import { AuthPort, AuthCredentials } from './AuthPort.js';
import { User } from './User.js';

export interface PwdCredentials extends AuthCredentials {
  username: string;
  password: string;
}

export class PwdAdapter implements AuthPort<PwdCredentials> {
  async authenticate(credentials: PwdCredentials): Promise<User | null> {
    console.log('[PwdAdapter] Authenticating with credentials:', credentials);
    
    if (credentials.username === 'admin' && credentials.password === 'password') {
      console.log('[PwdAdapter] Valid credentials provided, returning mock user');
      
      return {
        id: 'user-123',
        username: credentials.username,
        email: `${credentials.username}@example.com`
      };
    }
    
    console.log('[PwdAdapter] Invalid credentials provided, authentication failed');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return null;
  }
}