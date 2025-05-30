# 🚀 Dashboard Template - Cloudflare Full Stack

A **production-ready template** for building dashboard applications with React, TypeScript, and Cloudflare infrastructure. Features authentication, CRUD operations, and a modern UI - ready to deploy in minutes!

## ✨ Features

- 🔐 **JWT Authentication** with invitation code system
- 💰 **Finance CRUD** - Income/expense tracking with categories
- 📊 **Dashboard UI** - Clean sidebar layout with summary cards
- 🎨 **Modern Design** - Tailwind CSS with responsive components
- ⚡ **Edge Deployment** - Cloudflare Pages + Workers + D1
- 🔒 **Secure** - Password hashing, CORS protection, input validation
- 📱 **Mobile Ready** - Responsive design for all devices

## 🏗️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Router
- **Backend:** Cloudflare Workers, TypeScript, Zod validation
- **Database:** Cloudflare D1 (SQLite)
- **Authentication:** JWT tokens with bcrypt password hashing
- **Deployment:** Cloudflare Pages + Workers (edge computing)

## 🚀 Quick Start

### 1. Clone and Setup
```bash
git clone <your-repo-url> my-dashboard
cd my-dashboard
```

### 2. Configure Wrangler Files
```bash
# Copy template configurations
cp backend/wrangler.toml.template backend/wrangler.toml
cp frontend/wrangler.toml.template frontend/wrangler.toml
```

### 3. Update Configuration
Edit the `wrangler.toml` files with your values:

**Backend (`backend/wrangler.toml`):**
- Replace `your-dashboard-backend` with your project name
- Replace `your-database-name` with your D1 database name
- Replace `your-d1-database-id-here` with your D1 database ID

**Frontend (`frontend/wrangler.toml`):**
- Replace `your-dashboard-frontend` with your project name
- Replace `your-backend-worker-url` with your deployed Worker URL

### 4. Install Dependencies
```bash
# Backend dependencies
cd backend && npm install

# Frontend dependencies
cd ../frontend && npm install
```

### 5. Create D1 Database
```bash
# Create database
npx wrangler d1 create your-database-name

# Apply schema
cd backend
npx wrangler d1 execute your-database-name --remote --file=../database/schema.sql
```

### 6. Deploy
```bash
# Deploy backend first
cd backend
npx wrangler secret put JWT_SECRET  # Enter a secure secret
npm run deploy

# Deploy frontend
cd ../frontend
npm run build
npx wrangler pages deploy dist --project-name=your-dashboard-frontend
```

## 🎯 Live Demo Features

Once deployed, your dashboard includes:

- **Registration** with invitation code (`akuteman` by default)
- **Login/Logout** with JWT authentication
- **Dashboard** with financial summary cards
- **Finance Management** - Add, edit, delete income/expense records
- **Categories** - Organize transactions by type
- **Responsive Design** - Works on desktop and mobile

## 📁 Project Structure

```
dashboard-template/
├── frontend/                 # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React contexts (Auth)
│   │   ├── lib/            # API utilities
│   │   ├── pages/          # Route components
│   │   └── types/          # TypeScript definitions
│   ├── package.json
│   └── wrangler.toml.template
├── backend/                  # Cloudflare Workers
│   ├── src/
│   │   ├── handlers/       # API route handlers
│   │   ├── utils/          # Auth utilities
│   │   └── types.ts        # TypeScript definitions
│   ├── package.json
│   └── wrangler.toml.template
├── database/
│   └── schema.sql          # Database schema
└── docs/                   # Setup guides
```

## 🔧 Configuration

### Environment Variables

**Backend:**
- `JWT_SECRET` - Secret for JWT token signing (set via `wrangler secret put`)
- `BCRYPT_ROUNDS` - Password hashing rounds (default: 10)

**Frontend:**
- `VITE_API_URL` - Backend API URL (set in wrangler.toml)

### Invitation Code

Default invitation code is `akuteman`. To change it:
1. Edit `backend/src/handlers/auth.ts`
2. Update the validation in `handleRegister` function
3. Redeploy backend

## 📚 Documentation

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- **[INVITATION_CODE.md](./INVITATION_CODE.md)** - Invitation system details
- **[PRD.md](./PRD.md)** - Original product requirements
- **[SUCCESS.md](./SUCCESS.md)** - Troubleshooting guide

## 🛠️ Development

### Local Development
```bash
# Start backend (terminal 1)
cd backend && npm run dev

# Start frontend (terminal 2)  
cd frontend && npm run dev
```

### Database Commands
```bash
# View tables
npx wrangler d1 execute your-db --remote --command="SELECT name FROM sqlite_master WHERE type='table';"

# Check users
npx wrangler d1 execute your-db --remote --command="SELECT * FROM users;"

# Reset database
npx wrangler d1 execute your-db --remote --file=../database/schema.sql
```

## 🔒 Security Features

- ✅ **Password Hashing** - bcrypt with configurable rounds
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **CORS Protection** - Configured for your domains
- ✅ **Input Validation** - Zod schema validation
- ✅ **Invitation System** - Controlled user registration
- ✅ **SQL Injection Protection** - Prepared statements

## 🌟 Customization

This template is designed to be easily customizable:

1. **Styling** - Update Tailwind classes in components
2. **Features** - Add new CRUD modules following the finance pattern
3. **Authentication** - Modify invitation system or add OAuth
4. **Database** - Extend schema for new data types
5. **UI** - Replace components with your preferred design system

## 📄 License

MIT License - feel free to use this template for personal or commercial projects.

## 🤝 Contributing

Contributions welcome! Please feel free to submit issues and pull requests.

---

**Ready to build your next dashboard?** 🚀

This template provides everything you need for a modern, secure, and scalable dashboard application on Cloudflare's edge infrastructure. 