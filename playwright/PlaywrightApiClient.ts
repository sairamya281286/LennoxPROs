import { test } from '@playwright/test'
import { request } from 'playwright'

import { ApiClientReportingUtil } from '../utils/ApiClientReportingUtil'
import { IAPIRequestOptions } from './IRequestOptions'
import { APIResponseWrapper as APIResponseWrapper } from './ResponseWrapper'

export class PlaywrightAPIClient {
    private reporter:ApiClientReportingUtil
    private baseUrl: string
    private defaultHeaders: {[key: string]: string}

    constructor() {
        this.baseUrl = ''
    }

    setBaseUrl(url: string) {
        this.baseUrl = url
        return this
    }

    setDefaultHeaders(defaultHeaders: { [key: string]: string }) {
        this.defaultHeaders = defaultHeaders
    }

    async performApiCall({
        path, options, 
    }: { path: string, options: IAPIRequestOptions }) {
        return test.step(`Perform ${options.method.toUpperCase()} ${this.baseUrl}${path}`, async () => {
            const apiContext = await request.newContext({
                baseURL: this.baseUrl,
                extraHTTPHeaders: this.defaultHeaders,
                timeout: 1000000,
            })

            this.reporter = new ApiClientReportingUtil(this.baseUrl)
            await this.reporter.reportRequest(path, options)

            const response = await apiContext.fetch(path, options)

            await this.reporter.reportResponse(response)
            
            return new APIResponseWrapper(response)
        })
    }
}