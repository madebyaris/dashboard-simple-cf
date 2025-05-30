import { handleRegister, handleLogin, handleLogout, handleMe } from './handlers/auth';
import { handleGetFinance, handleCreateFinance, handleUpdateFinance, handleDeleteFinance } from './handlers/finance';

function corsHeaders(origin?: string): HeadersInit {
  const allowedOrigins = [
    'https://bb4c3758.dashboard-simple-cf.pages.dev',
    'https://d91cd1b0.dashboard-simple-cf.pages.dev',
    'https://dashboard-simple-cf.pages.dev',
    'http://localhost:3000'
  ];
  
  const allowOrigin = origin && allowedOrigins.includes(origin) ? origin : '*';
  
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'true',
  };
}

function withCORS(response: Response, origin?: string): Response {
  const headers = new Headers(response.headers);
  Object.entries(corsHeaders(origin)).forEach(([key, value]) => {
    headers.set(key, value);
  });
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    const origin = request.headers.get('Origin') || undefined;

    // Handle CORS preflight requests
    if (method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: corsHeaders(origin) });
    }

    try {
      // Authentication routes
      if (path === '/api/auth/register' && method === 'POST') {
        const response = await handleRegister(request, env);
        return withCORS(response, origin);
      }

      if (path === '/api/auth/login' && method === 'POST') {
        const response = await handleLogin(request, env);
        return withCORS(response, origin);
      }

      if (path === '/api/auth/logout' && method === 'POST') {
        const response = await handleLogout(request, env);
        return withCORS(response, origin);
      }

      if (path === '/api/auth/me' && method === 'GET') {
        const response = await handleMe(request, env);
        return withCORS(response, origin);
      }

      // Finance routes
      if (path === '/api/finance' && method === 'GET') {
        const response = await handleGetFinance(request, env);
        return withCORS(response, origin);
      }

      if (path === '/api/finance' && method === 'POST') {
        const response = await handleCreateFinance(request, env);
        return withCORS(response, origin);
      }

      if (path.startsWith('/api/finance/') && method === 'PUT') {
        const id = path.split('/')[3];
        const response = await handleUpdateFinance(request, env, id);
        return withCORS(response, origin);
      }

      if (path.startsWith('/api/finance/') && method === 'DELETE') {
        const id = path.split('/')[3];
        const response = await handleDeleteFinance(request, env, id);
        return withCORS(response, origin);
      }

      // Health check endpoint
      if (path === '/api/health' && method === 'GET') {
        const response = Response.json({
          success: true,
          message: 'API is running',
          timestamp: new Date().toISOString()
        });
        return withCORS(response, origin);
      }

      // 404 for unmatched routes
      const response = Response.json(
        { success: false, error: 'Route not found' },
        { status: 404 }
      );
      return withCORS(response, origin);

    } catch (error) {
      console.error('Worker error:', error);
      const response = Response.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      );
      return withCORS(response, origin);
    }
  },
}; 