import { AuthPort, AuthCredentials } from './AuthPort.js';
import { User } from './User.js';
import { MOCK_CREDENTIALS } from './types.js';

export interface PwdCredentials extends AuthCredentials {
  username: string;
  password: string;
}

export class PwdAdapter implements AuthPort<PwdCredentials> {
  async authenticate(credentials: PwdCredentials): Promise<User | null> {
    
    if (credentials.username === MOCK_CREDENTIALS.USERNAME && credentials.password === MOCK_CREDENTIALS.PASSWORD) {
      return {
        id: 'user-123',
        username: credentials.username,
        email: `${credentials.username}@example.com`
      };
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return null;
  }
}