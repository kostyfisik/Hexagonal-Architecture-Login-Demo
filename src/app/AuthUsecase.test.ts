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

async function testAuthUsecase() {
  console.log('Starting AuthUsecase tests...');
  
  console.log('\nTest 1: Successful authentication');
  const mockStorage = new MockStorageAdapter();
  const successAdapter = new MockAuthAdapter(true);
  const successUsecase = new AuthUsecase(mockStorage);
  
  const successResult: AuthResult = await successUsecase.login(successAdapter, { username: 'test', password: 'pass' });
  console.log('Login result:', successResult);
  console.log('User ID in storage:', mockStorage.getItem('userId'));
  
  if (successResult.success && successResult.userId === 'test-user-789' && mockStorage.getItem('userId') === 'test-user-789') {
    console.log('✅ Test 1 passed');
  } else {
    console.log('❌ Test 1 failed');
  }
  
  console.log('\nTest 2: Failed authentication');
  const failAdapter = new MockAuthAdapter(false);
  const failStorage = new MockStorageAdapter();
  const failUsecase = new AuthUsecase(failStorage);
  
  const failResult: AuthResult = await failUsecase.login(failAdapter, { username: 'invalid', password: 'wrong' });
  console.log('Login result:', failResult);
  console.log('User ID in storage:', failStorage.getItem('userId'));
  
  if (!failResult.success && !failResult.userId && failStorage.getItem('userId') === null) {
    console.log('✅ Test 2 passed');
  } else {
    console.log('❌ Test 2 failed');
  }
  
  console.log('\nTest 3: Logout functionality');
  const logoutStorage = new MockStorageAdapter();
  const logoutUsecase = new AuthUsecase(logoutStorage);
  await logoutUsecase.login(successAdapter, { username: 'test', password: 'pass' });
  console.log('User ID after login:', logoutStorage.getItem('userId'));
  
  logoutUsecase.logout();
  console.log('User ID after logout:', logoutStorage.getItem('userId'));
  
  if (logoutStorage.getItem('userId') === null) {
    console.log('✅ Test 3 passed');
  } else {
    console.log('❌ Test 3 failed');
  }
  
  console.log('\nTest 4: getCurrentUserId functionality');
  const currentUserIdStorage = new MockStorageAdapter();
  const currentUserIdUsecase = new AuthUsecase(currentUserIdStorage);
  await currentUserIdUsecase.login(successAdapter, { username: 'test', password: 'pass' });
  
  const currentUserId = currentUserIdUsecase.getCurrentUserId();
  console.log('Current user ID:', currentUserId);
  
  if (currentUserId === 'test-user-789') {
    console.log('✅ Test 4 passed');
  } else {
    console.log('❌ Test 4 failed');
  }
  
  console.log('\nAll tests completed.');
}

testAuthUsecase();

export { testAuthUsecase };