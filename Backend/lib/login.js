// import { LOGIN_URL } from '../constants/urls.js';
// import { buttonClasses } from '../constants/buttons.js';
// import gotoUrls from '../config/gotoUrls.js';
// import { AUTH_EMAIL, AUTH_PASSWORD, GLOBAL_WAIT_TIME_BETWEEN_LOCAL_EVENTS, GLOBAL_WAIT_TIME_FOR_SELECTORS } from '../config/env.js';

import { 
  LOGIN_URL, 
  buttonClasses, 
  gotoUrls, 
  GLOBAL_WAIT_TIME_BETWEEN_LOCAL_EVENTS, 
  GLOBAL_WAIT_TIME_FOR_SELECTORS 
} from '../constants/exports.js';

export default async function loginToLinkedIn(page, credentials = {}) {
  const { email, password } = credentials;
  
  // Use environment variables as fallback if credentials not provided
  const authEmail = email || process.env.AUTH_EMAIL;
  const authPassword = password || process.env.AUTH_PASSWORD;
  
  if (!authEmail || !authPassword) {
    throw new Error('Email and password are required for login');
  }

  try {
    console.log('Navigating to LinkedIn login page...');

    //Handle URL
    await gotoUrls(page, LOGIN_URL);

    //auth
    console.log('Logging in with email:', authEmail);
    await page.waitForSelector('#username', { timeout: GLOBAL_WAIT_TIME_FOR_SELECTORS });

    await page.type('#username', authEmail);
    await new Promise(r => setTimeout(r, GLOBAL_WAIT_TIME_BETWEEN_LOCAL_EVENTS));

    await page.type('#password', authPassword);
    await new Promise(r => setTimeout(r, GLOBAL_WAIT_TIME_BETWEEN_LOCAL_EVENTS));

    await Promise.all([
      page.click(buttonClasses.login),
      page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: GLOBAL_WAIT_TIME_FOR_SELECTORS }),
    ]);

    console.log('Logged in successfully');
    
  } catch (error) {
    throw new Error('Failed to log in to LinkedIn: ' + error.message);
  }
};