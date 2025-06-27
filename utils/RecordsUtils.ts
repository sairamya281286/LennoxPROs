import { Duration } from 'luxon'
import test, { Locator } from 'playwright/test'

import { AssertionHelper } from '~utils/assertion-helper/AssertionHelper'
import { WaitUtils } from '~utils/date-and-time/WaitUtils'

export class RecordUtils {
    static mapLocatorsToInstance<T>(locators: Locator[], Clas: new (locator: () => Locator) => T): Promise<T[]> {
        return Promise.all(locators.map(locator => new Clas(() => locator)))
    }
    
    static async waitForRecordCount<T>(
        getRecordsFunction: () => Promise<T[]>, 
        recordCount: number, 
        timeout = Duration.fromObject({ seconds: 30 }),
        poolTime = Duration.fromObject({ seconds: 1 })
    ) {
        return test.step(`Wait for records count to be ${recordCount}`, async () => {
            return WaitUtils.waitFor(async () => {
                const records = await getRecordsFunction()

                new AssertionHelper()
                    .verifyIf(records.length)
                    .toEqual(recordCount)

                return records
            }, timeout, poolTime)
        })
    }

    static async waitForRecords<T>(
        getRecordsFunction: () => Promise<T[]>, 
        timeout: Duration = Duration.fromObject({ seconds: 30 }),
        poolTime: Duration = Duration.fromObject({ seconds: 1 })
    ): Promise<T[]> {
        return test.step('Wait for records', async () => {
            return WaitUtils.waitFor(async () => {
                const records = await getRecordsFunction()

                new AssertionHelper()
                    .verifyIf(records.length)
                    .toBeGreaterThan(0)

                return records
            }, timeout, poolTime)
        })
    }
}
