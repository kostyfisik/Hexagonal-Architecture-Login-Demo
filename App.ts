import { AuthUsecase } from './AuthUsecase.js';
import { PwdAdapter, PwdCredentials } from './PwdAdapter.js';
import { OAuthAdapter, OAuthCredentials } from './OAuthAdapter.js';

export class App {
  private pwdUsecase: AuthUsecase;
  private oauthUsecase: AuthUsecase;
  private oauthAdapter: OAuthAdapter;
  
  constructor() {
    console.log('[App] Initializing application with hexagonal architecture');
    
    // Dependency injection following hexagonal architecture
    this.pwdUsecase = new AuthUsecase(new PwdAdapter());
    this.oauthAdapter = new OAuthAdapter();
    this.oauthUsecase = new AuthUsecase(this.oauthAdapter);
    
    console.log('[App] Application initialized successfully');
  }
  
  async pwdLogin(username: string, password: string): Promise<{ success: boolean; userId?: string; error?: string }> {
    console.log(`[App] Attempting password login for user: ${username}`);
    
    const credentials: PwdCredentials = { username, password };
    const result = await this.pwdUsecase.login(credentials);
    
    console.log(`[App] Password login result:`, result);
    return result;
  }
  
  async oauthLogin(provider: string): Promise<{ success: boolean; userId?: string; error?: string }> {
    console.log(`[App] Starting OAuth login process for provider: ${provider}`);
    
    // Initiate OAuth redirect flow
    console.log(`[App] Calling OAuth adapter to initiate flow for ${provider}`);
    this.oauthAdapter.initiateOAuthFlow(provider);
    
    // Return a pending state - the actual result will come from the callback handler
    console.log('[App] Setting up promise to wait for OAuth callback');
    
    return new Promise((resolve) => {
      // Set up a one-time listener for the OAuth callback
      const callbackHandler = (event: CustomEvent) => {
        console.log('[App] Received OAuth callback event:', event.detail);
        
        // Remove the event listener to prevent memory leaks
        window.removeEventListener('oauthCallback', callbackHandler as EventListener);
        
        // Process the OAuth callback data
        const { provider: callbackProvider, token } = event.detail;
        console.log(`[App] Processing OAuth callback for ${callbackProvider} with token: ${token}`);
        
        const credentials: OAuthCredentials = { provider: callbackProvider, token };
        
        // Complete the login process with the token
        console.log('[App] Calling OAuth usecase to complete authentication');
        this.oauthUsecase.login(credentials).then((result) => {
          console.log('[App] OAuth login completed with result:', result);
          resolve(result);
        });
      };
      
      // Listen for the OAuth callback event
      console.log('[App] Adding event listener for oauthCallback event');
      window.addEventListener('oauthCallback', callbackHandler as EventListener);
    });
  }
  
  logout(): void {
    console.log('[App] Logging out user');
    this.pwdUsecase.logout();
    console.log('[App] User logged out successfully');
  }
  
  getCurrentUserId(): string | null {
    console.log('[App] Getting current user ID');
    const userId = this.pwdUsecase.getCurrentUserId();
    console.log('[App] Current user ID:', userId);
    return userId;
  }
}