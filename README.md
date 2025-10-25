# Hexagonal Architecture Login Demo

This is a minimalistic teaching project demonstrating a login form with password and OAuth options using vanilla TypeScript and following hexagonal architecture principles.

## Project Structure

The project follows hexagonal architecture principles with a clear separation of concerns:

```
src/
├── app/                       # Application Layer (Use Cases)
│   ├── AuthUsecase.ts        # Core business logic for authentication
│   └── AuthUsecase.test.ts   # Unit tests for the core authentication logic
│
├── domain/                    # Core Domain Logic and Ports
│   ├── ports/
│   │   ├── AuthPort.ts       # Interface (port) for authentication adapters
│   │   └── StoragePort.ts    # Interface (port) for storage adapters
│   ├── model/
│   │   └── User.ts           # Domain entity representing a user
│   └── types.ts              # Domain types and constants
│
└── adapters/                  # Infrastructure Layer (Adapters)
    ├── PwdAdapter.ts          # Adapter for password-based authentication
    ├── OAuthAdapter.ts        # Adapter for OAuth-based authentication
    └── LocalStorageAdapter.ts # Adapter for browser localStorage

App.ts                         # Composition root - wires everything together
index.html                     # Frontend UI demonstrating the login functionality
```

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

2. Start the development server:
   ```
   npm run dev
   ```

3. Open your browser and navigate to http://localhost:5173

4. Use username "admin" and password "password" for password login

5. Use the "Login with Google" button to simulate OAuth login

## Building for Production

Build the project for production:
```
npm run build
```

Preview the production build:
```
npm run preview
```

## Running Tests

### Run Tests Once
```
npm run test:run
```

### Watch Mode (for development)
```
npm test
```

### Interactive UI Mode
```
npm run test:ui
```

## Testing

The project uses **Vitest** for unit testing. Tests are located in [src/app/AuthUsecase.test.ts](file:///Users/tig/coding/qoder-proj/src/app/AuthUsecase.test.ts) and verify:
- User ID is saved to storage on successful authentication
- User ID is not saved on failed authentication
- User ID is removed from storage on logout
- Current user ID can be retrieved from storage
- Null is returned when no user is logged in

All backend calls are mocked, and the OAuth redirect flow is simulated.

## Technology Stack

- **Vite** - Fast build tool and development server
- **Vitest** - Modern testing framework with Vite integration
- **TypeScript** - Type-safe JavaScript
- **Happy-DOM** - Lightweight DOM implementation for testing