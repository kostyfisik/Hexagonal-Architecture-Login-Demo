import { AuthPort } from './AuthPort.js';
import { User } from './User.js';

export interface OAuthCredentials {
  provider: string;
  token?: string;
}

export class OAuthAdapter implements AuthPort {
  // Store the callback URL for redirect simulation
  private callbackUrl: string;
  
  constructor() {
    // In a real app, this would be configured based on the environment
    this.callbackUrl = window.location.origin + window.location.pathname + '?oauth_callback=1';
  }
  
  async authenticate(credentials: OAuthCredentials): Promise<User | null> {
    console.log('[OAuthAdapter] Authenticating with credentials:', credentials);
    
    // Mock OAuth flow simulation
    if (credentials.provider === 'google' && credentials.token === 'valid-google-token') {
      console.log('[OAuthAdapter] Valid Google token received, proceeding with authentication');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log('[OAuthAdapter] Authentication successful, returning mock user');
      
      // Return mock user
      return {
        id: 'oauth-user-456',
        username: 'oauthuser',
        email: 'oauthuser@gmail.com'
      };
    }
    
    console.log('[OAuthAdapter] Authentication failed - invalid provider or token');
    return null; // Provider not supported or auth failed
  }
  
  // Simulate OAuth redirect flow
  initiateOAuthFlow(provider: string): void {
    console.log(`[OAuthAdapter] Initiating OAuth flow for ${provider}`);
    console.log(`[OAuthAdapter] Would redirect to ${provider} OAuth endpoint`);
    console.log(`[OAuthAdapter] Callback URL: ${this.callbackUrl}`);
    
    // In a real app, this would redirect the user to the OAuth provider
    // For demo purposes, we'll simulate the redirect and callback
    
    console.log('[OAuthAdapter] Simulating OAuth redirect...');
    
    // Simulate the OAuth provider response after a short delay
    setTimeout(() => {
      console.log('[OAuthAdapter] Simulating OAuth callback after redirect');
      this.simulateOAuthCallback(provider);
    }, 1000);
  }
  
  // Simulate OAuth callback with token
  private simulateOAuthCallback(provider: string): void {
    console.log(`[OAuthAdapter] Simulating OAuth callback for ${provider}`);
    
    // Create a custom event to notify the app about the OAuth callback
    const event = new CustomEvent('oauthCallback', {
      detail: {
        provider: provider,
        token: 'valid-google-token' // Mock token
      }
    });
    
    console.log('[OAuthAdapter] Dispatching oauthCallback event with token');
    
    // Dispatch the event to be handled by the app
    window.dispatchEvent(event);
  }
}