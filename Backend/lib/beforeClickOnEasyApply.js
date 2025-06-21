import { 
    handleFilters, 
    buttonClick, 
    parentFilters, 
    datePostedFilters, 
    experienceFilters,
    GLOBAL_WAIT_TIME_FOR_SELECTORS
} from '../constants/exports.js';

const beforeClickOnEasyApply = async (page, experienceLevels = ['Intern']) => {
    try {
        // Map experience levels to filter options
        const experienceLevelMap = {
            'Intern': experienceFilters.intern,
            'Entry Level': experienceFilters.entry,
            'Associate': experienceFilters.mid,
            'Mid-Senior level': experienceFilters.senior,
            'Director': experienceFilters.director,
            'Executive': experienceFilters.lead
        };

        // Wait for the date posted filter to be available
        await page.waitForSelector(parentFilters.datePosted, { 
            timeout: GLOBAL_WAIT_TIME_FOR_SELECTORS,
            visible: true 
        });

        //Date posted filter 
        await handleFilters(
            page, 
            parentFilters.datePosted, 
            [datePostedFilters.pastWeek]
        );
        console.log('Applied "Date posted" filter');

        // Add a small delay to ensure the filter is applied
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Apply multiple experience level filters
        const selectedExperienceFilters = experienceLevels
            .map(level => experienceLevelMap[level])
            .filter(filter => filter); // Remove any undefined filters

        if (selectedExperienceFilters.length > 0) {
            // Click on experience level filter and apply all selected levels
            await handleFilters(
                page, 
                parentFilters.experience, 
                selectedExperienceFilters, 
                true, 
                1
            );
            console.log(`Applied Experience level filters: ${experienceLevels.join(', ')}`);
        }

        // Click on easy apply filter
        await buttonClick(page, parentFilters.easyApply);
        console.log('Applied "Easy Apply" filter');
    } catch (error) {
        console.error('Error in beforeClickOnEasyApply:', error.message);
        // Try to continue with the next steps even if date filter fails
        try {
            // Map experience levels to filter options
            const experienceLevelMap = {
                'Intern': experienceFilters.intern,
                'Entry Level': experienceFilters.entry,
                'Associate': experienceFilters.mid,
                'Mid-Senior level': experienceFilters.senior,
                'Director': experienceFilters.director,
                'Executive': experienceFilters.lead
            };

            // Apply multiple experience level filters
            const selectedExperienceFilters = experienceLevels
                .map(level => experienceLevelMap[level])
                .filter(filter => filter); // Remove any undefined filters

            if (selectedExperienceFilters.length > 0) {
                // Click on experience level filter and apply all selected levels
                await handleFilters(
                    page, 
                    parentFilters.experience, 
                    selectedExperienceFilters, 
                    true, 
                    1
                );
                console.log(`Applied Experience level filters: ${experienceLevels.join(', ')}`);
            }

            // Click on easy apply filter
            await buttonClick(page, parentFilters.easyApply);
            console.log('Applied "Easy Apply" filter');
        } catch (retryError) {
            console.error('Error in retry attempt:', retryError.message);
            throw retryError;
        }
    }
}

export default beforeClickOnEasyApply;