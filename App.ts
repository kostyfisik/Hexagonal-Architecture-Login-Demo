import { AuthUsecase } from './AuthUsecase.js';
import { PwdAdapter, PwdCredentials } from './PwdAdapter.js';
import { OAuthAdapter, OAuthCredentials } from './OAuthAdapter.js';

export class App {
  private pwdUsecase: AuthUsecase<PwdCredentials>;
  private oauthUsecase: AuthUsecase<OAuthCredentials>;
  private oauthAdapter: OAuthAdapter;
  
  constructor() {
    console.log('[App] Initializing application with hexagonal architecture');
    
    this.pwdUsecase = new AuthUsecase<PwdCredentials>(new PwdAdapter());
    this.oauthAdapter = new OAuthAdapter();
    this.oauthUsecase = new AuthUsecase<OAuthCredentials>(this.oauthAdapter);
    
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
    
    console.log(`[App] Calling OAuth adapter to initiate flow for ${provider}`);
    this.oauthAdapter.initiateOAuthFlow(provider);
    
    console.log('[App] Setting up promise to wait for OAuth callback');
    
    return new Promise((resolve) => {
      const callbackHandler = (event: CustomEvent) => {
        console.log('[App] Received OAuth callback event:', event.detail);
        
        window.removeEventListener('oauthCallback', callbackHandler as EventListener);
        
        const { provider: callbackProvider, token } = event.detail;
        console.log(`[App] Processing OAuth callback for ${callbackProvider} with token: ${token}`);
        
        const credentials: OAuthCredentials = { provider: callbackProvider, token };
        
        console.log('[App] Calling OAuth usecase to complete authentication');
        this.oauthUsecase.login(credentials).then((result) => {
          console.log('[App] OAuth login completed with result:', result);
          resolve(result);
        });
      };
      
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