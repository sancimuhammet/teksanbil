# Teksanbil Stories Platform

Modern React-based blog platform with hybrid architecture combining Firebase Firestore and Express.js backend.

## Features

- 📱 **Responsive Design**: Mobile-first approach with modern UI
- 🔥 **Firebase Integration**: User authentication, comments, and likes
- 🗃️ **Hybrid Data Storage**: Firebase Firestore + Express backend
- 🔐 **Admin System**: Secure admin panel with email restrictions
- 📊 **Analytics**: Google Analytics 4 integration
- 🎨 **Modern UI**: shadcn/ui components with Tailwind CSS

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Firebase Auth
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: TanStack Query

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL=your_postgresql_database_url

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# Google Analytics
VITE_GA_MEASUREMENT_ID=your_google_analytics_measurement_id
```

## Deployment

This project is configured for deployment on Vercel:

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Admin Access

Admin panel access is restricted to specific email addresses defined in `client/src/lib/adminAuth.ts`:
- muhammetsanci10@gmail.com
- teksanbil@gmail.com

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The build process creates:
- `dist/public/` - Frontend static files
- `dist/index.js` - Backend server bundle# Teksanbil123
