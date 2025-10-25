import { AuthPort, AuthCredentials } from '../domain/ports/AuthPort.js';
import { User } from '../domain/model/User.js';
import { MOCK_CREDENTIALS } from '../domain/types.js';

export interface OAuthCredentials extends AuthCredentials {
  provider: string;
  token?: string;
}

export class OAuthAdapter implements AuthPort<OAuthCredentials> {
  constructor() {
    // Constructor simplified as callbackUrl and oauthCallback are no longer needed
  }
  
  async authenticate(credentials: OAuthCredentials): Promise<User | null> {
    console.log(`[OAuthAdapter] Initiating OAuth flow for ${credentials.provider}`);
    
    // This promise now wraps the entire simulated flow
    return new Promise((resolve) => {
      // 1. Simulate redirecting to the provider
      setTimeout(() => {
        // 2. Simulate the callback from the provider with a token
        const token = MOCK_CREDENTIALS.GOOGLE_TOKEN;

        // 3. Simulate validating the token and getting user info
        if (credentials.provider === 'google' && token) {
          const user: User = {
            id: 'oauth-user-456',
            username: 'oauthuser',
            email: 'oauthuser@gmail.com'
          };
          resolve(user);
        } else {
          resolve(null);
        }
      }, 1000);
    });
  }
  

  

}