import { AuthUsecase } from './AuthUsecase.js';
import { PwdAdapter, PwdCredentials } from './PwdAdapter.js';
import { OAuthAdapter, OAuthCredentials } from './OAuthAdapter.js';
import { LocalStorageAdapter } from './LocalStorageAdapter.js';
import { AuthResult } from './types.js';

export class App {
  private authUsecase: AuthUsecase;
  private pwdAdapter: PwdAdapter;
  private oauthAdapter: OAuthAdapter;
  
  constructor() {
    // Initialization logging reduced for brevity
    
    const localStorageAdapter = new LocalStorageAdapter();
    this.authUsecase = new AuthUsecase(localStorageAdapter);
    this.pwdAdapter = new PwdAdapter();
    this.oauthAdapter = new OAuthAdapter();
  }
  
  async pwdLogin(username: string, password: string): Promise<AuthResult> {
    console.log(`[App] Attempting password login for user: ${username}`);
    
    const credentials: PwdCredentials = { username, password };
    const result = await this.authUsecase.login(this.pwdAdapter, credentials);
    
    return result;
  }
  
  async oauthLogin(provider: string): Promise<AuthResult> {
    console.log(`[App] Starting OAuth login process for provider: ${provider}`);
    
    const credentials: OAuthCredentials = { provider };
    const result = await this.authUsecase.login(this.oauthAdapter, credentials);
    
    return result;
  }
  

  
  logout(): void {
    this.authUsecase.logout();
  }
  
  getCurrentUserId(): string | null {
    const userId = this.authUsecase.getCurrentUserId();
    return userId;
  }
}