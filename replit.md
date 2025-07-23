# Teksanbil Stories Platform - replit.md

## Overview

Modern React-based web application replacing the original teksanbil.com site. Built with hybrid architecture combining Firebase Firestore for new stories and Express.js backend for legacy content preservation. Firebase stories receive priority display and include interactive features (likes, comments, view tracking). Express stories provide reliable backup and preserve original content. The system seamlessly displays both story types with unified UI while maintaining all original content and enabling modern Firebase functionality for new additions.

## Recent Changes (January 23, 2025)

✓ **Hybrid Firebase System**: Firebase primary for new stories, Express for legacy content
✓ **Story Prioritization**: Firebase stories appear first in listings, Express stories as backup
✓ **Featured Story Logic**: Firebase stories take priority, Express as fallback for featured section  
✓ **Interactive Features**: Like, comment, view tracking active for Firebase stories only
✓ **Seamless Integration**: Both story types display uniformly with proper ID handling
✓ **User Preference**: New stories go to Firebase per user request for modern functionality
✓ **Production Ready**: Build system optimized with hybrid data sources

## User Preferences

Preferred communication style: Simple, everyday language.
Project Goal: Complete modernization of teksanbil.com while preserving all original content and maintaining Vercel deployment compatibility.
Recent Achievement: Successfully migrated from basic Node.js/Firebase to modern React/TypeScript stack with enhanced performance and user experience.

## System Architecture

The application follows a full-stack architecture with clear separation between client and server code:

- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Analytics**: Google Analytics 4 integration

## Key Components

### Frontend Architecture
- **Component Structure**: Modular React components using shadcn/ui
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query for API data caching and synchronization
- **Routing**: File-based routing with Wouter
- **Theme System**: Light/dark mode support with system preference detection

### Backend Architecture
- **API Structure**: RESTful endpoints for stories, categories, and newsletter management
- **Data Layer**: Drizzle ORM providing type-safe database operations
- **Storage Interface**: Abstract storage interface with in-memory implementation for development
- **Error Handling**: Centralized error handling middleware

### Database Schema
- **Stories**: Main content with metadata (title, content, author, category, tags, views, likes)
- **Categories**: Organized content classification with colors and icons
- **Newsletters**: Email subscription management
- **Users**: Basic user authentication structure (placeholder)

## Data Flow

1. **Client Requests**: React components make API calls through TanStack Query
2. **Server Processing**: Express routes handle requests and interact with storage layer
3. **Database Operations**: Drizzle ORM performs type-safe database queries
4. **Response Handling**: Data flows back through the storage interface to API responses
5. **UI Updates**: TanStack Query automatically updates UI components with fresh data

## External Dependencies

### UI and Styling
- **Radix UI**: Headless component primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

### Data Management
- **TanStack Query**: Server state management and caching
- **Drizzle ORM**: Type-safe database queries and migrations
- **Zod**: Runtime type validation

### Analytics and Monitoring
- **Google Analytics 4**: User behavior tracking and analytics
- **Custom event tracking**: Story interactions, search usage, newsletter signups

### Development Tools
- **TypeScript**: Type safety across frontend and backend
- **Vite**: Fast frontend build tool and development server
- **ESBuild**: Backend bundling for production

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite development server with HMR
- **Database**: Uses environment variable DATABASE_URL for PostgreSQL connection
- **Asset Serving**: Static assets served through Vite in development

### Production Build
- **Frontend**: Built with Vite to static assets in `dist/public`
- **Backend**: Bundled with ESBuild to `dist/index.js`
- **Database Migrations**: Managed through Drizzle Kit
- **Environment Configuration**: Requires DATABASE_URL and VITE_GA_MEASUREMENT_ID

### Key Configuration Files
- **drizzle.config.ts**: Database connection and migration settings
- **vite.config.ts**: Frontend build configuration with path aliases
- **tsconfig.json**: TypeScript configuration for monorepo structure

The application is designed as a monorepo with shared types between client and server, ensuring type safety across the full stack. The modular architecture supports easy extension for additional features like user authentication, comment systems, or content management capabilities.