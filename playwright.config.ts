import {
    devices, PlaywrightTestConfig, 
} from '@playwright/test'
import { Duration } from 'luxon'

const ONE_SECOND_TIMEOUT = 1000

let proxy:{ server: string; bypass?: string; username?: string; password?: string; }
if (process.env.PROXY) {
    proxy = {
        server: process.env.PROXY,
    }
}

const config: PlaywrightTestConfig = {
    timeout: Duration.fromObject({ hours: 1 }).toMillis(),
    workers: 4,
    retries: 1,
    use: {
        proxy,
        actionTimeout: ONE_SECOND_TIMEOUT * 60,
        acceptDownloads: true,
        ignoreHTTPSErrors: true,
        screenshot: { mode: 'only-on-failure', fullPage: true },
        trace: 'off',
        headless: true, 
    },
    expect: {
        timeout: ONE_SECOND_TIMEOUT * 60, 
    },
    globalSetup: require.resolve('./specs/globalSetup'),
    projects: [
        {
            name: 'firefox',
            retries: 0,
            use: {
                ...devices['Desktop Firefox'],
            }, 
        },
        {
            name: 'chromium',
            retries: 0,
            use: {
                ...devices['Desktop Chrome'],
            }, 
        },
        {
            name: 'webkit',
            retries: 0,
            use: {
                ...devices['Desktop Safari'],
            },
        },
        {
            name: 'galaxy_s8',
            use: {
                isMobile: true,
                ...devices['Galaxy S8'], 
            }, 
        },
        {
            name: 'galaxy_s9',
            use: {
                isMobile: true,
                ...devices['Galaxy S9+'], 
            }, 
        },
        {
            name: 'iphone_xr',
            use: {
                isMobile: true,
                ...devices['iPhone XR'],
                browserName: 'chromium',
            }, 
        },
        {
            name: 'iphone_14_pro_max',
            use: {
                isMobile: true,
                ...devices['iPhone 14 Pro Max'],
                browserName: 'webkit',
            },
        },
        {
            name: 'ipad',
            use: {
                isMobile: false,
                ...devices['iPad Pro 11 landscape'],
                browserName: 'chromium',
            }, 
        },
        {
            name: 'pixel',
            use: {
                isMobile: true,
                ...devices['Pixel 5'],
            }, 
        },
    ],
    outputDir: './report-dir/test-results',
    reporter: [
        [
            './lib/utils/reporters/TestRailReporter.ts',
        ],
        [
            'list',
        ],
        [
            'monocart-reporter',
            {
                outputFile: './report-dir/monocart-report/index.html', 
            },
        ],
    ], 
}
export default config