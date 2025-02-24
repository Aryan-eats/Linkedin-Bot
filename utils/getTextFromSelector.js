import { GLOBAL_WAIT_TIME_FOR_SELECTORS } from '../constants/exports.js';
const getTextFromSelector = async (page, elementName, timeOut=GLOBAL_WAIT_TIME_FOR_SELECTORS) => {
    try {
        // Extract text from the target element
        await page.waitForSelector(elementName, { timeout: timeOut });

        let text = await page.$eval(elementName, el => el.innerText.trim());

        return text;
        
    } catch (error) {
        console.error(`Error fetching text: ${error.message}`);
        return null;
    }
};

export default getTextFromSelector;