import { 
    GLOBAL_WAIT_TIME_BETWEEN_LOCAL_EVENTS, 
    GLOBAL_WAIT_TIME_FOR_SELECTORS
} from '../constants/exports.js';

const handleJobSearchQuery = async(page, title, selector, location = null, options = {}) => {
    const {
        timeOutForSelector = GLOBAL_WAIT_TIME_FOR_SELECTORS, 
        timeOutAfterCompletion = GLOBAL_WAIT_TIME_BETWEEN_LOCAL_EVENTS 
    } = options;
    
    // Handle job title search
    await page.waitForSelector(selector, { timeout: timeOutForSelector });
    await page.type(selector, title);
    await new Promise(r => setTimeout(r, timeOutAfterCompletion));

    // Handle location search if location is provided
    if (location) {
        try {
            // Try different selectors for the location field
            const locationSelectors = [
                'input[aria-label="City, state, or zip code"]',
                '.jobs-search-box__text-input[aria-label="City, state, or zip code"]',
                '#jobs-search-box-location-id-ember325',
                'input[autocomplete="address-level2"]'
            ];

            let locationField = null;
            for (const selector of locationSelectors) {
                try {
                    locationField = await page.waitForSelector(selector, { timeout: 2000 });
                    if (locationField) break;
                } catch (error) {
                    continue;
                }
            }

            if (!locationField) {
                throw new Error('Could not find location field with any known selector');
            }

            // Click the field first to ensure it's focused
            await locationField.click();
            await new Promise(r => setTimeout(r, 500));

            // Clear any existing value
            await page.evaluate(() => {
                const input = document.querySelector('input[aria-label="City, state, or zip code"]');
                if (input) input.value = '';
            });

            // Type the location
            await locationField.type(location);
            await new Promise(r => setTimeout(r, timeOutAfterCompletion));

            console.log('Successfully set location to:', location);
        } catch (error) {
            console.log('Failed to set location:', error.message);
            // Continue with the search even if location setting fails
        }
    }

    // Press Enter to submit the search
    await page.keyboard.press('Enter');
}

export default handleJobSearchQuery;