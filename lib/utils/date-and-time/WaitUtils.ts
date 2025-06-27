// Importing necessary utility functions from external libraries
import _ from 'lodash' 
import {
    DateTime, Duration, 
} from 'luxon'
import test, { expect } from 'playwright/test'

// Importing a custom assertion helper for verifying test results

// Defining the WaitUtils class with static methods for waiting and retrying logic
export class WaitUtils {
    // Static method to wait for a specific duration (default 1 second)
    static async waitForDuration(timeout = Duration.fromObject({ seconds: 1 })) {
        // Wait using a Promise and setTimeout to create a delay for the specified duration
        await test.step(`Wait for ${timeout.toMillis() / 1000} seconds`, async () => {
            await new Promise(res => setTimeout(res, timeout.toMillis()))
        })
    }

    // Static method to wait for a condition to be met by repeatedly running a function
    static async waitFor<T>(
        // Function to run and check repeatedly
        runnable: () => Promise<T>, 
        // Total time to keep retrying the condition
        timeout = Duration.fromObject({ seconds: 30 }),
        // Interval between retries 
        poolTime = Duration.fromObject({ seconds: 1 }) 
    ): Promise<T> {
        // Record the start time to track elapsed time
        return test.step('Wait for condition', async () => {
            const startDate = DateTime.now()

            // Define the retry mechanism as an async function
            const executeRunnable = async () => {
                // Array to collect errors during retries
                const errors = [] 

                // Continue retrying until the timeout is reached
                while (DateTime.now().diff(startDate)
                    .toMillis() < timeout.toMillis()) {
                    try {
                    // Attempt to execute the function and return its result if successful
                        const result = await runnable()
                        return result
                    } catch (error) {
                    // If an error occurs, add it to the error list for logging later
                        errors.push(error)
                    }

                    // Wait for the specified pool time before retrying
                    await WaitUtils.waitForDuration(poolTime)
                }

                // Once timeout is exceeded, log all unique errors encountered
                // Get unique error messages
                const uniqueErrors = _.uniqBy(errors, 'message') 
                uniqueErrors.forEach(error => {
                    if (error instanceof Error) {
                    // Log the error stack trace for debugging purposes
                        console.error(`\n${error.stack}\n`)
                        // Separator for readability
                        console.error('---------------------------------') 
                    }
                })

                // If the condition is not met within the timeout, throw an error
                throw new Error('Timeout exceeded: Condition not met')
            }

            // Execute the retry logic and return the result
            return executeRunnable()
        })
    }

    // Static method to wait for a specific result from an action (with expected result verification)
    static async waitForResult<T>({
        action: runnable, expectedResult, 
    }: { action: () => Promise<T>; expectedResult: T }) {
        // Wait until the expected result is returned by the action
        await this.waitFor(async () => {
            // Execute the provided function and get the result
            const result = await runnable()

            // Use the AssertionHelper to verify that the result matches the expected result
            expect(result, `Result of ${runnable.name} expected to be: ${expectedResult}`).toBe(expectedResult)
        })
    }
}
