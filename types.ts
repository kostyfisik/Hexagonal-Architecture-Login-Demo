import { User } from './User.js';

/**
 * Authentication result interface
 */
export interface AuthResult {
  success: boolean;
  userId?: string;
  error?: string;
}

/**
 * Storage constants
 */
export const STORAGE_KEYS = {
  USER_ID: 'userId'
} as const;

/**
 * Mock credential constants
 */
export const MOCK_CREDENTIALS = {
  USERNAME: 'admin',
  PASSWORD: 'password',
  GOOGLE_TOKEN: 'valid-google-token'
} as const;