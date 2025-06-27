import TestRail, {
    AddResultForCase, AddResultsForCases, Case, Run, 
} from '@dlenroc/testrail'

import { logger } from '~utils/logger/Logger'

import { TestRailCredentials } from '../../credentials/models/TestRailCredentials'

export class TestRailApiReporter {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    static MAX_TITLE_LENGTH = 250
    private testRail: TestRail

    constructor(testRailCredentials: TestRailCredentials) {
        this.testRail = new TestRail(testRailCredentials)
    }

    async getCaseByTitle(projectId: number, title: string): Promise<TestRail.Case> {
        const cases = await this.testRail.getCases(projectId, { filter: title })
        if (cases.length == 0) {
            console.warn(`Multiple test cases with title ${title} found`)
            return undefined
        }
        if (cases.length == 1) {
            return cases.at(0)
        }
        if (cases.length > 1) {
            console.warn(`Multiple test cases with title ${title} found`)
            return cases.at(0)
        }
    }

    async createTestCaseWithSectionByTitle(projectId: number, testTitle: string) {
        testTitle = testTitle.trim().slice(0, TestRailApiReporter.MAX_TITLE_LENGTH)
        const parts = testTitle.split('->')
        const sectionName = parts.length > 1 
            ? parts.slice(0, -1).join('->')
                .trim()
            : testTitle.trim()
        
        logger.info(`Creating Test Case ${testTitle} in Section ${sectionName}`)
        const existingSections = await this.testRail.getSections(projectId)
        const existingDuplicatedSections = existingSections.filter(section => section.name === sectionName)

        let neededSection: TestRail.Section

        if (existingDuplicatedSections.length > 0) {
            neededSection = existingDuplicatedSections[0]
            await Promise.all(
                existingDuplicatedSections.slice(1)
                    .map(sectionToRemove => this.testRail.deleteSection(sectionToRemove.id))
            )
        } else {
            neededSection = await this.testRail.addSection(projectId, { name: sectionName })
        }

        const existingCasesWithTitle = await this.testRail.getCases(projectId, { filter: testTitle })

        if (existingCasesWithTitle.length > 0) {
            await Promise.all(
                existingCasesWithTitle.slice(1).map(caseToRemove => this.testRail.deleteCase(caseToRemove.id))
            )
            return existingCasesWithTitle[0]
        }

        return this.testRail.addCase(neededSection.id, { title: testTitle })
    }

    async getStatuses() {
        return this.testRail.getStatuses()
    }

    async createTestRun(projectId, runName: string) {
        logger.info(`Created Test Run ${runName}`)
        return this.testRail.addRun(projectId, { name: runName, include_all: false })
    }

    async updateRunWithTestCases(run: Run, testCases: Case[]) {
        const case_ids = testCases.map((value) => {
            return value.id
        })
        return this.testRail.updateRun(run.id, { case_ids, include_all: false })
    }

    async closeTestRun(run: Run) {
        return this.testRail.closeRun(run.id)
    }

    async addResultsForCases(run: Run, results: AddResultForCase[]) {
        const resultsForTestCases: AddResultsForCases = { results }
        return this.testRail.addResultsForCases(run.id, resultsForTestCases)
    }
}