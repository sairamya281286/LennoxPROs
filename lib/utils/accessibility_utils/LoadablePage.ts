import { Page } from 'playwright'

export interface ILoadablePage {
    page: Page
    areFailedLocatorsExists(): Promise<LocatorState[]>
}

export type LocatorState = { selector: string, isLoaded: boolean }
