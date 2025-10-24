import { AuthPort, AuthCredentials } from './AuthPort.js';
import { User } from './User.js';

export interface OAuthCredentials extends AuthCredentials {
  provider: string;
  token?: string;
}

export class OAuthAdapter implements AuthPort<OAuthCredentials> {
  private callbackUrl: string;
  
  constructor() {
    this.callbackUrl = window.location.origin + window.location.pathname + '?oauth_callback=1';
  }
  
  async authenticate(credentials: OAuthCredentials): Promise<User | null> {
    console.log('[OAuthAdapter] Authenticating with credentials:', credentials);
    
    if (credentials.provider === 'google' && credentials.token === 'valid-google-token') {
      console.log('[OAuthAdapter] Valid Google token received, proceeding with authentication');
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log('[OAuthAdapter] Authentication successful, returning mock user');
      
      return {
        id: 'oauth-user-456',
        username: 'oauthuser',
        email: 'oauthuser@gmail.com'
      };
    }
    
    console.log('[OAuthAdapter] Authentication failed - invalid provider or token');
    return null;
  }
  
  initiateOAuthFlow(provider: string): void {
    console.log(`[OAuthAdapter] Initiating OAuth flow for ${provider}`);
    console.log(`[OAuthAdapter] Would redirect to ${provider} OAuth endpoint`);
    console.log(`[OAuthAdapter] Callback URL: ${this.callbackUrl}`);
    
    console.log('[OAuthAdapter] Simulating OAuth redirect...');
    
    setTimeout(() => {
      console.log('[OAuthAdapter] Simulating OAuth callback after redirect');
      this.simulateOAuthCallback(provider);
    }, 1000);
  }
  
  private simulateOAuthCallback(provider: string): void {
    console.log(`[OAuthAdapter] Simulating OAuth callback for ${provider}`);
    
    const event = new CustomEvent('oauthCallback', {
      detail: {
        provider: provider,
        token: 'valid-google-token'
      }
    });
    
    console.log('[OAuthAdapter] Dispatching oauthCallback event with token');
    
    window.dispatchEvent(event);
  }
  
  getCallbackUrl(): string {
    return this.callbackUrl;
  }
}