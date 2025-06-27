import { EnvironmentBasedCredentials } from '../provider/helpers/EnvironmentBasedCredentials'
import { AWSCredentials } from './AWSCredentials'
import { CouchDropSftpCredentials } from './CouchDropSftpCredentials'

export interface ServiceCredentials {
    couchDropSftp: EnvironmentBasedCredentials<CouchDropSftpCredentials>
    aws_keys: {[x:string]: AWSCredentials}
}
