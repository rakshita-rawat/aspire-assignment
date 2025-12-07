# GitHub Repository Tracker

A full-stack web application for tracking GitHub repositories and their latest releases. Built with React, TypeScript, GraphQL, Node.js, and PostgreSQL.

## Features

- ✅ **Track Repositories**: Add GitHub repositories by URL to track their updates
- ✅ **Latest Release Information**: View the latest release version, date, and release notes
- ✅ **Seen/Unseen Status**: Mark releases as "seen" and visually identify repositories with unseen updates
- ✅ **Manual Refresh**: Refresh individual repositories or all repositories at once
- ✅ **Automatic Sync**: Periodic background updates every 24 hours
- ✅ **Responsive UI**: Modern, intuitive interface that works on desktop and mobile
- ✅ **Client-side Caching**: Optimized performance with Apollo Client caching

## Tech Stack

### Frontend

- **React 18** with TypeScript
- **Apollo Client** for GraphQL queries and mutations
- **Vite** for fast development and building
- Modern CSS with responsive design

### Backend

- **Node.js** with TypeScript
- **Apollo Server** with Fastify integration
- **PostgreSQL** for data persistence
- **Octokit** for GitHub API integration

## Project Structure

```
aspire-assignment/
├── backend/
│   ├── src/
│   │   ├── schema/          # GraphQL type definitions
│   │   ├── resolvers/        # GraphQL resolvers
│   │   ├── models/           # Database models and business logic
│   │   ├── services/         # External service integrations (GitHub API)
│   │   ├── utils/            # Utility functions (database connection)
│   │   └── index.ts          # Server entry point
│   ├── migrations/           # Database migration files
│   ├── scripts/              # Setup and utility scripts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── graphql/          # Apollo Client setup and queries
│   │   ├── types/            # TypeScript type definitions
│   │   ├── App.tsx           # Main app component
│   │   └── main.tsx          # Entry point
│   └── package.json
└── README.md
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**
- **Git**

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd aspire-assignment
```

### 2. Set Up PostgreSQL Database

Create a PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE github_tracker;

# Exit psql
\q
```

### 3. Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

4. Edit `.env` and set your configuration:

```env
PORT=4000
DATABASE_URL=postgresql://localhost:5432/github_tracker
GITHUB_TOKEN=your_github_personal_access_token
```

**Getting a GitHub Token:**

- Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
- Generate a new token with `public_repo` scope
- Copy the token and paste it in your `.env` file

5. Run database migrations:

```bash
# Using npm script (recommended)
npm run setup-db

# Or manually using psql
psql $DATABASE_URL -f migrations/001_initial_schema.sql
```

**Note**: The `setup-db` script will create the necessary tables if they don't exist.

6. Build the TypeScript code:

```bash
npm run build
```

7. Start the backend server:

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm start
```

The GraphQL server will be running at `http://localhost:4000/graphql`

### 4. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. (Optional) Create a `.env` file in the `frontend` directory if you need to customize the GraphQL URL:

```env
VITE_GRAPHQL_URL=http://localhost:4000/graphql
```

**Note**: The default GraphQL URL is `http://localhost:4000/graphql`, so this is only needed if your backend runs on a different port.

4. Start the development server:

```bash
npm run dev
```

The frontend will be running at `http://localhost:3000`

## Steps to Run the App Locally

### Quick Start Guide

1. **Ensure PostgreSQL is running**:

   ```bash
   # Check if PostgreSQL is running
   pg_isready

   # If not running, start it:
   # macOS (using Homebrew)
   brew services start postgresql

   # Linux
   sudo systemctl start postgresql
   ```

2. **Create the database**:

   ```bash
   # Connect to PostgreSQL
   psql -U postgres

   # Create database
   CREATE DATABASE github_tracker;

   # Exit
   \q
   ```

3. **Set up and start the Backend** (Terminal 1):

   ```bash
   cd backend
   npm install

   # Create .env file with your configuration
   # Required: DATABASE_URL, GITHUB_TOKEN (or USE_MOCK_DATA=true)
   # Optional: PORT (defaults to 4000)

   # Run database migrations
   npm run setup-db

   # Start the backend server
   npm run dev
   ```

   ✅ Backend will be available at `http://localhost:4000/graphql`

4. **Set up and start the Frontend** (Terminal 2):

   ```bash
   cd frontend
   npm install

   # Start the development server
   npm run dev
   ```

   ✅ Frontend will be available at `http://localhost:3000`

5. **Open your browser** and navigate to `http://localhost:3000`

### Using Mock Data (Optional)

For local development without needing a GitHub token:

1. In `backend/.env`, set:

   ```env
   USE_MOCK_DATA=true
   ```

2. The app will use predefined mock repositories (React, Next.js, Angular, Vue) instead of fetching from GitHub API.

3. This is useful for:
   - Testing UI without API rate limits
   - Development when offline
   - Rapid iteration without external dependencies

## Usage

1. **Add a Repository**:

   - Enter a GitHub repository URL (e.g., `https://github.com/facebook/react` or `facebook/react`)
   - Click "Add Repository"

2. **View Release Information**:

   - Each repository card shows the latest release version, date, and notes
   - Repositories with unseen updates are highlighted with a green border and "New Update" badge

3. **Mark as Seen**:

   - Click "Mark as Seen" on a release to indicate you've reviewed it
   - The visual indicator will disappear

4. **Refresh Data**:

   - Click the refresh button (🔄) on a repository card to manually update it
   - Click "Refresh All" to update all repositories at once

5. **Remove Repository**:
   - Click the delete button (🗑️) to stop tracking a repository

## API Documentation

### GraphQL Queries

#### Get All Repositories

```graphql
query {
  repositories {
    id
    fullName
    description
    hasUnseenUpdates
    latestRelease {
      tagName
      publishedAt
      isSeen
    }
  }
}
```

#### Get Single Repository

```graphql
query {
  repository(id: "1") {
    id
    fullName
    latestRelease {
      tagName
      body
    }
  }
}
```

### GraphQL Mutations

#### Add Repository

```graphql
mutation {
  addRepository(url: "https://github.com/facebook/react") {
    id
    fullName
  }
}
```

#### Refresh Repository

```graphql
mutation {
  refreshRepository(id: "1") {
    id
    latestRelease {
      tagName
    }
  }
}
```

#### Mark Release as Seen

```graphql
mutation {
  markReleaseAsSeen(repositoryId: "1", releaseId: "1")
}
```

## Database Schema

### Tables

- **repositories**: Stores tracked repository information
- **releases**: Stores release metadata for each repository
- **seen_status**: Tracks which releases have been marked as seen

## Development

### Backend Development

```bash
cd backend
npm run dev  # Starts server with hot reload
```

### Frontend Development

```bash
cd frontend
npm run dev  # Starts Vite dev server
```

### Building for Production

**Backend:**

```bash
cd backend
npm run build
npm start
```

**Frontend:**

```bash
cd frontend
npm run build
npm run preview  # Preview production build
```

## What's Implemented

### Core Requirements ✅

- [x] React app with TypeScript
- [x] Intuitive and responsive UI
- [x] Add repositories to track
- [x] View latest release information
- [x] Mark releases as "seen"
- [x] Visual indicators for unseen updates
- [x] GraphQL API integration
- [x] Client-side caching
- [x] Node.js backend with GraphQL
- [x] PostgreSQL database
- [x] GitHub API integration with Octokit
- [x] Periodic data synchronization (24-hour intervals)
- [x] Manual refresh functionality

### Stretch Goals (Optional) ✅

- [x] **Release Details**: Detailed release view with commit history and release notes
- [x] **Filters and Sorting**: Filter by update status, sort by name (A-Z/Z-A), date (newest/oldest), or update status
- [x] **Mobile Responsiveness**: Fully responsive design that works on mobile devices
- [x] **Mock Data Service**: Local development server with test data for rapid iteration without GitHub API
- [ ] Desktop notifications
- [ ] User authentication (GitHub OAuth)
- [ ] Webhook-based real-time updates

## Implementation Notes

### What's Implemented

#### Core Features ✅

- **Repository Tracking**: Add repositories using full GitHub URLs or short form (owner/repo)
- **Release Information**: Display latest release version, date, and release notes
- **Seen/Unseen Status**: Track which releases have been reviewed with visual indicators
- **Manual Refresh**: Individual repository refresh and "Refresh All" functionality
- **Automatic Sync**: Background refresh every 24 hours (configurable)
- **Client-side Caching**: Apollo Client with cache-and-network policy for optimal performance

#### Stretch Goals Implemented ✅

- **Release Details Modal**: Click "View Details" to see full release notes and commit history
- **Filtering**: Filter repositories by "All", "Has Updates", or "No Updates"
- **Sorting**: Sort by Name (A-Z/Z-A), Date Added (Newest/Oldest First), or Update Status
- **Mobile Responsive**: Fully functional on mobile devices with responsive breakpoints
- **Mock Data Service**: Set `USE_MOCK_DATA=true` in backend `.env` for local development without GitHub API

#### Technical Implementation

- **Type Safety**: Full TypeScript coverage with no `any` types
- **Error Handling**: Custom error classes (ValidationError, NotFoundError, ExternalServiceError, DatabaseError)
- **Structured Logging**: Centralized logger utility for consistent logging
- **Service Layer**: Clean separation of concerns with service, model, and resolver layers
- **Input Validation**: Comprehensive validation for repository URLs and IDs
- **Code Organization**: Modular component structure with individual folders for each component

## Trade-offs and Design Decisions

1. **No Authentication**: For simplicity and demo purposes, the app tracks repositories globally rather than per-user. This makes it easier to demo but would require authentication (e.g., GitHub OAuth) for production use to personalize tracked repositories.

2. **Periodic Sync (24 hours)**: Instead of webhooks, the app uses periodic polling every 24 hours to keep data fresh. This is simpler to implement and respects GitHub API rate limits, but is less real-time than webhooks. Users can manually refresh anytime.

3. **Single Latest Release**: The app focuses on the latest release per repository. While release details show commit history, full release history (all past releases) is not stored. This keeps the database schema simple and focuses on the most relevant information.

4. **Client-side Filtering/Sorting**: Filtering and sorting are done on the frontend rather than the backend. This works well for the current scale but would need backend implementation for large datasets or pagination.

5. **Mock Data Service**: Implemented an in-memory mock data service for local development. This allows rapid iteration without GitHub API calls, but the mock data is static and doesn't reflect real-time changes.

6. **Error Handling**: Custom error classes provide structured error handling, but production would benefit from more comprehensive error boundaries, retry logic, and user-friendly error messages.

7. **Database Schema**: Uses `snake_case` for database fields and `camelCase` for GraphQL/TypeScript, requiring mapping layers. This follows PostgreSQL conventions but adds some complexity.

8. **No Pagination**: All repositories are loaded at once. This works for small to medium datasets but would need pagination for production-scale applications.

## Future Improvements

If given more time, I would prioritize the following enhancements:

### High Priority

1. **User Authentication**: Implement GitHub OAuth to personalize tracked repositories per user. This would require:

   - User table in database
   - Authentication middleware
   - User-specific repository tracking
   - Session management

2. **Release History**: Store and display all releases (not just the latest) for each repository:

   - Expand database schema to track multiple releases
   - Add pagination for release history
   - UI to browse through past releases

3. **Webhooks Integration**: Replace periodic polling with GitHub webhooks for real-time updates:

   - Set up webhook endpoints
   - Handle webhook events from GitHub
   - More efficient and real-time than polling

4. **Testing**: Comprehensive test coverage:
   - Unit tests for services, models, and utilities
   - Integration tests for GraphQL resolvers
   - Frontend component tests with React Testing Library
   - E2E tests for critical user flows

### Medium Priority

5. **Notifications**: Browser/desktop notifications for new releases:

   - Browser Notification API integration
   - User preferences for notification settings
   - Notification history

6. **Backend Filtering/Sorting**: Move filtering and sorting to the backend for better scalability:

   - GraphQL query arguments for filters and sort
   - Database-level sorting and filtering
   - Support for pagination

7. **Pagination**: Implement pagination for repositories and releases:

   - Cursor-based or offset-based pagination
   - Infinite scroll or page-based navigation
   - Performance optimization for large datasets

8. **Search Functionality**: Add search to find repositories quickly:
   - Full-text search on repository names and descriptions
   - Search filters (by owner, language, etc.)
   - Search history

### Nice to Have

9. **CI/CD Pipeline**: Automated testing and deployment:

   - GitHub Actions for automated testing
   - Automated deployment to staging/production
   - Code quality checks (linting, type checking)

10. **Performance Optimizations**:

    - Database query optimization and indexing
    - GraphQL query batching
    - Image optimization and lazy loading
    - Service worker for offline support

11. **Enhanced UI/UX**:

    - Dark mode support
    - Keyboard shortcuts
    - Drag-and-drop repository reordering
    - Export tracked repositories (JSON/CSV)

12. **Analytics & Insights**:
    - Track which repositories update most frequently
    - Release frequency statistics
    - Time since last release metrics

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running: `pg_isready`
- Verify `DATABASE_URL` in `.env` is correct
- Check database exists: `psql -l | grep github_tracker`

### GitHub API Rate Limits

- If you hit rate limits, add a GitHub personal access token to `.env`
- Without a token, you're limited to 60 requests/hour
- With a token, you get 5,000 requests/hour

### Port Already in Use

- Backend default port: 4000 (change in `backend/.env`)
- Frontend default port: 3000 (change in `frontend/vite.config.ts`)

## License

This project is part of an assignment and is provided as-is.

## Contact

For questions or issues, please open an issue in the repository.
