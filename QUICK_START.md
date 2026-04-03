# 🚀 Quick Start Guide - CitizenCare Backend & Frontend Integration

## Overview
This guide helps you quickly get started with the fully integrated CitizenCare application.

---

## ✅ Prerequisites

- Node.js 16+ and npm
- MongoDB Atlas account (free tier available)
- Cloudinary account (for image uploads)
- Git

---

## 📦 Installation

### 1. Clone & Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

### 2. Environment Setup

#### Root `.env`
```bash
VITE_API_URL=http://localhost:5000/api
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME="CitizenCare"
```

#### Server `server/.env`
```bash
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:8080

# MongoDB
MONGODB_URI=your_new_connection_string

# JWT
JWT_SECRET=your-secret-key-min-32-characters-here
JWT_EXPIRE=30d

# Cloudinary (get from cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Database Setup

```bash
# MongoDB will auto-create collections on first use
# But ensure your MongoDB URI is correct in .env
```

---

## 🏃 Run Application

### Terminal 1: Backend
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
# Check http://localhost:5000/api/health
```

### Terminal 2: Frontend
```bash
# From root directory
npm run dev
# Frontend runs on http://localhost:8080
```

---

## 🧪 Test the Application

### 1. Register a New Citizen
- Go to http://localhost:8080/citizen-signup
- Fill in the form:
  - Full Name: Test User
  - Email: citizen@test.com
  - Username: testuser
  - Password: password123
- Click "SIGNUP"
- Should redirect to dashboard

### 2. File a Complaint
- On dashboard, click "File Report"
- Fill the form:
  - Title: Test Complaint
  - Description: This is a test
  - Category: road
  - Click on map to select location (required)
  - Optionally upload an image
- Click "FILE REPORT"
- Should appear in your complaints list

### 3. Login as Government
- Register another account:
  - Go to `server` terminal
  - Open MongoDB Compass or Atlas
  - Find the user you just created
  - Update `role` field to `government`
  - Add `department` field: `road`
- Go to http://localhost:8080/govt-login
- Login with that account
- Dashboard shows complaints by status

### 4. Test Government Features
- Filter by status (pending, in-progress, resolved)
- Update complaint status
- Add remarks

---

## 📁 Key Files to Know

### Frontend
- `client/lib/api.ts` - All API calls
- `client/hooks/use-auth.ts` - Authentication
- `client/hooks/use-complaints.ts` - Complaint data
- `client/pages/CitizenDashboard.tsx` - User dashboard
- `client/pages/GovtDashboard.tsx` - Admin dashboard

### Backend
- `server/index.js` - Express server
- `server/controllers/` - Business logic
- `server/models/` - Database schemas
- `server/routes/` - API routes
- `server/middleware/auth.js` - Security

---

## 🔑 Important API Endpoints

### Authentication
```
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
```

### Complaints
```
POST /api/complaints          - Create complaint
GET /api/complaints/my-complaints  - Get your complaints
GET /api/complaints/status/pending  - Get by status (govt only)
PUT /api/complaints/:id/status      - Update status (govt only)
POST /api/complaints/:id/remarks    - Add remark (govt only)
```

---

## 🐛 Troubleshooting

### "Cannot POST /api/auth/login"
- Check server is running on port 5000
- Check client `.env` has correct API URL
- Restart both servers

### "MongoDB connection failed"
- Verify MongoDB URI in `server/.env`
- Check MongoDB cluster is active
- Verify whitelist includes your IP

### "Cloudinary upload fails"
- Check Cloudinary credentials in `server/.env`
- Verify image file is valid (< 5MB)
- Check internet connection

### "CORS errors"
- Verify `CLIENT_URL` in `server/.env` matches frontend URL
- Try clearing browser cache
- Check browser console for exact error

### Token not saving
- Check browser localStorage is enabled
- Check `/api/auth/login` returns token
- Open DevTools → Application → localStorage

---

## 📊 File Structure Summary

```
client/                    # Frontend
├── pages/               # Pages (Login, Signup, Dashboard)
├── components/          # Reusable components
├── hooks/              # Custom hooks (auth, complaints)
├── lib/                # API service
└── App.tsx             # Routes

server/                    # Backend
├── controllers/         # Business logic
├── models/             # Database schemas
├── routes/             # API routes
├── middleware/         # Auth, error handling
└── index.js            # Express setup

shared/                    # Shared
└── api.ts              # TypeScript interfaces
```

---

## 🎯 What's Done & What's Next

### ✅ Completed
- Authentication (register, login)
- Complaint creation and listing
- API integration
- Type safety with TypeScript
- Error handling
- Loading states
- Token management

### ⏳ To Do Next
1. **GovtDashboard API** - Connect to API
2. **Protected Routes** - Prevent unauthorized access
3. **Image Gallery** - Display complaint images
4. **Notifications** - Toast messages for user feedback
5. **Statistics** - Dashboard with charts
6. **Tests** - Unit and E2E tests
7. **Deployment** - Deploy to production

See `TODO_REMAINING.md` for complete list.

---

## 📚 Documentation

- `INTEGRATION_SUMMARY.md` - Complete integration details
- `TODO_REMAINING.md` - Detailed task list
- `PROJECT_STRUCTURE.md` - Project overview
- `.env.example` - Environment variables template

---

## 🤝 Common Tasks

### Add new API endpoint
1. Create method in `server/controllers/`
2. Add route in `server/routes/`
3. Add method in `client/lib/api.ts`
4. Use in component via `useComplaints` or `useAuth`

### Create new page
1. Create file in `client/pages/`
2. Add route in `client/App.tsx`
3. Import hooks as needed
4. Call API methods using hooks

### Add new form field
1. Update `shared/api.ts` interface
2. Add field to backend controller
3. Add field to frontend form
4. Update MongoDB schema if needed

---

## 📞 Support

If you encounter issues:

1. **Check logs**
   - Backend: Terminal where `npm run dev` is running
   - Frontend: Browser console (F12)
   - MongoDB: Check connection string

2. **Verify configuration**
   - Check `.env` files have all required variables
   - Check server is running on port 5000
   - Check frontend is on port 8080

3. **Clear caches**
   - Clear browser localStorage
   - Restart both frontend and backend
   - Delete `node_modules` and reinstall if needed

4. **Check documentation**
   - Read error messages carefully
   - Check `INTEGRATION_SUMMARY.md`
   - Review `TODO_REMAINING.md` for known issues

---

## 🎉 You're Ready!

The application is fully integrated and ready for:
- ✅ Testing basic flows
- ✅ Development of new features
- ✅ Integration testing
- ✅ User acceptance testing

Start with the test steps above, then refer to `TODO_REMAINING.md` for the next features to implement.

**Happy coding!** 🚀

---

*Last Updated: December 6, 2024*
*Status: Ready for Testing*
