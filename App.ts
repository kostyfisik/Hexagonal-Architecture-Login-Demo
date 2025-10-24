import { AuthUsecase } from './AuthUsecase.js';
import { PwdAdapter, PwdCredentials } from './PwdAdapter.js';
import { OAuthAdapter, OAuthCredentials } from './OAuthAdapter.js';

export class App {
  private pwdUsecase: AuthUsecase;
  private oauthUsecase: AuthUsecase;
  
  constructor() {
    // Dependency injection following hexagonal architecture
    this.pwdUsecase = new AuthUsecase(new PwdAdapter());
    this.oauthUsecase = new AuthUsecase(new OAuthAdapter());
  }
  
  async pwdLogin(username: string, password: string): Promise<{ success: boolean; userId?: string; error?: string }> {
    const credentials: PwdCredentials = { username, password };
    return this.pwdUsecase.login(credentials);
  }
  
  async oauthLogin(provider: string): Promise<{ success: boolean; userId?: string; error?: string }> {
    // Simulate OAuth redirect flow
    const oauthAdapter = new OAuthAdapter();
    oauthAdapter.initiateOAuthFlow(provider);
    
    // In a real app, we would get the token from the OAuth callback
    // For demo purposes, we'll simulate getting a token
    const credentials: OAuthCredentials = { provider, token: 'mock-token' };
    return this.oauthUsecase.login(credentials);
  }
  
  logout(): void {
    this.pwdUsecase.logout();
  }
  
  getCurrentUserId(): string | null {
    return this.pwdUsecase.getCurrentUserId();
  }
}