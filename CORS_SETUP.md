# CORS Configuration Guide

## Environment Variables Setup

### 1. Cloudflare Workers Dashboard

To configure CORS allowed origins in the Cloudflare dashboard:

1. Go to **Workers & Pages** → **dashboard-simple-cf-backend**
2. Click on **Settings** tab
3. Go to **Variables and Secrets** section
4. Click **Add** to add a new environment variable

### 2. Required Environment Variables

Add the following environment variable:

**Variable Name:** `ALLOWED_ORIGINS`

**Variable Value:** 
```
https://dashboard-simple-cf.pages.dev,https://536e8234.dashboard-simple-cf.pages.dev,https://76ca9589.dashboard-simple-cf.pages.dev,http://localhost:3000,http://localhost:3001
```

### 3. Format

- **Comma-separated list** of allowed origins
- **No spaces** around commas
- Include **protocol** (https:// or http://)
- Include **port numbers** for localhost

### 4. Example Values

**Production:**
```
https://your-app.pages.dev,https://custom-domain.com
```

**Development:**
```
http://localhost:3000,http://localhost:3001,http://localhost:5173
```

**Combined:**
```
https://your-app.pages.dev,https://custom-domain.com,http://localhost:3000,http://localhost:3001
```

### 5. Deployment

After adding the environment variable:
1. **Save** the changes in Cloudflare dashboard
2. **Redeploy** your Worker using `npm run deploy`
3. The new CORS settings will take effect immediately

### 6. Testing CORS

Test CORS preflight request:
```bash
curl -X OPTIONS https://your-worker.workers.dev/api/auth/login \
  -H "Origin: https://your-frontend.pages.dev" \
  -v
```

Should return:
- `access-control-allow-origin: https://your-frontend.pages.dev`
- `access-control-allow-methods: GET, POST, PUT, DELETE, OPTIONS`
- `access-control-allow-headers: Content-Type, Authorization`

### 7. Troubleshooting

**Common Issues:**
- **405 Method Not Allowed**: Check if OPTIONS requests are handled
- **CORS Error**: Verify origin is in ALLOWED_ORIGINS list
- **Wildcard Issues**: Use specific origins instead of `*` for credentials

**Debug Steps:**
1. Check environment variable is set correctly
2. Verify origin matches exactly (including protocol/port)
3. Test with curl to isolate browser vs server issues
4. Check Worker logs in Cloudflare dashboard 