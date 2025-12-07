# Quick Start Guide

Get the GitHub Repository Tracker up and running in 5 minutes!

## Prerequisites Check

```bash
# Check Node.js version (should be 18+)
node --version

# Check PostgreSQL (should be 12+)
psql --version
```

## Step-by-Step Setup

### 1. Database Setup (2 minutes)

```bash
# Create database
createdb github_tracker

# Or using psql
psql -U postgres -c "CREATE DATABASE github_tracker;"
```

### 2. Backend Setup (2 minutes)

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=4000
DATABASE_URL=postgresql://localhost:5432/github_tracker
GITHUB_TOKEN=your_token_here
EOF

# Setup database schema
npm run setup-db

# Start backend (in development mode)
npm run dev
```

**Note**: Get a GitHub token from https://github.com/settings/tokens (classic) with `public_repo` scope.

### 3. Frontend Setup (1 minute)

```bash
# In a new terminal
cd frontend

# Install dependencies
npm install

# Start frontend
npm run dev
```

### 4. Open the App

Open your browser to: http://localhost:3000

## First Steps

1. **Add a repository**: Try adding `facebook/react` or `vercel/next.js`
2. **View releases**: See the latest release information
3. **Mark as seen**: Click "Mark as Seen" to clear the update indicator
4. **Refresh**: Use the refresh button to get latest data

## Troubleshooting

**Backend won't start?**
- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL in `.env`
- Check port 4000 is available

**Frontend can't connect?**
- Ensure backend is running on port 4000
- Check browser console for errors

**GitHub API errors?**
- Verify GITHUB_TOKEN is set in backend/.env
- Check token has `public_repo` scope

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore the GraphQL API at http://localhost:4000/graphql
- Check out the code structure in `backend/src` and `frontend/src`

Happy tracking! 🚀

