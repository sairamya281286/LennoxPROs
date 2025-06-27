import { APIResponse } from 'playwright'
import { expect } from 'playwright/test'

import { ResponseStatuses } from './ResponseStatuses'

export class APIResponseWrapper {
    private response: APIResponse
    constructor(response: APIResponse) {
        this.response = response
    }

    verifyResponseStatus(status: ResponseStatuses): APIResponseWrapper {
        const actualStatus = this.response.status()
        const responseBody = this.response.body()
        
        const message = `Expected status code ${status}, but received ${actualStatus}. Response body: ${JSON.stringify(responseBody)}`
        expect(actualStatus, message).toEqual(status)

        return this
    }

    getResponse() {
        return this.response
    }

    async getResponseBodyAs<T>(): Promise<T> {
        return this.response.json()
    }
}