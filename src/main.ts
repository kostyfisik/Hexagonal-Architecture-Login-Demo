import { App } from '../App.js';
import { AuthUsecase } from './app/AuthUsecase.js';
import { PwdAdapter } from './adapters/PwdAdapter.js';
import { OAuthAdapter } from './adapters/OAuthAdapter.js';
import { LocalStorageAdapter } from './adapters/LocalStorageAdapter.js';
import { AuthProvider } from './domain/types.js';

// Composition root - wire up the application
const localStorageAdapter = new LocalStorageAdapter();
const authUsecase = new AuthUsecase(localStorageAdapter);
const pwdAdapter = new PwdAdapter();
const oauthAdapter = new OAuthAdapter();

// Create the application instance with its dependencies
export const app = new App(authUsecase, pwdAdapter, oauthAdapter);

// Re-export AuthProvider for browser usage
export { AuthProvider };