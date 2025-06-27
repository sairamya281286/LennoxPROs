import AxeBuilder from '@axe-core/playwright'
import { Duration } from 'luxon'
import moment from 'moment'
import { join } from 'path'
import test, { expect } from 'playwright/test'

import { AssertionHelper } from '~utils/assertion-helper/AssertionHelper'
import { FileHelper } from '~utils/file-system/FileHelper'
import { ReportHelper } from '~utils/reporter-helper/ReporterHelper'

import { ILoadablePage } from './LoadablePage'

export class AccessibilityUtils {
    private static waitTimeMs: number = 3000
    static setWaitTime(timeMs: number | Duration) {
        if (timeMs instanceof Duration) {
            this.waitTimeMs = timeMs.as('milliseconds')
        } else {
            this.waitTimeMs = timeMs
        }
        return this
    }

    static async performAccessibilityCheckFor(page: ILoadablePage, {
        includeSelector, excludeSelector, 
    }: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        includeSelector?: any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        excludeSelector?: any
    } = {}): Promise<void> {
        await test.step('Check accessibility violations', async () => {
            const dataAxeIgnore = '[data-axe-ignore]'
            const chmln = '#chmln'

            await new AssertionHelper()
                .verifyIfPageLoaded(page, Duration.fromObject({ milliseconds: this.waitTimeMs }))

            const pageUrl = page.page.url()
            const axeBuilder = new AxeBuilder({ page: page.page })
                .exclude(dataAxeIgnore)
                .exclude(chmln)
            if (includeSelector) {
                axeBuilder.include(includeSelector)
            }
            if (excludeSelector) {
                axeBuilder.exclude(excludeSelector)
            }

            const results = await axeBuilder.analyze()

            const csvFilePath = join(ReportHelper.REPORT_DIR, 'accessibilityUrls.csv')
            const objectToWrite = {
                url: pageUrl,
                testTitle: test.info().titlePath[1],
                testFilePath: test.info().titlePath[0],
            }

            FileHelper.writeCSVObjectToFile(
                {
                    filePath: csvFilePath,
                    header: [
                        { id: 'url', title: 'URL' },
                        { id: 'testTitle', title: 'Test Title' },
                        { id: 'testFilePath', title: 'Test File' },
                    ],
                    objectMap: [
                        objectToWrite,
                    ],
                })

            if (results.violations.length > 0) {
                const violationsObj = {
                    axe: {
                        version: results.testEngine.version,
                        ignorable: [
                            dataAxeIgnore,
                            chmln,
                            excludeSelector,
                        ],
                    },
                    violations: results.violations,
                }
                const filePath = join(ReportHelper.REPORT_PATH, `${this.constructor.name}_${moment().format('DD-MM-YYYY-HH-mm-ss')}_accessibility_violations.json`)
                FileHelper.writeJsonData(filePath, violationsObj)
                test.info().attach('Accessibility violations',
                    {
                        path: filePath,
                        contentType: 'application/json',
                    }
                )
            }
            const message = `${results.violations.length} types of violations detected on page ${pageUrl}`
            
            expect(results.violations.length, message).toBe(0)
        })
    }
}
