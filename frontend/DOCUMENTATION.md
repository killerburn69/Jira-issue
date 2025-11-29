# AI-Powered Issue Tracker - Frontend Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Features](#features)
5. [Getting Started](#getting-started)
6. [Environment Variables](#environment-variables)
7. [Architecture](#architecture)
8. [Components](#components)
9. [API Client](#api-client)
10. [Authentication](#authentication)
11. [Routing](#routing)
12. [Type Definitions](#type-definitions)
13. [Development Guide](#development-guide)

---

## Project Overview

This is the frontend application for an **AI-Powered Issue Tracker** built with Next.js 16. The application provides a comprehensive project management solution with features including:

- User authentication and authorization
- Team collaboration and management
- Project and issue tracking
- AI-powered issue assistance
- Real-time notifications
- Dashboard analytics

---

## Tech Stack

### Core Framework
- **Next.js 16.0.5** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript 5** - Type safety

### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **Heroicons** - Icon library
- **Recharts 3.5.1** - Charting library

### State Management & Data Fetching
- **TanStack React Query 5.90.11** - Server state management
- **Axios 1.13.2** - HTTP client

### Forms & Validation
- **React Hook Form 7.67.0** - Form management
- **@hookform/resolvers 5.2.2** - Form validation resolvers

### Additional Libraries
- **React DnD 16.0.1** - Drag and drop functionality
- **React Hot Toast 2.6.0** - Toast notifications
- **date-fns 4.1.0** - Date manipulation utilities

---

## Project Structure

```
frontend/
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   └── auth/
│   │   │       └── google/    # Google OAuth route
│   │   ├── dashboard/         # Dashboard page
│   │   ├── login/             # Login page
│   │   ├── signup/            # Signup page
│   │   ├── forgot-password/   # Password reset request
│   │   ├── reset-password/    # Password reset form
│   │   ├── profile/           # User profile page
│   │   ├── teams/             # Teams pages
│   │   │   ├── [id]/          # Team detail page
│   │   │   └── invite/
│   │   │       └── accept/    # Team invite acceptance
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable React components
│   │   ├── Navigation.tsx     # Main navigation bar
│   │   ├── ProtectedRoute.tsx # Route protection wrapper
│   │   └── GoogleLoginButton.tsx # Google OAuth button
│   ├── lib/                   # Utility libraries
│   │   ├── api.ts             # Axios instance configuration
│   │   ├── auth.ts            # Authentication utilities
│   │   └── client-api.ts      # API client methods
│   ├── providers/             # React context providers
│   └── types/                 # TypeScript type definitions
│       └── index.ts           # All type definitions
├── package.json
├── tsconfig.json
├── next.config.ts
└── tailwind.config.js
```

---

## Features

### Authentication
- Email/password authentication
- Google OAuth integration
- Password reset functionality
- Protected routes
- Token-based session management

### Team Management
- Create and manage teams
- Invite team members via email
- Role-based access control (Owner, Admin, Member)
- Team activity tracking
- Member management (add, remove, change roles)

### Dashboard
- User profile overview
- Quick access to teams and projects
- Statistics and analytics (planned)

### Profile Management
- Update user profile
- Change password
- Account settings

---

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Backend API server running (default: `http://localhost:3001`)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3001` |

Create a `.env.local` file in the project root to override defaults:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Architecture

### Application Flow

1. **Authentication Flow:**
   - User logs in via email/password or Google OAuth
   - Token is stored in `localStorage`
   - Token is included in all subsequent API requests via Authorization header

2. **Route Protection:**
   - `ProtectedRoute` component checks for authentication token
   - Unauthenticated users are redirected to `/login`
   - Navigation component hides on auth pages

3. **API Communication:**
   - Axios instance configured in `lib/api.ts`
   - Client API methods defined in `lib/client-api.ts`
   - Automatic token injection and error handling

### State Management

- **Server State:** Managed by TanStack React Query
- **Client State:** Local React state with hooks
- **Authentication State:** Stored in `localStorage` via `lib/auth.ts`

---

## Components

### Navigation

**Location:** `src/components/Navigation.tsx`

Main navigation bar component that:
- Shows navigation links (Dashboard, Teams, Profile)
- Handles user logout
- Hides on authentication pages
- Responsive mobile menu

**Usage:**
```tsx
import Navigation from '@/components/Navigation';
// Included in root layout.tsx
```

### ProtectedRoute

**Location:** `src/components/ProtectedRoute.tsx`

Wrapper component that protects routes requiring authentication:
- Checks for authentication token
- Redirects to login if not authenticated
- Renders children only if authenticated

**Usage:**
```tsx
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
```

### GoogleLoginButton

**Location:** `src/components/GoogleLoginButton.tsx`

Button component for Google OAuth authentication.

---

## API Client

### Configuration

**Location:** `src/lib/api.ts`

Axios instance configured with:
- Base URL from environment variables
- Default timeout of 90 seconds
- Response interceptor for error handling
- Automatic redirect to login on 401 errors
- Token cleanup on unauthorized responses

### Client API Methods

**Location:** `src/lib/client-api.ts`

The `ClientAPI` class provides methods for all API interactions:

#### Authentication Methods

```typescript
login(email: string, password: string)
signup(name: string, email: string, password: string)
getProfile()
updateProfile(data: { name: string; profileImage?: string })
changePassword(data: { currentPassword: string; newPassword: string; confirmPassword: string })
deleteAccount()
forgotPassword(email: string)
resetPassword(token: string, data: { newPassword: string; confirmPassword: string })
```

#### Team Methods

```typescript
createTeam(data: { name: string })
getMyTeams()
getTeam(teamId: string)
updateTeam(teamId: string, data: { name: string })
deleteTeam(teamId: string)
inviteMember(teamId: string, data: { email: string; role?: string })
getTeamMembers(teamId: string)
kickMember(teamId: string, userId: string)
leaveTeam(teamId: string)
changeRole(teamId: string, data: { userId: string; newRole: string })
getTeamActivities(teamId: string, page?: number, limit?: number)
acceptInvite(token: string)
```

**Usage Example:**
```typescript
import { clientApi } from '@/lib/client-api';

// Login
const response = await clientApi.login(email, password);
auth.setToken(response.data.token);

// Get teams
const teams = await clientApi.getMyTeams();
```

---

## Authentication

### Token Management

**Location:** `src/lib/auth.ts`

Utilities for managing authentication tokens:

```typescript
// Save token
auth.setToken(token: string)

// Get token
auth.getToken(): string | null

// Remove token
auth.removeToken()

// Check if logged in
auth.isLoggedIn(): boolean
```

### Authentication Flow

1. User submits login form
2. API call to `/auth/login`
3. Token received and stored via `auth.setToken()`
4. Token included in all subsequent requests via Authorization header
5. On logout, token is removed via `auth.removeToken()`

### Protected Routes

All authenticated pages should wrap content in `<ProtectedRoute>`:

```tsx
export default function MyPage() {
  return (
    <ProtectedRoute>
      {/* Page content */}
    </ProtectedRoute>
  );
}
```

---

## Routing

### Public Routes

- `/` - Home/landing page
- `/login` - Login page
- `/signup` - Registration page
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset form (requires token)

### Protected Routes

- `/dashboard` - User dashboard
- `/profile` - User profile management
- `/teams` - Teams list page
- `/teams/[id]` - Individual team detail page
- `/teams/invite/accept` - Team invite acceptance page

### Route Structure

Uses Next.js 16 App Router:
- Pages are defined in `src/app/` directory
- File-based routing (e.g., `app/dashboard/page.tsx` → `/dashboard`)
- Dynamic routes with brackets (e.g., `app/teams/[id]/page.tsx`)

---

## Type Definitions

**Location:** `src/types/index.ts`

Comprehensive TypeScript interfaces for all data models:

### Core Types

- **User** - User account information
- **Team** - Team entity with members and activities
- **TeamMember** - Team membership with role
- **TeamInvite** - Team invitation
- **TeamActivity** - Team activity log entry
- **TeamRole** - Enum: OWNER, ADMIN, MEMBER

- **Project** - Project entity
- **ProjectFavorite** - Project favoriting

- **Issue** - Issue/task entity
- **Subtask** - Issue subtask
- **Label** - Issue label
- **CustomStatus** - Custom status configuration
- **IssueChangeHistory** - Issue change tracking
- **AiCache** - AI-generated content cache
- **IssueStatus** - Enum: BACKLOG, IN_PROGRESS, DONE
- **IssuePriority** - Enum: HIGH, MEDIUM, LOW

- **Comment** - Issue comment
- **Notification** - User notification
- **NotificationType** - Notification type enum
- **DashboardStats** - Dashboard statistics

### Usage

```typescript
import { User, Team, Issue, IssueStatus } from '@/types';

const user: User = {
  _id: '123',
  email: 'user@example.com',
  name: 'John Doe',
  // ...
};
```

---

## Development Guide

### Adding a New Page

1. Create a new directory in `src/app/`
2. Add `page.tsx` file
3. For protected routes, wrap content in `<ProtectedRoute>`
4. Use `clientApi` for API calls
5. Import types from `@/types`

**Example:**
```tsx
'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { clientApi } from '@/lib/client-api';

export default function NewPage() {
  return (
    <ProtectedRoute>
      <div>
        {/* Your page content */}
      </div>
    </ProtectedRoute>
  );
}
```

### Adding a New API Method

1. Add method to `ClientAPI` class in `src/lib/client-api.ts`
2. Use `this.getHeader()` for authenticated requests
3. Use `api.post/get/put/delete()` from configured axios instance

**Example:**
```typescript
newMethod = (data: SomeType) => {
  const url = `/endpoint`;
  return api.post(url, data, this.getHeader());
};
```

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow existing component patterns
- Ensure responsive design (mobile-first)
- Use consistent color scheme (indigo primary)

### Error Handling

- API errors are handled by the axios interceptor in `lib/api.ts`
- 401 errors automatically redirect to login
- Use React Hot Toast for user-facing error messages

### Best Practices

1. **Always use TypeScript types** from `@/types`
2. **Use `ProtectedRoute`** for authenticated pages
3. **Handle loading states** in async operations
4. **Use React Query** for server state management
5. **Keep components small and focused**
6. **Use 'use client'** directive for client components
7. **Handle errors gracefully** with try-catch blocks

---

## API Integration

### Base URL

The API base URL is configured via `NEXT_PUBLIC_API_URL` environment variable. Default: `http://localhost:3001`

### Request Format

All authenticated requests include:
```
Authorization: Bearer <token>
```

### Response Format

API responses are wrapped and processed by the axios interceptor:
- Success responses: `response.data`
- Error responses: Handled by interceptor (401 → redirect to login)

### Example API Call

```typescript
import { clientApi } from '@/lib/client-api';
import { auth } from '@/lib/auth';

try {
  const response = await clientApi.getProfile();
  console.log(response.data);
} catch (error) {
  console.error('Failed to fetch profile:', error);
}
```

---

## Troubleshooting

### Common Issues

1. **401 Unauthorized errors:**
   - Check if token exists: `localStorage.getItem('token')`
   - Verify token format in Authorization header
   - Ensure backend API is running

2. **CORS errors:**
   - Verify `NEXT_PUBLIC_API_URL` is correct
   - Check backend CORS configuration
   - Ensure credentials are included in requests

3. **Build errors:**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run lint`

4. **Navigation not showing:**
   - Check if current route is in excluded list (login, signup, etc.)
   - Verify Navigation component is in layout.tsx

---

## Future Enhancements

Planned features and improvements:

- [ ] Project management pages
- [ ] Issue board with drag-and-drop
- [ ] AI-powered issue suggestions
- [ ] Real-time notifications
- [ ] Advanced dashboard analytics
- [ ] Dark mode support
- [ ] Internationalization (i18n)
- [ ] Unit and integration tests
- [ ] E2E testing with Playwright/Cypress

---

## Contributing

1. Follow existing code style and patterns
2. Use TypeScript for all new code
3. Add proper error handling
4. Update this documentation for new features
5. Test thoroughly before submitting

---

## License

[Add your license information here]

---

## Support

For issues or questions:
- Check existing documentation
- Review code comments
- Open an issue in the repository

---

**Last Updated:** [Current Date]
**Version:** 0.1.0

