# TravelLoop - Quick Reference Guide

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- npm or yarn

### Quick Setup (5 minutes)

1. Install dependencies: `npm install`
2. Update `.env.local` with your MongoDB URI
3. Run dev server: `npm run dev`
4. Visit `http://localhost:3000`

## 📍 Main Routes

### Public Routes

- `/` - Landing page
- `/auth/signup` - Sign up page
- `/auth/login` - Login page

### Protected Routes (Dashboard)

- `/dashboard` - Main dashboard
- `/dashboard/trips` - View all trips
- `/dashboard/trips/new` - Create new trip
- `/dashboard/trips/[id]` - Trip details
- `/dashboard/itinerary` - Itinerary builder
- `/dashboard/budget` - Budget planner
- `/dashboard/checklist` - Packing checklist
- `/dashboard/notes` - Travel journal
- `/dashboard/settings` - Account settings

### Admin Routes

- `/admin` - Admin dashboard

## 🔗 API Endpoints

### Authentication

```
POST   /api/auth/signup          - Create account
POST   /api/auth/login           - Login
POST   /api/auth/logout          - Logout
GET    /api/auth/me              - Get current user
```

### Trips

```
GET    /api/trips                - Get all trips
POST   /api/trips                - Create trip
GET    /api/trips/[id]           - Get trip details
PUT    /api/trips/[id]           - Update trip
DELETE /api/trips/[id]           - Delete trip
POST   /api/trips/[id]/share     - Generate share link
```

### Activities

```
GET    /api/activities           - Get activities
POST   /api/activities           - Create activity
GET    /api/activities/[id]      - Get activity details
GET    /api/activities/search    - Search activities
```

## 📦 Project Structure Summary

```
src/
├── app/              - Pages and API routes
├── components/       - React components (UI + Layout)
├── hooks/            - Custom hooks
├── lib/              - Database and utilities
├── models/           - Mongoose models
├── services/         - External API services
├── store/            - Zustand state management
├── types/            - TypeScript definitions
└── utils/            - Helper functions
```

## 🎯 Key Features

| Feature             | Status      | Location                           |
| ------------------- | ----------- | ---------------------------------- |
| User Auth           | ✅ Complete | `/src/app/api/auth/`               |
| Trip CRUD           | ✅ Complete | `/src/app/api/trips/`              |
| Dashboard           | ✅ Complete | `/src/app/dashboard/`              |
| Budget Tracking     | ✅ Complete | `/src/app/dashboard/budget/`       |
| Itinerary Builder   | ✅ Complete | `/src/app/dashboard/itinerary/`    |
| Checklist           | ✅ Complete | `/src/app/dashboard/checklist/`    |
| Journal/Notes       | ✅ Complete | `/src/app/dashboard/notes/`        |
| Admin Panel         | ✅ Complete | `/src/app/admin/`                  |
| Analytics           | ✅ Complete | `/src/app/admin/`                  |
| City Search         | ✅ Ready    | `/src/services/cityService.ts`     |
| Activity Management | ✅ Ready    | `/src/services/activityService.ts` |
| Trip Sharing        | ✅ Ready    | `/src/services/sharingService.ts`  |

## 🔧 Configuration Files

### `.env.local` Variables

```env
MONGODB_URI              - MongoDB connection string
JWT_SECRET               - JWT signing key
NEXT_PUBLIC_APP_URL      - Base URL
CLOUDINARY_*             - Image upload credentials
GEODB_API_KEY            - City search API
GOOGLE_PLACES_API_KEY    - Alternative city search
```

### Database Models

- **User**: name, email, password, image, timestamps
- **Trip**: title, description, dates, coverImage, userId, budget, activities
- **Activity**: title, image, category, price, duration, description
- **ChecklistItem**: text, category, isCompleted, tripId
- **Note**: tripId, date, title, content, timestamps

## 🎨 UI Components (shadcn/ui)

- Button
- Card
- Input
- Textarea
- Dialog
- Dropdown Menu
- Calendar
- Tabs
- Form (ready to add)

## 📊 Charts & Visualization

- Pie charts (budget distribution)
- Bar charts (daily expenses)
- Line charts (user growth)
- Progress bars (checklist, budget)

## 🔒 Security Features

- ✅ JWT authentication
- ✅ Password hashing (bcryptjs)
- ✅ HTTP-only cookies
- ✅ Input validation (Zod)
- ✅ CORS ready
- ✅ Environment variables for secrets

## 🚀 Deployment Ready

- ✅ Vercel deployment configured
- ✅ Docker support ready
- ✅ Environment variable setup
- ✅ Database connection pooling
- ✅ Production logging

## 📝 Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type check
npx tsc --noEmit
```

## 🐛 Common Tasks

### Add a new page

1. Create file in `/src/app/dashboard/[feature]/`
2. Export default component
3. Update Sidebar navigation links

### Add a new API endpoint

1. Create route in `/src/app/api/[resource]/`
2. Verify database connection
3. Add error handling
4. Test with Postman

### Connect to external API

1. Create service in `/src/services/`
2. Add API keys to `.env.local`
3. Implement error handling
4. Use service in components

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [MongoDB Docs](https://docs.mongodb.com)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)

## ❓ FAQ

**Q: How do I add authentication to a new page?**
A: Use the `useAuth` hook in your component to check authentication status.

**Q: How do I fetch data from the API?**
A: Use the `api` helper from `src/utils/helpers.ts` or fetch directly.

**Q: How do I add a new form?**
A: Use React Hook Form with Zod validation and shadcn/ui components.

**Q: How do I deploy?**
A: Push to GitHub, connect to Vercel, set environment variables, deploy.

## 🎉 Success!

Your TravelLoop application is ready to use. Start the dev server and explore all features!
