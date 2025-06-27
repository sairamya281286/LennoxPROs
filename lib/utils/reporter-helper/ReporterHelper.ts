import { join } from 'path'

import { FileHelper } from '../file-system/FileHelper'

export class ReportHelper {
    static REPORT_DIR = join(FileHelper.ROOT_PROJECT_DIR, 'report-dir')
    static REPORT_PATH = join(ReportHelper.REPORT_DIR, 'report')
    static METADATA_PATH = join(ReportHelper.REPORT_DIR, 'metadata.json')
}

