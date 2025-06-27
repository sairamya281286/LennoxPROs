import test from 'playwright/test'

export class DeviceUtils {
    private static isDefaultBrowser = false
    
    static isMobile(): boolean {
        if (test.info().project.name == 'ipad' || this.isDefaultBrowser) {
            return false
        }
        return test.info().project.use.isMobile
    }

    static setDefaultBrowser(isDefault: boolean) {
        this.isDefaultBrowser = isDefault
    }
}