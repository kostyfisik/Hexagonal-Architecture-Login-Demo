import { AuthPort } from './AuthPort.js';
import { User } from './User.js';

export interface OAuthCredentials {
  provider: string;
  token?: string;
}

export class OAuthAdapter implements AuthPort {
  async authenticate(credentials: OAuthCredentials): Promise<User | null> {
    // Mock OAuth flow simulation
    if (credentials.provider === 'google') {
      // Simulate redirect and token exchange
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Return mock user
      return {
        id: 'oauth-user-456',
        username: 'oauthuser',
        email: 'oauthuser@gmail.com'
      };
    }
    
    return null; // Provider not supported or auth failed
  }
  
  // Simulate OAuth redirect flow
  initiateOAuthFlow(provider: string): void {
    console.log(`Redirecting to ${provider} OAuth flow...`);
    // In a real app, this would redirect the user to the OAuth provider
    // For demo purposes, we'll simulate the redirect and callback
  }
}