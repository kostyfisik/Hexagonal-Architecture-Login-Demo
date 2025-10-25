import { describe, it, expect, beforeEach, vi } from 'vitest';
import { App } from '../../App.js';
import { AuthUsecase } from './AuthUsecase.js';
import { PwdAdapter } from '../adapters/PwdAdapter.js';
import { OAuthAdapter } from '../adapters/OAuthAdapter.js';
import { LocalStorageAdapter } from '../adapters/LocalStorageAdapter.js';
import { AuthProvider } from '../domain/types.js';

describe('App Event System', () => {
  let app: App;
  let authUsecase: AuthUsecase;
  let pwdAdapter: PwdAdapter;
  let oauthAdapter: OAuthAdapter;

  beforeEach(() => {
    const storageAdapter = new LocalStorageAdapter();
    authUsecase = new AuthUsecase(storageAdapter);
    pwdAdapter = new PwdAdapter();
    oauthAdapter = new OAuthAdapter();
    app = new App(authUsecase, pwdAdapter, oauthAdapter);
  });

  describe('Event emission', () => {
    it('should emit loginSuccess and authStateChanged events on successful password login', async () => {
      const loginSuccessHandler = vi.fn();
      const authStateChangedHandler = vi.fn();

      app.on('loginSuccess', loginSuccessHandler);
      app.on('authStateChanged', authStateChangedHandler);

      await app.pwdLogin('admin', 'password');

      expect(loginSuccessHandler).toHaveBeenCalledWith({ userId: 'user-123' });
      expect(authStateChangedHandler).toHaveBeenCalledWith({ 
        isAuthenticated: true, 
        userId: 'user-123' 
      });
    });

    it('should emit loginError event on failed password login', async () => {
      const loginErrorHandler = vi.fn();
      const loginSuccessHandler = vi.fn();

      app.on('loginError', loginErrorHandler);
      app.on('loginSuccess', loginSuccessHandler);

      await app.pwdLogin('wrong', 'credentials');

      expect(loginErrorHandler).toHaveBeenCalledWith({ error: 'Invalid credentials' });
      expect(loginSuccessHandler).not.toHaveBeenCalled();
    });

    it('should emit loginSuccess and authStateChanged events on successful OAuth login', async () => {
      const loginSuccessHandler = vi.fn();
      const authStateChangedHandler = vi.fn();

      app.on('loginSuccess', loginSuccessHandler);
      app.on('authStateChanged', authStateChangedHandler);

      await app.oauthLogin(AuthProvider.GOOGLE);

      expect(loginSuccessHandler).toHaveBeenCalledWith({ userId: 'oauth-user-456' });
      expect(authStateChangedHandler).toHaveBeenCalledWith({ 
        isAuthenticated: true, 
        userId: 'oauth-user-456' 
      });
    });

    it('should emit logout and authStateChanged events on logout', () => {
      const logoutHandler = vi.fn();
      const authStateChangedHandler = vi.fn();

      app.on('logout', logoutHandler);
      app.on('authStateChanged', authStateChangedHandler);

      app.logout();

      expect(logoutHandler).toHaveBeenCalledWith(undefined);
      expect(authStateChangedHandler).toHaveBeenCalledWith({ 
        isAuthenticated: false, 
        userId: null 
      });
    });
  });

  describe('Event subscription', () => {
    it('should allow unsubscribing from events', async () => {
      const handler = vi.fn();
      const unsubscribe = app.on('loginSuccess', handler);

      await app.pwdLogin('admin', 'password');
      expect(handler).toHaveBeenCalledTimes(1);

      // Unsubscribe
      unsubscribe();

      await app.pwdLogin('admin', 'password');
      // Should still be 1, not 2
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should support multiple subscribers to the same event', async () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      app.on('loginSuccess', handler1);
      app.on('loginSuccess', handler2);

      await app.pwdLogin('admin', 'password');

      expect(handler1).toHaveBeenCalledWith({ userId: 'user-123' });
      expect(handler2).toHaveBeenCalledWith({ userId: 'user-123' });
    });
  });

  describe('Error handling in event handlers', () => {
    it('should continue emitting events even if one handler throws', async () => {
      const errorHandler = vi.fn(() => {
        throw new Error('Handler error');
      });
      const successHandler = vi.fn();

      app.on('loginSuccess', errorHandler);
      app.on('loginSuccess', successHandler);

      await app.pwdLogin('admin', 'password');

      // Both handlers should have been called
      expect(errorHandler).toHaveBeenCalled();
      expect(successHandler).toHaveBeenCalled();
    });
  });
});
