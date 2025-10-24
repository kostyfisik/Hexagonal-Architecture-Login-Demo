// Simple test runner for Node.js environment
const { JSDOM } = require('jsdom');

// Set up a basic DOM environment with localStorage support
const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>', {
    url: 'http://localhost',
    pretendToBeVisual: true,
    resources: 'usable'
});

global.document = dom.window.document;
global.window = dom.window;
global.localStorage = dom.window.localStorage;

// Import and run tests
async function runTests() {
    try {
        // Dynamically import the compiled test module using absolute paths
        const testModule = await import('file://' + process.cwd() + '/dist/AuthUsecase.test.js');

        if (testModule.testAuthUsecase) {
            console.log('Running AuthUsecase tests...\n');
            await testModule.testAuthUsecase();
            console.log('\nTests completed.');
        } else {
            console.log('No test function found');
        }
    } catch (error) {
        console.error('Error running tests:', error);
    }
}

runTests();