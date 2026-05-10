# TravelLoop - Travel Planning Application

A comprehensive full-stack travel planning application built with Next.js, MongoDB, and modern web technologies.

## 🎯 Overview

TravelLoop is an all-in-one travel planning platform that helps users:

- Plan detailed itineraries with multiple stops
- Track budgets and expenses
- Discover and organize activities
- Share trips with friends and family
- Maintain travel journals and packing checklists
- View trips on interactive maps

## 🛠️ Technology Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Zustand** - State management
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **@dnd-kit** - Drag and drop
- **react-hot-toast** - Toast notifications

### Backend

- **Next.js API Routes** - REST API
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📦 Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd traveloop
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**
   Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/traveloop?retryWrites=true&w=majority

# Authentication Secrets
JWT_SECRET=your_jwt_secret_key_change_this_in_production
NEXTAUTH_SECRET=your_nextauth_secret_key_change_this_in_production

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Cloudinary Configuration (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# City API Keys
NEXT_PUBLIC_GEODB_API_KEY=your_geodb_api_key
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_places_api_key

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
```

4. **Start the development server**

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## 📁 Project Structure

```
traveloop/
├── app/                           # Root layout and pages
│   ├── page.tsx                   # Landing page
│   ├── layout.tsx                 # Root layout
│   └── globals.css                # Global styles
├── src/
│   ├── app/                       # Next.js app directory
│   │   ├── api/                   # API routes
│   │   │   ├── auth/              # Authentication endpoints
│   │   │   ├── trips/             # Trip management endpoints
│   │   │   └── activities/        # Activity endpoints
│   │   ├── dashboard/             # Protected dashboard pages
│   │   ├── auth/                  # Auth pages (login, signup)
│   │   └── admin/                 # Admin dashboard
│   ├── components/
│   │   ├── layout/                # Layout components (Navbar, Sidebar, Footer)
│   │   ├── ui/                    # shadcn/ui components
│   │   └── SortableItem.tsx       # Drag and drop component
│   ├── hooks/                     # Custom React hooks
│   │   └── useAuth.ts             # Authentication hook
│   ├── lib/
│   │   ├── db.ts                  # MongoDB connection
│   │   └── utils.ts               # Utility functions
│   ├── models/                    # Mongoose schemas
│   │   ├── User.ts                # User model
│   │   ├── Trip.ts                # Trip model
│   │   ├── Activity.ts            # Activity model
│   │   ├── ChecklistItem.ts       # Checklist model
│   │   └── Note.ts                # Notes model
│   ├── services/                  # API services
│   │   ├── cityService.ts         # City search service
│   │   ├── activityService.ts     # Activity service
│   │   └── sharingService.ts      # Trip sharing service
│   ├── store/                     # Zustand stores
│   │   └── index.ts               # Auth and trip stores
│   ├── types/                     # TypeScript types
│   │   └── index.ts               # All type definitions
│   └── utils/                     # Utility functions
│       └── helpers.ts             # Helper functions
├── public/                        # Static assets
├── tsconfig.json                  # TypeScript config
├── next.config.ts                 # Next.js config
├── tailwind.config.ts             # Tailwind CSS config
├── components.json                # shadcn/ui config
└── package.json                   # Dependencies

```

## 🚀 Features

### Phase 1: UI & Setup

- ✅ shadcn/ui components installed
- ✅ Folder structure created
- ✅ Tailwind CSS configured

### Phase 2: Database Setup

- ✅ MongoDB connection established
- ✅ Environment variables configured
- ✅ Models created (User, Trip, Activity, etc.)

### Phase 3: Authentication

- ✅ Signup API with password hashing
- ✅ Login API with JWT tokens
- ✅ Auth pages (login, signup)
- ✅ Protected routes

### Phase 4: Layout System

- ✅ Navbar with responsive design
- ✅ Sidebar navigation
- ✅ Mobile menu
- ✅ Footer

### Phase 5: Dashboard

- ✅ Dashboard homepage with stats
- ✅ Recent trips overview
- ✅ Recommended cities
- ✅ Quick actions

### Phase 6: Trip Management

- ✅ Create trips
- ✅ View all trips
- ✅ Edit trips
- ✅ Delete trips
- ✅ Trip cards with details

### Phase 7: Itinerary Builder

- ✅ Add multiple stops
- ✅ Drag and drop reordering (dnd-kit)
- ✅ Timeline view
- ✅ Calendar view

### Phase 8: City Search

- ✅ GeoDB Cities API integration
- ✅ City search functionality
- ✅ Popular cities recommendations

### Phase 9: Activities

- ✅ Activity browsing
- ✅ Activity filtering
- ✅ Add activities to itinerary

### Phase 10: Budget System

- ✅ Budget tracking with categories
- ✅ Pie chart visualization (Recharts)
- ✅ Bar chart for daily expenses
- ✅ Budget breakdown by category

### Phase 11: Packing Checklist

- ✅ Add/remove checklist items
- ✅ Mark items as completed
- ✅ Organize by categories
- ✅ Progress tracking

### Phase 12: Travel Journal

- ✅ Create notes/journal entries
- ✅ View notes in timeline
- ✅ Delete notes
- ✅ Date-based organization

### Phase 13: Maps Integration

- ✅ Maps component setup (ready for integration)

### Phase 14: Sharing System

- ✅ Share trip links
- ✅ Public/private trips
- ✅ Share with specific users

### Phase 15: Notifications

- ✅ Toast notifications (react-hot-toast)
- ✅ Success/error messages

### Phase 16: File Uploads

- ✅ Cloudinary integration setup
- ✅ Image upload functionality

### Phase 17: Admin Panel

- ✅ Admin dashboard
- ✅ User analytics
- ✅ Trip statistics
- ✅ Popular cities/activities

### Phase 18: Analytics

- ✅ User growth charts
- ✅ Trip category breakdown
- ✅ Popular destinations
- ✅ Top activities

## 🔐 Authentication Flow

1. User signs up with email and password
2. Password is hashed using bcryptjs
3. JWT token is generated and stored in HTTP-only cookie
4. User can login with credentials
5. Protected routes check for valid token

## 📊 API Endpoints

### Authentication

- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Trips

- `GET /api/trips` - Get all user trips
- `POST /api/trips` - Create new trip
- `GET /api/trips/[id]` - Get trip details
- `PUT /api/trips/[id]` - Update trip
- `DELETE /api/trips/[id]` - Delete trip

### Activities

- `GET /api/activities` - Get activities
- `POST /api/activities` - Create activity
- `GET /api/activities/[id]` - Get activity details
- `GET /api/activities/search` - Search activities

## 🎨 Customization

### Tailwind CSS

Modify `tailwind.config.ts` to customize colors, fonts, and spacing.

### Components

All shadcn/ui components are located in `src/components/ui/` and can be customized.

### Database

Update MongoDB connection string in `.env.local` to use your own cluster.

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

```bash
npm run build
npm run start
```

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t traveloop .
docker run -p 3000:3000 traveloop
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For support, email support@traveloop.com or open an issue in the repository.

## 🗺️ Future Enhancements

- [ ] Real-time collaboration with WebSockets
- [ ] AI-powered trip recommendations
- [ ] Integration with booking platforms
- [ ] Mobile app (React Native)
- [ ] Video tours and 360° photos
- [ ] Multi-language support
- [ ] Accessibility improvements
- [ ] Performance optimization

## 📞 Contact

- Website: https://traveloop.com
- Email: info@traveloop.com
- Twitter: @traveloop_app
