import { Duration } from 'luxon'
import Client from 'ssh2-sftp-client'

import { logger } from '~utils/logger/Logger'

import { UploadSftpDataObject } from './UploadSftpDataObject'

export class SFTPClient {
    private sftpClient: Client
     
    private constructor(sftpClient: Client) {
        this.sftpClient = sftpClient
    }
    
    static async connect(options: Client.ConnectOptions) {
        const sftpClient = new Client() 
        await sftpClient.connect({
            ...options, 
            retries: 6,
            retry_minTimeout: Duration.fromObject({ seconds: 30 }).toMillis(),
            retry_factor: 1, 
        })

        return new SFTPClient(sftpClient)
    }

    async putFile(uploadData: UploadSftpDataObject): Promise<this> {
        const remoteDirectory = uploadData.remotePath.split('/').slice(0, -1)
            .join('/')
        await this.createDirectory(remoteDirectory)

        await this.sftpClient.put(uploadData.input, uploadData.remotePath)
        
        logger.info(`File uploaded: \n File to send: ${uploadData.input}\n Location on remote: ${uploadData.remotePath}\n `)
        return this
    }

    async isFileExist(remoteFilePath: string): Promise<false | ('d' | '-' | 'l')> {
        return this.sftpClient.exists(remoteFilePath)
    }
    
    async createDirectory(remoteDirectory: string): Promise<this> {
        const isExists = await this.isFileExist(remoteDirectory)
        if (!isExists) {
            await this.sftpClient.mkdir(remoteDirectory, true)
        }
        return this
    }

    async getFileList(remoteFilePath: string): Promise<Client.FileInfo[]> {
        return this.sftpClient.list(remoteFilePath)
    }

    async disconnect() {
        await this.sftpClient.end()
    }
}