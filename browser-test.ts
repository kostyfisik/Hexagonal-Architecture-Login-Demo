// Browser-compatible test runner
import { AuthUsecase } from './AuthUsecase.js';
import { AuthPort } from './AuthPort.js';
import { User } from './User.js';

// Mock AuthPort implementation for testing
class MockAuthAdapter implements AuthPort {
    private shouldSucceed: boolean;
    
    constructor(shouldSucceed: boolean) {
        this.shouldSucceed = shouldSucceed;
    }

    async authenticate(credentials: any): Promise<User | null> {
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

// Manual test function to verify AuthUsecase behavior
async function testAuthUsecase(): Promise<string[]> {
    console.log('Starting AuthUsecase tests...');
    
    const results: string[] = [];
    
    // Helper function to log results
    function log(message: string): void {
        console.log(message);
        results.push(message);
    }

    // Test 1: Successful authentication saves user ID to localStorage
    log('Test 1: Successful authentication');
    localStorage.clear();
    const successAdapter = new MockAuthAdapter(true);
    const successUsecase = new AuthUsecase(successAdapter);

    const successResult = await successUsecase.login({ username: 'test', password: 'pass' });
    log('Login result: ' + JSON.stringify(successResult));
    log('User ID in localStorage: ' + localStorage.getItem('userId'));

    if (successResult.success && successResult.userId === 'test-user-789' && localStorage.getItem('userId') === 'test-user-789') {
        log('✅ Test 1 passed');
    } else {
        log('❌ Test 1 failed');
    }

    // Test 2: Failed authentication does not save user ID
    log('Test 2: Failed authentication');
    localStorage.clear();
    const failAdapter = new MockAuthAdapter(false);
    const failUsecase = new AuthUsecase(failAdapter);

    const failResult = await failUsecase.login({ username: 'invalid', password: 'wrong' });
    log('Login result: ' + JSON.stringify(failResult));
    log('User ID in localStorage: ' + localStorage.getItem('userId'));

    if (!failResult.success && !failResult.userId && localStorage.getItem('userId') === null) {
        log('✅ Test 2 passed');
    } else {
        log('❌ Test 2 failed');
    }

    // Test 3: Logout removes user ID from localStorage
    log('Test 3: Logout functionality');
    localStorage.clear();
    // First login
    await successUsecase.login({ username: 'test', password: 'pass' });
    log('User ID after login: ' + localStorage.getItem('userId'));

    // Then logout
    successUsecase.logout();
    log('User ID after logout: ' + localStorage.getItem('userId'));

    if (localStorage.getItem('userId') === null) {
        log('✅ Test 3 passed');
    } else {
        log('❌ Test 3 failed');
    }

    // Test 4: getCurrentUserId retrieves the correct ID
    log('Test 4: getCurrentUserId functionality');
    localStorage.clear();
    // Login again
    await successUsecase.login({ username: 'test', password: 'pass' });

    const currentUserId = successUsecase.getCurrentUserId();
    log('Current user ID: ' + currentUserId);

    if (currentUserId === 'test-user-789') {
        log('✅ Test 4 passed');
    } else {
        log('❌ Test 4 failed');
    }

    log('All tests completed.');
    return results;
}

export { testAuthUsecase };