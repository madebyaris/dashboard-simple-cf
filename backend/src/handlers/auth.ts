import { z } from 'zod';
import { hashPassword, verifyPassword, generateJWT, authenticateRequest } from '../utils/auth';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  invitationCode: z.string().min(1)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export async function handleRegister(request: Request, env: any): Promise<Response> {
  try {
    const body = await request.json();
    const { email, password, name, invitationCode } = registerSchema.parse(body);

    // Validate invitation code
    if (invitationCode !== 'akuteman') {
      return Response.json(
        { success: false, error: 'Invalid invitation code' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first();

    if (existingUser) {
      return Response.json(
        { success: false, error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password, parseInt(env.BCRYPT_ROUNDS));
    
    const result = await env.DB.prepare(
      'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?) RETURNING id, email, name, created_at'
    ).bind(email, passwordHash, name).first();

    // Generate JWT token
    const token = generateJWT(
      { userId: result.id, email: result.email },
      env.JWT_SECRET
    );

    return Response.json({
      success: true,
      data: {
        user: {
          id: result.id,
          email: result.email,
          name: result.name,
          created_at: result.created_at
        },
        token
      }
    });

  } catch (error) {
    return Response.json(
      { success: false, error: 'Invalid request data' },
      { status: 400 }
    );
  }
}

export async function handleLogin(request: Request, env: any): Promise<Response> {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    // Find user
    const user = await env.DB.prepare(
      'SELECT id, email, name, password_hash, created_at FROM users WHERE email = ?'
    ).bind(email).first();

    if (!user) {
      return Response.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return Response.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateJWT(
      { userId: user.id, email: user.email },
      env.JWT_SECRET
    );

    return Response.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          created_at: user.created_at
        },
        token
      }
    });

  } catch (error) {
    return Response.json(
      { success: false, error: 'Invalid request data' },
      { status: 400 }
    );
  }
}

export async function handleLogout(request: Request, env: any): Promise<Response> {
  // For JWT, logout is handled client-side by removing the token
  // In a more complex setup, you could blacklist tokens
  return Response.json({
    success: true,
    message: 'Logged out successfully'
  });
}

export async function handleMe(request: Request, env: any): Promise<Response> {
  try {
    const payload = await authenticateRequest(request, env);
    if (!payload) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await env.DB.prepare(
      'SELECT id, email, name, created_at FROM users WHERE id = ?'
    ).bind(payload.userId).first();

    if (!user) {
      return Response.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          created_at: user.created_at
        }
      }
    });

  } catch (error) {
    return Response.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
} 