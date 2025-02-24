import { 
    GLOBAL_WAIT_TIME_BETWEEN_LOCAL_EVENTS, 
    GLOBAL_WAIT_TIME_FOR_SELECTORS 
} from '../constants/exports.js';

// const JOB_SEARCH_BOX_CLASS = '.jobs-search-box__text-input';

export default async function handleJobSearchQuery( page, jobTitle, element='.jobs-search-box__text-input' ) {
    await page.waitForSelector(element, { timeout: GLOBAL_WAIT_TIME_FOR_SELECTORS });
    await page.type(element, jobTitle);

    await new Promise(r => setTimeout(r, GLOBAL_WAIT_TIME_BETWEEN_LOCAL_EVENTS));

    await page.keyboard.press('Enter');
}