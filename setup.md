# Simple Dashboard Setup Guide

## 🚀 Quick Start

This dashboard application is built with React (frontend), Cloudflare Workers (backend), and includes a complete finance CRUD system with authentication.

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Cloudflare account (for deployment)

## 🛠️ Installation

### 1. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install
```

### 2. Environment Setup

#### Backend Configuration
Update `backend/wrangler.toml`:
- Replace `your-jwt-secret-here-change-in-production` with a secure JWT secret
- Add your D1 database IDs when ready to deploy

#### Frontend Configuration
Create `frontend/.env` (optional):
```env
VITE_API_URL=http://localhost:8787/api
```

## 🏃‍♂️ Development

### Start Backend (Cloudflare Workers)
```bash
cd backend
npm run dev
```
This starts the API on `http://localhost:8787`

### Start Frontend (React)
```bash
cd frontend  
npm run dev
```
This starts the frontend on `http://localhost:3000`

## 🗄️ Database Setup

### Local Development (SQLite)
The app will use a local SQLite database automatically.

### Production (Cloudflare D1)
1. Create D1 database:
```bash
npx wrangler d1 create dashboard-db
```

2. Update database IDs in `wrangler.toml`

3. Run migrations:
```bash
npm run db:migrate
```

## 🎯 Features

### ✅ Completed Features
- **Authentication System**
  - User registration with email/password
  - JWT-based authentication
  - Secure login/logout
  - Protected routes

- **Dashboard Interface**
  - Sidebar navigation
  - Responsive design with Tailwind CSS
  - User profile display
  - Welcome dashboard with stats

- **Finance CRUD System**
  - Add income/expense records
  - Edit and delete transactions
  - Category-based organization
  - Financial summary (income, expenses, balance)
  - Data visualization with cards
  - Responsive table with actions

- **UI Components**
  - Reusable Button component
  - Form inputs and labels
  - Loading states
  - Error handling
  - Modal forms

### 🛠️ Technical Stack
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Router
- **Backend:** Cloudflare Workers, D1/SQLite, JWT auth, bcrypt
- **Icons:** Lucide React
- **Styling:** Tailwind CSS with custom components

## 🚦 Development Workflow

1. **Start both servers**:
   - Backend: `cd backend && npm run dev`
   - Frontend: `cd frontend && npm run dev`

2. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8787

3. **Test the features**:
   - Register a new account
   - Login to the dashboard
   - Add income/expense records
   - View financial summary

## 📦 Deployment

### Frontend (Cloudflare Pages)
```bash
cd frontend
npm run build
# Deploy to Cloudflare Pages
```

### Backend (Cloudflare Workers)
```bash
cd backend
npm run deploy
```

## 🐛 Troubleshooting

### Common Issues

1. **Module not found errors**:
   - Run `npm install` in both directories
   - Check TypeScript configuration

2. **API connection issues**:
   - Ensure backend is running on port 8787
   - Check CORS configuration
   - Verify proxy settings in vite.config.ts

3. **Database issues**:
   - Check schema.sql is applied
   - Verify D1 configuration in wrangler.toml

## 📝 Next Steps

### Phase 2 Enhancements (Future)
- [ ] Password reset functionality
- [ ] Email verification
- [ ] Advanced data visualization (charts)
- [ ] Data export functionality
- [ ] Role-based access control
- [ ] Dark/light theme toggle
- [ ] Progressive Web App features

## 📖 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user  
- `GET /api/auth/me` - Get current user

### Finance
- `GET /api/finance` - Get finance records
- `POST /api/finance` - Create finance record
- `PUT /api/finance/:id` - Update finance record
- `DELETE /api/finance/:id` - Delete finance record

### Health
- `GET /api/health` - API health check

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- CORS configuration
- SQL injection prevention
- Rate limiting ready

---

**The dashboard is now ready for development and testing!** 🎉 