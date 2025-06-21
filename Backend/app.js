import express from 'express';
import cors from 'cors';
import { puppeMaster } from './constants/exports.js';
import { loginToLinkedIn, searchJobs } from './constants/exports.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'LinkedIn Bot API is running' });
});

// Main endpoint to start the LinkedIn bot
app.post('/api/start-bot', async (req, res) => {
  const { email, password, jobTitle, experienceLevels, location } = req.body;

  // Validate required fields
  if (!email || !password || !jobTitle || !experienceLevels || !Array.isArray(experienceLevels) || experienceLevels.length === 0 || !location) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required and at least one experience level must be selected'
    });
  }

  try {
    console.log('Starting LinkedIn bot with provided credentials...');
    console.log('Job Title:', jobTitle);
    console.log('Experience Levels:', experienceLevels);
    console.log('Location:', location);
    
    // Initialize browser and page
    const { browser, page } = await puppeMaster('windows');

    // Create a custom linkedinBot function that uses form data
    const runLinkedinBot = async (page, credentials) => {
      try {
        // Login with form credentials
        await loginToLinkedIn(page, credentials);
        // Search jobs with form data
        await searchJobs(page, credentials);
      } catch (error) {
        throw error;
      }
    };

    // Run the LinkedIn bot with form data
    await runLinkedinBot(page, {
      email,
      password,
      jobTitle,
      experienceLevels,
      location
    });

    // Close browser after completion
    await browser.close();

    res.json({
      success: true,
      message: 'LinkedIn bot completed successfully'
    });

  } catch (error) {
    console.error('Error running LinkedIn Bot:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to run LinkedIn bot',
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`LinkedIn Bot API server running on port ${PORT}`);
});