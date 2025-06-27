import { join } from 'path'

import { S3Helper } from '~utils/aws-helper/S3Helper'
import { CredentialsProvider } from '~utils/credentials/provider/CredentialsProvider'

import { FileHelper } from '../../file-system/FileHelper'
import { CredentialFiles } from '../models/CredentialFiles'

export class CredentialsLoader {
    private static CREDENTIALS_BUCKET = 'slideroom-qa'
    private static CREDS_FOLDER_PREFIX = 'qa-ui/creds/'

    private static isCredentialFileExists(credentialsFile: CredentialFiles) {
        if (FileHelper.isPathExists(join(CredentialsProvider.CREDS_FOLDER, credentialsFile))) {
            return true
        } else {
            if (!FileHelper.isPathExists(CredentialsProvider.CREDS_FOLDER)) {
                FileHelper.makeDir(CredentialsProvider.CREDS_FOLDER)
            }
            return false
        }
    }

    static async getCredentialsFile(credentialsFile: CredentialFiles) {
        if (!CredentialsLoader.isCredentialFileExists(credentialsFile)) {
            await CredentialsLoader.downloadCredsFromAws(credentialsFile)
        }
        return FileHelper.readJsonFile(join(CredentialsProvider.CREDS_FOLDER, credentialsFile))
    }

    private static async downloadCredsFromAws(credsFileName: CredentialFiles) {
        const awsS3Credentials = new CredentialsProvider().getS3Credentials()
        const s3Helper = new S3Helper(awsS3Credentials)
        
        const credentialsData = await s3Helper.getObject({ 
            bucket: CredentialsLoader.CREDENTIALS_BUCKET, 
            objectKey: CredentialsLoader.CREDS_FOLDER_PREFIX + credsFileName, 
        })
        FileHelper.writeJsonData(
            join(CredentialsProvider.CREDS_FOLDER, credsFileName),
            JSON.parse(await credentialsData)
        )
    }
}