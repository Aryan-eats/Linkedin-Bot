import {
  gotoUrls,
  handleJobSearchQuery,
  getTextFromSelector,
  beforeClickOnEasyApply,
  afterClickOnEasyApply,
  buttonClick,
  AUTH_JOBTITLE,
  JOBS_URL,
  buttonClasses,
  bypass,
  GLOBAL_WAIT_TIME_BETWEEN_LOCAL_EVENTS
} from '../constants/exports.js';

const searchJobs = async (page, credentials = {}) => {
  const { jobTitle, experienceLevels, location } = credentials;
  
  // Use environment variables as fallback if credentials not provided
  const searchJobTitle = jobTitle || process.env.AUTH_JOBTITLE;
  const searchExperienceLevels = experienceLevels || ['Intern'];
  const searchLocation = location || process.env.AUTH_LOCATION;
  
  if (!searchJobTitle) {
    throw new Error('Job title is required for job search');
  }

  try {
    console.log(`Searching for jobs with the title: ${searchJobTitle}...`);
    console.log(`Experience levels: ${searchExperienceLevels.join(', ')}`);
    
    //Handle URL
    await gotoUrls(page, JOBS_URL);

    //Bypass
    let isBypassRequired = false;
    try{
      let bypassTitle = await getTextFromSelector(page, '#main-content section div h1', 3000);
      if(bypassTitle?.trim() === 'Millions of jobs and people hiring'){
        isBypassRequired = true;
      }
    } catch(error){
      console.log('Failed to check if bypass is required: Maybe class not found' + error.message);
    }

    console.log('Bypass required: ' + isBypassRequired);
    if(isBypassRequired){
      //Bypass
      await bypass(page);
    }

    //Query for job search
    await handleJobSearchQuery(page, searchJobTitle, '.jobs-search-box__text-input', searchLocation);

    //Get total number of jobs
    let totalJobs = await getTextFromSelector(page, '.jobs-search-results-list__subtitle span');
    totalJobs = parseInt(totalJobs.split(' ')[0].replace(/,/g, ''), 10);
    console.log(`Total jobs found: ${totalJobs}`);

    //Filters or before clicking on easy apply - apply multiple experience levels
    await beforeClickOnEasyApply(page, searchExperienceLevels);

    // Loop through all jobs
    for(let i = 0; i < totalJobs; i++) {
      try {
        console.log(`Processing job ${i + 1} of ${totalJobs}`);
        
        // Wait for job cards to be visible
        await page.waitForSelector('.job-card-container', { timeout: 5000 });
        
        // Get all job cards
        const jobCards = await page.$$('.job-card-container');
        if (!jobCards[i]) {
          console.log(`Job card ${i + 1} not found, skipping...`);
          continue;
        }

        // Scroll to the job card
        await page.evaluate((index) => {
          const jobCards = document.querySelectorAll('.job-card-container');
          if (jobCards[index]) {
            jobCards[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, i);

        // Wait for scroll to complete
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Click on the job card to load details
        await jobCards[i].click();
        console.log('Clicked on job card');

        // Wait for job details to load
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Check if already applied
        let alreadyAppliedStatus = false;
        try {
          let alreadyApplied = await getTextFromSelector(page, '.artdeco-inline-feedback__message', 3000);
          alreadyAppliedStatus = alreadyApplied?.trim().split(' ')[0] === 'Applied';
        } catch(error) {
          console.log('Failed to check if already applied, Maybe class not found. ' + error.message);
        }
        
        if(alreadyAppliedStatus) {
          console.log('Already applied to this job, skipping...');
          continue;
        }

        // Look for Easy Apply button
        const easyApplyButton = await page.$('button.jobs-apply-button');
        if (!easyApplyButton) {
          console.log('Easy Apply button not found, skipping...');
          continue;
        }

        // Click on easy apply
        await easyApplyButton.click();
        console.log('Clicked on easy apply');

        // Wait for application form to load
        await new Promise(resolve => setTimeout(resolve, 2000));

        //Form after clicking on easy apply
        await afterClickOnEasyApply(page);

        console.log("Out of questions block");
        
        //Click on submit
        await buttonClick(page, buttonClasses.primary);
        console.log("Application submitted");

        //Click on done
        console.log("Clicking on done");
        try {
          await buttonClick(page, buttonClasses.primary);
          console.log("Clicked on done");
        } catch(error) {
          console.log('Failed to click on done button: ' + error.message);
        }

        //removing from the list
        console.log('Applied to this job, removing it');
        try {
          buttonClick(page, '.job-card-list__actions-container button span svg use');
          console.log("Removed");
        } catch(error) {
          console.log('Failed to remove from the list after apply: ' + error.message);
        }

        // Wait between applications to avoid rate limiting
        console.log(`Waiting ${GLOBAL_WAIT_TIME_BETWEEN_LOCAL_EVENTS/1000} seconds before next application...`);
        await new Promise(resolve => setTimeout(resolve, GLOBAL_WAIT_TIME_BETWEEN_LOCAL_EVENTS));

      } catch (error) {
        console.log(`Error processing job ${i + 1}: ${error.message}`);
        // Continue with next job even if this one failed
        continue;
      }
    }

    console.log('Finished processing all jobs');

  } catch (error) {
    throw new Error('Failed to search for jobs: ' + error.message);
  }
};

export default searchJobs;