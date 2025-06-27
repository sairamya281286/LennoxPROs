import { Duration } from 'luxon'

import { Configurations } from '~utils/configurations/Configurations'
import { CredentialsProvider } from '~utils/credentials/provider/CredentialsProvider'
import { WaitUtils } from '~utils/date-and-time/WaitUtils'

import { SFTPClient } from './SFTPClient'

export class SFTPClientProvider {
    static async getCouchDropSftpClient() {
        const serviceCredentials = new CredentialsProvider().getServiceCredentials()
        const environment = Configurations.getEnvironment()
        const couchDropSftp = serviceCredentials.couchDropSftp[environment]

        let sftpClient: SFTPClient
        await WaitUtils.waitFor(async () => {
            sftpClient = await SFTPClient.connect({
                host: couchDropSftp.host,
                port: couchDropSftp.port,
                username: couchDropSftp.username,
                password: couchDropSftp.password,
            })
        }, Duration.fromObject({ minutes: 2 }), Duration.fromObject({ seconds: 30 }))

        return sftpClient
    }
}