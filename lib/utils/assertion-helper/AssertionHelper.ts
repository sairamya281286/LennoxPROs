import test, { expect } from '@playwright/test'
import { sort } from 'fast-sort'
import { Duration } from 'luxon'

import { ILoadablePage } from '~utils/accessibility_utils/LoadablePage'

/**
 * @deprecated use expect from playwright instead
 */
export class AssertionHelper {
    private message: string

    setMessage(message: string) {
        this.message = message
        test.step(`Assertion: ${message}`, async () => {return undefined})
        return this
    }

    verifyIf(any) {
        if (!this.message) {
            this.setMessage(`Verification for ${test.info().title}`)
        }
        return expect(any, { message: this.message })
    }

    async verifyIfPageLoaded(page: ILoadablePage, timeout = Duration.fromObject({ seconds: 1 })): Promise<void> {
        await test.step(`Check if ${page.constructor.name} is Loaded`, async () => {
            const failedLocators = await page.areFailedLocatorsExists()
            if (failedLocators.length == 0) {
                await page.page.waitForTimeout(timeout.toMillis())
            }
            const message = failedLocators.length > 0 ?
                `Page ${page.constructor.name} loaded successfully` :
                `Page ${page.constructor.name} couldn't load. Failed locators: ${JSON.stringify(failedLocators.map(locator => locator.selector), undefined, 2)}`
            expect(failedLocators, message).toBeTruthy()
        })
    }

    static arrayShouldBeSortedByAsc(array: Array<unknown>, lenght = Infinity): boolean {
        let oldArray = [
            ...array,
        ]
        if (lenght != Infinity) {
            oldArray = array.slice(0, lenght)
        }
        const sortedArray = sort(oldArray).asc()

        return AssertionHelper.areArraysEqual(oldArray, sortedArray)
    }

    static arrayShouldBeSortedByDesc(array, lenght = Infinity): boolean {
        let oldArray = [
            ...array,
        ]
        if (lenght != Infinity) {
            oldArray = array.slice(0, lenght)
        }
        const sortedArray = sort(oldArray).desc()
        return AssertionHelper.areArraysEqual(oldArray, sortedArray)
    }

    private static areArraysEqual(array1: Array<unknown>, array2: Array<unknown>): boolean {
        let areEquals = true
        if (array1.length !== array2.length) {
            areEquals = false
        }
        for (let i = 0; i < array1.length - 1; i++) {
            if (array1[i] !== array2[i]) {
                areEquals = false
            }
        }
        return areEquals
    }
}

