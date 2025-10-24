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
    console.log('[OAuthAdapter] Authenticating with credentials:', credentials);
    
    if (credentials.provider === 'google' && credentials.token === MOCK_CREDENTIALS.GOOGLE_TOKEN) {
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
  
  /**
   * Set the callback function to be called when OAuth flow completes
   */
  setOAuthCallback(callback: (provider: string, token: string) => void): void {
    this.oauthCallback = callback;
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
    
    // Call the registered callback if available
    if (this.oauthCallback) {
      console.log('[OAuthAdapter] Calling registered OAuth callback');
      this.oauthCallback(provider, MOCK_CREDENTIALS.GOOGLE_TOKEN);
    } else {
      console.log('[OAuthAdapter] No OAuth callback registered');
    }
  }
  
  getCallbackUrl(): string {
    return this.callbackUrl;
  }
}