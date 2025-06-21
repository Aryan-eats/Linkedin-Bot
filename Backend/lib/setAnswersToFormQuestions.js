import { buttonClasses, buttonClick } from "../constants/exports.js";

const setAnswersToFormQuestions = async (page, questionType) => {
  try {
    console.log(`Handling question type: ${questionType}`);

    // Contact info - usually pre-filled
    if(questionType === 'Contact info') {
      console.log('Contact info is pre-filled, proceeding...');
      return;
    }

    // Address - usually pre-filled
    if(questionType === 'Address') {
      console.log('Address is pre-filled, proceeding...');
      return;
    }

    // Resume - usually pre-filled
    if(questionType === 'Resume') {
      console.log('Resume is pre-filled, proceeding...');
      return;
    }

    // Work experience - usually pre-filled
    if(questionType === 'Work experience') {
      console.log('Work experience is pre-filled, proceeding...');
      return;
    }

    // Additional questions
    if(questionType === 'Additional questions') {
      console.log('Handling additional questions...');
      
      // Get all questions on the page
      const questions = await page.$$('.jobs-easy-apply-content__wrapper form .jobs-easy-apply-form-section__grouping');
      
      for (const question of questions) {
        try {
          // Get the question text
          const questionText = await question.$eval('label', el => el.textContent.trim());
          console.log(`Processing question: ${questionText}`);

          // Check if it's a yes/no question
          const yesNoButtons = await question.$$('input[type="radio"]');
          if (yesNoButtons.length > 0) {
            // Click "Yes" by default
            await yesNoButtons[0].click();
            continue;
          }

          // Check if it's a text input
          const textInput = await question.$('input[type="text"]');
          if (textInput) {
            // Enter "Yes" by default
            await textInput.type('Yes');
            continue;
          }

          // Check if it's a textarea
          const textarea = await question.$('textarea');
          if (textarea) {
            // Enter "Yes" by default
            await textarea.type('Yes');
            continue;
          }

          // Check if it's a dropdown
          const select = await question.$('select');
          if (select) {
            // Click the first option
            await select.click();
            await new Promise(resolve => setTimeout(resolve, 500));
            const options = await question.$$('select option');
            if (options.length > 1) {
              await options[1].click();
            }
            continue;
          }

          console.log('Could not determine question type, skipping...');
        } catch (error) {
          console.log(`Error processing question: ${error.message}`);
          continue;
        }
      }
    }
  } catch (error) {
    console.log(`Error in setAnswersToFormQuestions: ${error.message}`);
  }
};

export default setAnswersToFormQuestions;
