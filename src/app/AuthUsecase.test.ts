import { describe, it, expect, beforeEach } from 'vitest';
import { AuthUsecase } from './AuthUsecase.js';
import { AuthPort, AuthCredentials } from '../domain/ports/AuthPort.js';
import { StoragePort } from '../domain/ports/StoragePort.js';
import { User } from '../domain/model/User.js';
import { AuthResult } from '../domain/types.js';

class MockAuthAdapter implements AuthPort<AuthCredentials> {
  private shouldSucceed: boolean;
  
  constructor(shouldSucceed: boolean) {
    this.shouldSucceed = shouldSucceed;
  }
  
  async authenticate(credentials: AuthCredentials): Promise<User | null> {
    if (this.shouldSucceed) {
      return {
        id: 'test-user-789',
        username: 'testuser',
        email: 'test@example.com'
      };
    }
    return null;
  }
}

class MockStorageAdapter implements StoragePort {
  private storage: Map<string, string> = new Map();
  
  getItem(key: string): string | null {
    return this.storage.get(key) || null;
  }
  
  setItem(key: string, value: string): void {
    this.storage.set(key, value);
  }
  
  removeItem(key: string): void {
    this.storage.delete(key);
  }
}

describe('AuthUsecase', () => {
  let mockStorage: MockStorageAdapter;
  let successAdapter: MockAuthAdapter;
  let failAdapter: MockAuthAdapter;
  let authUsecase: AuthUsecase;

  beforeEach(() => {
    mockStorage = new MockStorageAdapter();
    successAdapter = new MockAuthAdapter(true);
    failAdapter = new MockAuthAdapter(false);
    authUsecase = new AuthUsecase(mockStorage);
  });

  it('should successfully authenticate and store user ID', async () => {
    const result: AuthResult = await authUsecase.login(successAdapter, { username: 'test', password: 'pass' });
    
    expect(result.success).toBe(true);
    expect(result.userId).toBe('test-user-789');
    expect(mockStorage.getItem('userId')).toBe('test-user-789');
  });

  it('should fail authentication with invalid credentials', async () => {
    const result: AuthResult = await authUsecase.login(failAdapter, { username: 'invalid', password: 'wrong' });
    
    expect(result.success).toBe(false);
    expect(result.userId).toBeUndefined();
    expect(mockStorage.getItem('userId')).toBeNull();
  });

  it('should logout and remove user ID from storage', async () => {
    await authUsecase.login(successAdapter, { username: 'test', password: 'pass' });
    expect(mockStorage.getItem('userId')).toBe('test-user-789');
    
    authUsecase.logout();
    expect(mockStorage.getItem('userId')).toBeNull();
  });

  it('should return current user ID when logged in', async () => {
    await authUsecase.login(successAdapter, { username: 'test', password: 'pass' });
    
    const currentUserId = authUsecase.getCurrentUserId();
    expect(currentUserId).toBe('test-user-789');
  });

  it('should return null when no user is logged in', () => {
    const currentUserId = authUsecase.getCurrentUserId();
    expect(currentUserId).toBeNull();
  });
});