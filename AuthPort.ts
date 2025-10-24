import { User } from './User.js';

export interface AuthCredentials {
  // Base interface for authentication credentials
  // Can be extended by specific credential types
}

export interface AuthPort<T extends AuthCredentials = AuthCredentials> {
  authenticate(credentials: T): Promise<User | null>;
}