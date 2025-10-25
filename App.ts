import { AuthUsecase } from './src/app/AuthUsecase.js';
import { PwdAdapter, PwdCredentials } from './src/adapters/PwdAdapter.js';
import { OAuthAdapter, OAuthCredentials } from './src/adapters/OAuthAdapter.js';
import { AuthResult, AuthProvider, AppEvents } from './src/domain/types.js';
import { EventEmitter } from './src/domain/EventEmitter.js';

// Re-export AuthProvider for browser usage
export { AuthProvider };

export class App {
  private events: EventEmitter<AppEvents>;
  
  constructor(
    private authUsecase: AuthUsecase,
    private pwdAdapter: PwdAdapter,
    private oauthAdapter: OAuthAdapter
  ) {
    this.events = new EventEmitter<AppEvents>();
  }
  
  /**
   * Subscribe to application events
   * @param eventName The event to listen to
   * @param handler The callback function
   * @returns Unsubscribe function
   */
  on<K extends keyof AppEvents>(eventName: K, handler: (data: AppEvents[K]) => void): () => void {
    return this.events.on(eventName, handler);
  }
  
  async pwdLogin(username: string, password: string): Promise<AuthResult> {
    console.log(`[App] Attempting password login for user: ${username}`);
    
    const credentials: PwdCredentials = { username, password };
    const result = await this.authUsecase.login(this.pwdAdapter, credentials);
    
    // Emit events based on result
    if (result.success) {
      this.events.emit('loginSuccess', { userId: result.userId });
      this.events.emit('authStateChanged', { isAuthenticated: true, userId: result.userId });
    } else {
      this.events.emit('loginError', { error: result.error });
    }
    
    return result;
  }
  
  async oauthLogin(provider: AuthProvider): Promise<AuthResult> {
    console.log(`[App] Starting OAuth login process for provider: ${provider}`);
    
    const credentials: OAuthCredentials = { provider };
    const result = await this.authUsecase.login(this.oauthAdapter, credentials);
    
    // Emit events based on result
    if (result.success) {
      this.events.emit('loginSuccess', { userId: result.userId });
      this.events.emit('authStateChanged', { isAuthenticated: true, userId: result.userId });
    } else {
      this.events.emit('loginError', { error: result.error });
    }
    
    return result;
  }
  
  logout(): void {
    this.authUsecase.logout();
    this.events.emit('logout', undefined);
    this.events.emit('authStateChanged', { isAuthenticated: false, userId: null });
  }
  
  getCurrentUserId(): string | null {
    const userId = this.authUsecase.getCurrentUserId();
    return userId;
  }
}