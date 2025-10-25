import { AuthPort, AuthCredentials } from '../domain/ports/AuthPort.js';
import { User } from '../domain/model/User.js';
import { MOCK_CREDENTIALS } from '../domain/types.js';

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