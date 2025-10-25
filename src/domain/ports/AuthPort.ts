import { User } from '../model/User.js';

export interface AuthCredentials {
  // Base interface for authentication credentials
}

export interface AuthPort<T extends AuthCredentials = AuthCredentials> {
  authenticate(credentials: T): Promise<User | null>;
}