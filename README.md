# LinkedIn Bot - Frontend & Backend

This project consists of a React frontend and Node.js backend for automating LinkedIn job applications.

## Project Structure

- `frontend/` - React application with form interface
- `Backend/` - Node.js Express server with LinkedIn automation

## Quick Start

### Option 1: Run Both Servers Together (Recommended)

1. Install all dependencies:
   ```bash
   npm run install-all
   ```

2. Start both frontend and backend servers:
   ```bash
   npm run dev
   ```

This will start:
- Backend on `http://localhost:3001`
- Frontend on `http://localhost:5173`

### Option 2: Run Servers Separately

#### Backend Setup

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file (optional - credentials can be provided via form):
   ```bash
   # Create .env.development.local file with your LinkedIn credentials
   AUTH_EMAIL=your_email@example.com
   AUTH_PASSWORD=your_password
   AUTH_JOBTITLE=Software Engineer
   AUTH_LOCATION=United States
   GLOBAL_WAIT_TIME_BETWEEN_LOCAL_EVENTS=3000
   GLOBAL_WAIT_TIME_FOR_SELECTORS=10000
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

The backend will run on `http://localhost:3001`

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

## Available Scripts

### Root Level Scripts
- `npm run install-all` - Install dependencies for all projects
- `npm run dev` - Start both frontend and backend servers
- `npm run start-backend` - Start only the backend server
- `npm run start-frontend` - Start only the frontend server
- `npm run build` - Build the frontend for production

## Usage

1. Open the frontend application in your browser
2. Fill out the form with your LinkedIn credentials and job preferences
3. Click "Submit" to start the LinkedIn automation
4. The bot will:
   - Log into LinkedIn with your credentials
   - Search for jobs based on your job title
   - Apply experience level filters
   - Apply to jobs with "Easy Apply" option
   - Handle application forms automatically

## Features

- **Form Validation**: Ensures all required fields are filled
- **Loading States**: Shows processing status during bot execution
- **Error Handling**: Displays meaningful error messages
- **Experience Level Filtering**: Applies appropriate experience level filters
- **Responsive Design**: Modern UI with Tailwind CSS

## API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/start-bot` - Start LinkedIn automation

### POST /api/start-bot

Request body:
```json
{
  "email": "your_email@example.com",
  "password": "your_password",
  "jobTitle": "Software Engineer",
  "experienceLevel": "Entry Level",
  "location": "United States"
}
```

## Security Notes

- Credentials are only stored in memory during bot execution
- No credentials are permanently stored
- Use environment variables for production deployments

## Requirements

- Node.js 16+
- npm or yarn
- Chrome browser (for Puppeteer)
- LinkedIn account 