# Hexagonal Architecture Login Demo

This is a minimalistic teaching project demonstrating a login form with password and OAuth options using vanilla TypeScript and following hexagonal architecture principles.

## Project Structure

- [User.ts](file:///Users/tig/coding/qoder-proj/User.ts) - Domain entity representing a user
- [AuthPort.ts](file:///Users/tig/coding/qoder-proj/AuthPort.ts) - Interface (port) for authentication adapters
- [PwdAdapter.ts](file:///Users/tig/coding/qoder-proj/PwdAdapter.ts) - Adapter for password-based authentication
- [OAuthAdapter.ts](file:///Users/tig/coding/qoder-proj/OAuthAdapter.ts) - Adapter for OAuth-based authentication
- [AuthUsecase.ts](file:///Users/tig/coding/qoder-proj/AuthUsecase.ts) - Core business logic for authentication
- [App.ts](file:///Users/tig/coding/qoder-proj/App.ts) - Main application that wires everything together
- [index.html](file:///Users/tig/coding/qoder-proj/index.html) - Frontend UI demonstrating the login functionality
- [test.html](file:///Users/tig/coding/qoder-proj/test.html) - Test runner for the authentication use case
- [AuthUsecase.test.ts](file:///Users/tig/coding/qoder-proj/AuthUsecase.test.ts) - Unit tests for the core authentication logic

## Key Concepts Demonstrated

1. **Hexagonal Architecture** - Core logic is independent of external frameworks
2. **Dependency Inversion Principle** - Core logic depends on abstractions, not concrete implementations
3. **Interface Segregation Principle** - Specific interfaces for each adapter type
4. **Single Responsibility Principle** - Each component has a single, well-defined purpose

## How to Run

1. Install dependencies:
   ```
   npm install
   ```

2. Build the project:
   ```
   npm run build
   ```

3. Start the web server:
   ```
   npm start
   ```

4. Open your browser and navigate to http://localhost:3000

5. Use username "admin" and password "password" for password login

6. Use the "Login with Google" button to simulate OAuth login

## Running Tests

### Console Tests
Run tests in the console:
```
npm test
```

## Testing

The unit tests in [AuthUsecase.test.ts](file:///Users/tig/coding/qoder-proj/AuthUsecase.test.ts) verify that:
- User ID is saved to localStorage on successful authentication
- User ID is not saved on failed authentication
- User ID is removed from localStorage on logout
- Current user ID can be retrieved from localStorage

All backend calls are mocked, and the OAuth redirect flow is simulated.