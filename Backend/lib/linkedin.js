// import loginToLinkedIn from './login.js';
// import searchJobs from './searchJobs.js';

import { loginToLinkedIn, searchJobs } from '../constants/exports.js';

// Keep the original function for backward compatibility
export default async function linkedinBot(page, experienceLevels = ['Intern']){
    await loginToLinkedIn(page);
    await searchJobs(page, { experienceLevels });
}

// Export individual functions for direct use
export { loginToLinkedIn, searchJobs };