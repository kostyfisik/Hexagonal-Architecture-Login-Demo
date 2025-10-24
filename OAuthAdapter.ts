import { AuthPort, AuthCredentials } from './AuthPort.js';
import { User } from './User.js';
import { MOCK_CREDENTIALS } from './types.js';

export interface OAuthCredentials extends AuthCredentials {
  provider: string;
  token?: string;
}

export class OAuthAdapter implements AuthPort<OAuthCredentials> {
  private callbackUrl: string;
  private oauthCallback?: (provider: string, token: string) => void;
  
  constructor() {
    this.callbackUrl = window.location.origin + window.location.pathname + '?oauth_callback=1';
  }
  
  async authenticate(credentials: OAuthCredentials): Promise<User | null> {
    
    if (credentials.provider === 'google' && credentials.token === MOCK_CREDENTIALS.GOOGLE_TOKEN) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        id: 'oauth-user-456',
        username: 'oauthuser',
        email: 'oauthuser@gmail.com'
      };
    }
    
    return null;
  }
  
  /**
   * Set the callback function to be called when OAuth flow completes
   */
  setOAuthCallback(callback: (provider: string, token: string) => void): void {
    this.oauthCallback = callback;
  }
  
  initiateOAuthFlow(provider: string): void {
    console.log(`[OAuthAdapter] Initiating OAuth flow for ${provider}`);
    
    setTimeout(() => {
      this.simulateOAuthCallback(provider);
    }, 1000);
  }
  
  private simulateOAuthCallback(provider: string): void {
    // Call the registered callback if available
    if (this.oauthCallback) {
      this.oauthCallback(provider, MOCK_CREDENTIALS.GOOGLE_TOKEN);
    }
  }
  
  getCallbackUrl(): string {
    return this.callbackUrl;
  }
}