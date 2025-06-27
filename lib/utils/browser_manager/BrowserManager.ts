import {
    chromium, devices, 
} from 'playwright'

import { logger } from '~utils/logger/Logger'

export class BrowserManager {
    async getDefaultContext(deviceName = 'Desktop Chrome') {
        const device = devices[deviceName]
        logger.info(`Creating context for device: ${deviceName}`)
        const browser = await chromium.launch({
            headless: Boolean(process.env.CI),
        })
        return browser.newContext(device)
    }
}