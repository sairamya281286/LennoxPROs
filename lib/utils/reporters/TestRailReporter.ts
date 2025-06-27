import {
    AddResultForCase, Case, 
} from '@dlenroc/testrail'
import type {
    FullConfig, FullResult, Reporter, Suite, TestCase, TestResult, 
} from '@playwright/test/reporter'
import moment from 'moment'

import { CredentialsLoader } from '~utils/credentials/loader/CredentialsLoader'
import { CredentialFiles } from '~utils/credentials/models/CredentialFiles'
import { CredentialsProvider } from '~utils/credentials/provider/CredentialsProvider'
import { logger } from '~utils/logger/Logger'
import { TestRailApiReporter } from '~utils/reporter-helper/testRailIntegration/TestRailApiReporter'
import { TestRailProjectManager } from '~utils/reporter-helper/testRailIntegration/TestRailProjectManager'

export type TestRes = {title: string, status: string}
export default class MyReporter implements Reporter {
    private testResults: TestRes[]
    constructor() {
        this.testResults = []
    }
    
    async onBegin(_config: FullConfig, _suite: Suite) {
        logger.info('Test Run started')
    }

    onTestEnd(test: TestCase, result: TestResult) {
        this.testResults.push({ title: test.title, status: result.status })
    }

    async onEnd(result: FullResult) {
        logger.info(`Test Run Finished duration: ${result.duration}ms`)
        const { 
            BROWSER: browser,
            SUITE: suiteName,
            APP: application,
            ENV: environment,
        } = process.env
        const suiteStartTime = moment(result.startTime).format('MM/DD/YYYY_HH:mm:ss')
        if (process.env.CI != 'true') {
            logger.warn('Not running in CI, skipping TestRail upload')
            return
        }
        logger.info('Uploading results to TestRail')
        await CredentialsLoader.getCredentialsFile(CredentialFiles.TEST_RAIL_CREDENTIALS)
        const testRailCredentials = new CredentialsProvider().getTestRailCredentials()
        const testRailReporter = new TestRailApiReporter(testRailCredentials)

        const projectId = TestRailProjectManager.getProjectId()
        
        const testRailStatuses = await testRailReporter.getStatuses() 
        const resultsToAddToTestsRun: AddResultForCase[] = []
        const testsToAddToTestRun: Array<Case> = []
        for (const result of this.testResults) {
            await testRailReporter.createTestCaseWithSectionByTitle(projectId, result.title)
        }

        let countPassed = 0
        let countFailed = 0
        for (const result of this.testResults) {
            const createdTestCase = await testRailReporter.getCaseByTitle(projectId, result.title)
            if (!createdTestCase) {
                continue
            }
            testsToAddToTestRun.push(createdTestCase)

            let statusForTestRail = undefined
            switch (result.status) {
                case 'passed': statusForTestRail = testRailStatuses.find(status => status.name == 'passed'); countPassed++; break
                case 'failed': statusForTestRail = testRailStatuses.find(status => status.name == 'failed'); countFailed++; break
                case 'skipped': statusForTestRail = testRailStatuses.find(status => status.name == 'retest'); break
                case 'interrupted': statusForTestRail = testRailStatuses.find(status => status.name == 'retest'); break
                case 'timedOut': statusForTestRail = testRailStatuses.find(status => status.name == 'failed'); break
                default: throw new Error(`Unhandled status: ${result.status}`)
            }
            
            resultsToAddToTestsRun.push({ case_id: createdTestCase.id, status_id: statusForTestRail.id })
        }

        if (testsToAddToTestRun?.length <= 0) {
            logger.info('No tests to upload to TestRail')
            return
        }
        const runName = `${environment}-${application}-${suiteName}-${browser}-${suiteStartTime}-${countPassed}-${countFailed}`
        const testRun = await testRailReporter.createTestRun(projectId, runName)
        await testRailReporter.updateRunWithTestCases(testRun, testsToAddToTestRun)
        await testRailReporter.addResultsForCases(testRun, resultsToAddToTestsRun)

        await testRailReporter.closeTestRun(testRun)
        logger.info('Finished uploading results to TestRail')
    }
}
