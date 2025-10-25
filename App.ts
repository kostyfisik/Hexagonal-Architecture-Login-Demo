import { AuthUsecase } from './AuthUsecase.js';
import { PwdAdapter, PwdCredentials } from './PwdAdapter.js';
import { OAuthAdapter, OAuthCredentials } from './OAuthAdapter.js';
import { LocalStorageAdapter } from './LocalStorageAdapter.js';
import { AuthResult } from './types.js';

export class App {
  private pwdUsecase: AuthUsecase<PwdCredentials>;
  private oauthUsecase: AuthUsecase<OAuthCredentials>;
  private oauthAdapter: OAuthAdapter;
  private oauthPromiseResolver: ((result: AuthResult) => void) | null = null;
  
  constructor() {
    // Initialization logging reduced for brevity
    
    const localStorageAdapter = new LocalStorageAdapter();
    this.pwdUsecase = new AuthUsecase<PwdCredentials>(new PwdAdapter(), localStorageAdapter);
    this.oauthAdapter = new OAuthAdapter();
    this.oauthUsecase = new AuthUsecase<OAuthCredentials>(this.oauthAdapter, localStorageAdapter);
    
    // Set up the OAuth callback
    this.oauthAdapter.setOAuthCallback((provider, token) => {
      this.handleOAuthCallback(provider, token);
    });
  }
  
  async pwdLogin(username: string, password: string): Promise<AuthResult> {
    console.log(`[App] Attempting password login for user: ${username}`);
    
    const credentials: PwdCredentials = { username, password };
    const result = await this.pwdUsecase.login(credentials);
    
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
    const result = await this.oauthUsecase.login(credentials);
    
    if (this.oauthPromiseResolver) {
      this.oauthPromiseResolver(result);
      this.oauthPromiseResolver = null;
    }
  }
  
  logout(): void {
    this.pwdUsecase.logout();
  }
  
  getCurrentUserId(): string | null {
    const userId = this.pwdUsecase.getCurrentUserId();
    return userId;
  }
}