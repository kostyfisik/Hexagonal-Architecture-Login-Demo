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
    // Mock OAuth flow simulation
    if (credentials.provider === 'google' && credentials.token === 'valid-google-token') {
      // Simulate network delay
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
    
    // Simulate the redirect by showing a message and then calling the callback
    console.log(`Would redirect to ${provider} OAuth endpoint`);
    console.log(`Callback URL: ${this.callbackUrl}`);
    
    // Simulate the OAuth provider response after a short delay
    setTimeout(() => {
      this.simulateOAuthCallback(provider);
    }, 1000);
  }
  
  // Simulate OAuth callback with token
  private simulateOAuthCallback(provider: string): void {
    // Create a custom event to notify the app about the OAuth callback
    const event = new CustomEvent('oauthCallback', {
      detail: {
        provider: provider,
        token: 'valid-google-token' // Mock token
      }
    });
    
    // Dispatch the event to be handled by the app
    window.dispatchEvent(event);
  }
}