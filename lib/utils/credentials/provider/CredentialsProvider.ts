import { config } from 'dotenv'
import { join } from 'path'

import { Configurations } from '~utils/configurations/Configurations'
import { FileHelper } from '~utils/file-system/FileHelper'

import { AWSCredentials } from '../models/AWSCredentials'
import { CredentialFiles } from '../models/CredentialFiles'
import { ServiceCredentials } from '../models/ServiceCredentials'
import { TestRailCredentials } from '../models/TestRailCredentials'
import { OutcomesOrganizationNames } from './helpers/OutcomesOrganizationNames'

type Applications = 'OUTCOMES' | 'ATS_MANAGER' | 'SLIDEROOM_SUBMIT' | 'SLIDEROOM_REVIEW'
enum Environments {AUTO = 'AUTO', QA='QA', PERF='PERF', STAGING='STAGING'}

type OutcomesApplicationData = {
    'default-ui-org': OrgObject,
    'default-api-org': OrgObject
}

export interface OrgObject {
    marketingTrackingApiUrl: string
    reviewPortalUrl: string
    orgName: string
    orgId: string
    orgUrl: string
    studentPortalUrl: string
    studentPortalId: string
    applicantPortalUrl: string
    applicantPortalId: string
    contactsApiUrl: string,
    marketingApiUrl: string,
    inquiryPortalUrl: string,
    users: {
        'test-user': DefaultUser,
        'accessibility-user': DefaultUser,
        'decision-letters-restricted-user': DefaultUser
        'reviewer-user': DefaultUser
        [k: string]: DefaultUser
    }
}

export type DefaultUser = {
    email: string,
    password: string,
    tfaSecret?: string
}

type OutcomesCredentials = {
    [key in Environments]: OutcomesApplicationData
}

export enum ATSManagerUsers {
    TestUser = 'test-user',
    GlobalAdmin = 'global-admin',
    GlobalSupport = 'global-support',
    SystemAdmin = 'system-admin'
}

export class ATSManagerApplicationData {
    url: string
    users: Map<ATSManagerUsers, DefaultUser>
}
type ATSManagerCredentials = {
    [key in Environments]: ATSManagerApplicationData
}

type SlideroomApplicationData = {
    url: string,
        users: {
        'accessibility-user': DefaultUser,
        }
}

type SlideroomCredentials = {
    [key in Environments]: SlideroomApplicationData
}

interface CredentialsFile {
    'OUTCOMES' : OutcomesCredentials,
    'ATS_MANAGER' : ATSManagerCredentials,
    'SLIDEROOM_SUBMIT' : SlideroomCredentials
    'SLIDEROOM_REVIEW' : SlideroomCredentials
}

export class CredentialsProvider {
    static CREDS_FOLDER = join(FileHelper.ROOT_PROJECT_DIR, 'creds')

    private getCredentialsFile(file: CredentialFiles) {
        return FileHelper.readJsonFile(join(CredentialsProvider.CREDS_FOLDER, file))
    }

    private getGeneralUIUserCredentials() {
        return this.getCredentialsFile(CredentialFiles.GENERAL_CREDENTIALS) as CredentialsFile
    }

    getApplicationCredentials(application: Applications) {
        return this.getGeneralUIUserCredentials()[application]
    }

    getOutcomesCredentialsForOrganization(organization: string | OutcomesOrganizationNames = 'default-ui-org') {
        const environment = Configurations.getEnvironment()
        const appCreds = this.getApplicationCredentials('OUTCOMES') as OutcomesCredentials
        const orgObj = appCreds[Environments[environment]][organization] as OrgObject
        return orgObj
    }

    getSlideroomReviewCredentials() {
        const environment = Configurations.getEnvironment()
        const appCreds = this.getApplicationCredentials('SLIDEROOM_REVIEW') as SlideroomCredentials
        return appCreds[environment] as SlideroomApplicationData
    }

    getSlideroomSubmitCredentials() {
        const environment = Configurations.getEnvironment()
        const appCreds = this.getApplicationCredentials('SLIDEROOM_SUBMIT') as SlideroomCredentials
        return appCreds[environment] as SlideroomApplicationData
    }

    getATSManagerCredentials() {
        const environment = Configurations.getEnvironment()
        const appCreds = this.getApplicationCredentials('ATS_MANAGER') as ATSManagerCredentials
        return appCreds[environment] as ATSManagerApplicationData
    }

    getServiceCredentials() {
        return this.getCredentialsFile(CredentialFiles.SERVIECE_CREDENTIALS) as ServiceCredentials
    }

    getTestRailCredentials() {
        return this.getCredentialsFile(CredentialFiles.TEST_RAIL_CREDENTIALS) as TestRailCredentials
    }

    getS3Credentials() {
        config()
        const creds = process.env.S3_QA_CREDENTIALS
        if (!creds) {
            throw new Error('Check if .env file contains S3_QA_CREDENTIALS in the following format: \n S3_QA_CREDENTIALS={"key_id": "<your_id>", "key_secret": "<your_secret>"}')
        }
        return JSON.parse(creds) as AWSCredentials
    }
}
