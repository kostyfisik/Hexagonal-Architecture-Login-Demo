import { User } from './User.js';

export interface AuthCredentials {}

export interface AuthPort<T extends AuthCredentials = AuthCredentials> {
  authenticate(credentials: T): Promise<User | null>;
}