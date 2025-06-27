import { DateTime } from 'luxon'
import { APIResponse } from 'playwright'
import test from 'playwright/test'

import { IAPIRequestOptions } from '../playwright/IRequestOptions'

export class ApiClientReportingUtil {
    private startTime: DateTime | null = null
    constructor(private baseUrl: string, private verbose: boolean = !process.env.CI) {}

    async reportRequest(path: string, options: IAPIRequestOptions): Promise<void> {
        const requestUrl = `${options.method.toUpperCase()} ${this.baseUrl}${path}`

        await test.step('📤 Report API Request', async (step) => {
            const logObject = {
                requestUrl,
                headers: options.headers || {},
                params: options.params || {},
                body: this.safelyStringify(options.data),
            }

            await step.attach(`Request: ${requestUrl}`, {
                body: this.safelyStringify(logObject),
                contentType: 'application/json',
            })

            if (this.verbose) {
                console.log('📤 [API Request]', JSON.stringify(logObject, null, 2))
            }

            this.startTime = DateTime.now()
        })
    }

    async reportResponse(response: APIResponse): Promise<void> {
        const endTime = DateTime.now()
        const elapsed = this.startTime ? `${endTime.diff(this.startTime).toMillis()} ms` : 'N/A'

        await test.step('📥 Report API Response', async (step) => {
            let responseBody: unknown
            try {
                const contentType = response.headers()['content-type'] || ''
                responseBody = contentType.includes('application/json')
                    ? await response.json()
                    : await response.text()
            } catch {
                responseBody = '[Unable to parse response body]'
            }

            const logObject = {
                responseUrl: response.url(),
                elapsedTime: elapsed,
                status: response.status(),
                headers: response.headers(),
                body: responseBody,
            }

            await step.attach(`Response: ${response.url()}`, {
                body: this.safelyStringify(logObject),
                contentType: 'application/json',
            })

            if (this.verbose) {
                console.log('📥 [API Response]', JSON.stringify(logObject, null, 2))
            }
        })
    }

    private safelyStringify(data: unknown): string {
        try {
            if (!data) return ''
            if (typeof data === 'string') return data
            if (Buffer.isBuffer(data)) return data.toString('utf-8')
            return JSON.stringify(data, null, 2)
        } catch {
            return '[Unserializable body]'
        }
    }
}
