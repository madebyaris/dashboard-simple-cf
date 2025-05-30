import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWTPayload, Env } from '../types';

export async function hashPassword(password: string, rounds: number = 10): Promise<string> {
  return await bcrypt.hash(password, rounds);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function generateJWT(payload: Omit<JWTPayload, 'exp'>, secret: string): string {
  const expiresIn = '24h';
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyJWT(token: string, secret: string): JWTPayload | null {
  try {
    return jwt.verify(token, secret) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export function extractToken(request: Request): string | null {
  const authorization = request.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) {
    return null;
  }
  return authorization.slice(7);
}

export async function authenticateRequest(request: Request, env: Env): Promise<JWTPayload | null> {
  const token = extractToken(request);
  if (!token) {
    return null;
  }
  
  return verifyJWT(token, env.JWT_SECRET);
} 