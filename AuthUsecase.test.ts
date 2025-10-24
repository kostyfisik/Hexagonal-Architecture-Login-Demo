import { AuthUsecase } from './AuthUsecase.js';
import { AuthPort, AuthCredentials } from './AuthPort.js';
import { User } from './User.js';
import { AuthResult } from './types.js';

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

async function testAuthUsecase() {
  console.log('Starting AuthUsecase tests...');
  
  console.log('\nTest 1: Successful authentication');
  localStorage.clear();
  const successAdapter = new MockAuthAdapter(true);
  const successUsecase = new AuthUsecase<AuthCredentials>(successAdapter);
  
  const successResult: AuthResult = await successUsecase.login({ username: 'test', password: 'pass' });
  console.log('Login result:', successResult);
  console.log('User ID in localStorage:', localStorage.getItem('userId'));
  
  if (successResult.success && successResult.userId === 'test-user-789' && localStorage.getItem('userId') === 'test-user-789') {
    console.log('✅ Test 1 passed');
  } else {
    console.log('❌ Test 1 failed');
  }
  
  console.log('\nTest 2: Failed authentication');
  localStorage.clear();
  const failAdapter = new MockAuthAdapter(false);
  const failUsecase = new AuthUsecase<AuthCredentials>(failAdapter);
  
  const failResult: AuthResult = await failUsecase.login({ username: 'invalid', password: 'wrong' });
  console.log('Login result:', failResult);
  console.log('User ID in localStorage:', localStorage.getItem('userId'));
  
  if (!failResult.success && !failResult.userId && localStorage.getItem('userId') === null) {
    console.log('✅ Test 2 passed');
  } else {
    console.log('❌ Test 2 failed');
  }
  
  console.log('\nTest 3: Logout functionality');
  localStorage.clear();
  await successUsecase.login({ username: 'test', password: 'pass' });
  console.log('User ID after login:', localStorage.getItem('userId'));
  
  successUsecase.logout();
  console.log('User ID after logout:', localStorage.getItem('userId'));
  
  if (localStorage.getItem('userId') === null) {
    console.log('✅ Test 3 passed');
  } else {
    console.log('❌ Test 3 failed');
  }
  
  console.log('\nTest 4: getCurrentUserId functionality');
  localStorage.clear();
  await successUsecase.login({ username: 'test', password: 'pass' });
  
  const currentUserId = successUsecase.getCurrentUserId();
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