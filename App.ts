import { AuthUsecase } from './AuthUsecase.js';
import { PwdAdapter, PwdCredentials } from './PwdAdapter.js';
import { OAuthAdapter, OAuthCredentials } from './OAuthAdapter.js';
import { LocalStorageAdapter } from './LocalStorageAdapter.js';
import { AuthResult } from './types.js';

export class App {
  private authUsecase: AuthUsecase;
  private pwdAdapter: PwdAdapter;
  private oauthAdapter: OAuthAdapter;
  private oauthPromiseResolver: ((result: AuthResult) => void) | null = null;
  
  constructor() {
    // Initialization logging reduced for brevity
    
    const localStorageAdapter = new LocalStorageAdapter();
    this.authUsecase = new AuthUsecase(localStorageAdapter);
    this.pwdAdapter = new PwdAdapter();
    this.oauthAdapter = new OAuthAdapter();
    
    // Set up the OAuth callback
    this.oauthAdapter.setOAuthCallback((provider, token) => {
      this.handleOAuthCallback(provider, token);
    });
  }
  
  async pwdLogin(username: string, password: string): Promise<AuthResult> {
    console.log(`[App] Attempting password login for user: ${username}`);
    
    const credentials: PwdCredentials = { username, password };
    const result = await this.authUsecase.login(this.pwdAdapter, credentials);
    
    return result;
  }
  
  async oauthLogin(provider: string): Promise<AuthResult> {
    console.log(`[App] Starting OAuth login process for provider: ${provider}`);
    
    this.oauthAdapter.initiateOAuthFlow(provider);
    
    return new Promise((resolve) => {
      this.oauthPromiseResolver = resolve;
    });
  }
  
  private async handleOAuthCallback(provider: string, token: string): Promise<void> {
    const credentials: OAuthCredentials = { provider, token };
    const result = await this.authUsecase.login(this.oauthAdapter, credentials);
    
    if (this.oauthPromiseResolver) {
      this.oauthPromiseResolver(result);
      this.oauthPromiseResolver = null;
    }
  }
  
  logout(): void {
    this.authUsecase.logout();
  }
  
  getCurrentUserId(): string | null {
    const userId = this.authUsecase.getCurrentUserId();
    return userId;
  }
}