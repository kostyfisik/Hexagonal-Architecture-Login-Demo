import { User } from './User.js';

export interface AuthPort {
  authenticate(credentials: any): Promise<User | null>;
}