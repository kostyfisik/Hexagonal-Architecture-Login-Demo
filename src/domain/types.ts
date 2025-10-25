/**
 * Authentication result discriminated union
 * This pattern makes invalid states unrepresentable
 */

type SuccessAuthResult = {
  success: true;
  userId: string;
};

type ErrorAuthResult = {
  success: false;
  error: string;
};

export type AuthResult = SuccessAuthResult | ErrorAuthResult;

/**
 * OAuth provider enum
 */
export enum AuthProvider {
  GOOGLE = 'google',
  GITHUB = 'github'
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