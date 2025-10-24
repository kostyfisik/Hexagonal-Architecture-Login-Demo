import { AuthUsecase } from './AuthUsecase.js';
import { PwdAdapter, PwdCredentials } from './PwdAdapter.js';
import { OAuthAdapter, OAuthCredentials } from './OAuthAdapter.js';

export class App {
  private pwdUsecase: AuthUsecase;
  private oauthUsecase: AuthUsecase;
  private oauthAdapter: OAuthAdapter;
  
  constructor() {
    // Dependency injection following hexagonal architecture
    this.pwdUsecase = new AuthUsecase(new PwdAdapter());
    this.oauthAdapter = new OAuthAdapter();
    this.oauthUsecase = new AuthUsecase(this.oauthAdapter);
  }
  
  async pwdLogin(username: string, password: string): Promise<{ success: boolean; userId?: string; error?: string }> {
    const credentials: PwdCredentials = { username, password };
    return this.pwdUsecase.login(credentials);
  }
  
  async oauthLogin(provider: string): Promise<{ success: boolean; userId?: string; error?: string }> {
    // Initiate OAuth redirect flow
    this.oauthAdapter.initiateOAuthFlow(provider);
    
    // Return a pending state - the actual result will come from the callback handler
    return new Promise((resolve) => {
      // Set up a one-time listener for the OAuth callback
      const callbackHandler = (event: CustomEvent) => {
        // Remove the event listener to prevent memory leaks
        window.removeEventListener('oauthCallback', callbackHandler as EventListener);
        
        // Process the OAuth callback data
        const { provider: callbackProvider, token } = event.detail;
        const credentials: OAuthCredentials = { provider: callbackProvider, token };
        
        // Complete the login process with the token
        this.oauthUsecase.login(credentials).then(resolve);
      };
      
      // Listen for the OAuth callback event
      window.addEventListener('oauthCallback', callbackHandler as EventListener);
    });
  }
  
  logout(): void {
    this.pwdUsecase.logout();
  }
  
  getCurrentUserId(): string | null {
    return this.pwdUsecase.getCurrentUserId();
  }
}