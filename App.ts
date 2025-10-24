import { AuthUsecase } from './AuthUsecase.js';
import { PwdAdapter, PwdCredentials } from './PwdAdapter.js';
import { OAuthAdapter, OAuthCredentials } from './OAuthAdapter.js';
import { AuthResult } from './types.js';

export class App {
  private pwdUsecase: AuthUsecase<PwdCredentials>;
  private oauthUsecase: AuthUsecase<OAuthCredentials>;
  private oauthAdapter: OAuthAdapter;
  private oauthPromiseResolver: ((result: AuthResult) => void) | null = null;
  
  constructor() {
    console.log('[App] Initializing application with hexagonal architecture');
    
    this.pwdUsecase = new AuthUsecase<PwdCredentials>(new PwdAdapter());
    this.oauthAdapter = new OAuthAdapter();
    this.oauthUsecase = new AuthUsecase<OAuthCredentials>(this.oauthAdapter);
    
    // Set up the OAuth callback
    this.oauthAdapter.setOAuthCallback((provider, token) => {
      console.log(`[App] Received OAuth callback for ${provider} with token: ${token}`);
      this.handleOAuthCallback(provider, token);
    });
    
    console.log('[App] Application initialized successfully');
  }
  
  async pwdLogin(username: string, password: string): Promise<AuthResult> {
    console.log(`[App] Attempting password login for user: ${username}`);
    
    const credentials: PwdCredentials = { username, password };
    const result = await this.pwdUsecase.login(credentials);
    
    console.log(`[App] Password login result:`, result);
    return result;
  }
  
  async oauthLogin(provider: string): Promise<AuthResult> {
    console.log(`[App] Starting OAuth login process for provider: ${provider}`);
    
    console.log(`[App] Calling OAuth adapter to initiate flow for ${provider}`);
    this.oauthAdapter.initiateOAuthFlow(provider);
    
    console.log('[App] Setting up promise to wait for OAuth callback');
    
    // Return a promise that will be resolved when the OAuth callback is received
    return new Promise((resolve) => {
      this.oauthPromiseResolver = resolve;
    });
  }
  
  private async handleOAuthCallback(provider: string, token: string): Promise<void> {
    console.log(`[App] Processing OAuth callback for ${provider} with token: ${token}`);
    
    const credentials: OAuthCredentials = { provider, token };
    
    console.log('[App] Calling OAuth usecase to complete authentication');
    const result = await this.oauthUsecase.login(credentials);
    console.log('[App] OAuth login completed with result:', result);
    
    // Resolve the pending promise if one exists
    if (this.oauthPromiseResolver) {
      console.log('[App] Resolving pending OAuth promise');
      this.oauthPromiseResolver(result);
      this.oauthPromiseResolver = null;
    }
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