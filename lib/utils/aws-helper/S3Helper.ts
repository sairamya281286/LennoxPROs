import {
    DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client, 
} from '@aws-sdk/client-s3'
import { Readable } from 'stream'

import { AWSCredentials } from '~utils/credentials/models/AWSCredentials'
import { logger } from '~utils/logger/Logger'

export class S3Helper {
    private s3Client: S3Client

    constructor(credentials: AWSCredentials, region?: string) {
        this.s3Client = new S3Client({
            credentials: {
                accessKeyId: credentials.key_id,
                secretAccessKey: credentials.key_secret,
            },
            region: region || 'us-east-1',
        })
    }

    async getObject({
        bucket, objectKey, 
    }: { bucket: string; objectKey: string }): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: objectKey,
        })
        const response = await this.s3Client.send(command)
        
        return new Promise((resolve, reject) => {
            const chunks: Buffer[] = []
            if (response.Body instanceof Readable) {
                response.Body.on('data', (chunk) => chunks.push(chunk))
                response.Body.on('end', () => resolve(Buffer.concat(chunks).toString()))
                response.Body.on('error', reject)
            } else {
                reject(new Error('Response body is not a stream'))
            }
        })
    }

    async getObjectsList(bucket: string, prefix?: string): Promise<string[]> {
        const command = new ListObjectsV2Command({
            Bucket: bucket,
            Prefix: prefix,
        })
        const response = await this.s3Client.send(command)
        return response.Contents?.map((item) => item.Key || '') || []
    }

    async removeObject({
        bucket, objectKey, 
    }: { bucket: string; objectKey: string }) {
        const command = new DeleteObjectCommand({
            Bucket: bucket,
            Key: objectKey,
        })
        logger.info(`Removing object from S3: ${bucket}/${objectKey} started`)
        await this.s3Client.send(command)
        logger.info(`Removing object from S3: ${bucket}/${objectKey} finished`)
    }

    async putObject({
        bucket, keyName, data, 
    }: { bucket: string; keyName: string; data: string | Buffer }) {
        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: keyName,
            Body: data,
        })
        logger.info(`Uploading object to S3: ${bucket}/${keyName} started`)
        await this.s3Client.send(command)
        logger.info(`Uploading object to S3: ${bucket}/${keyName} finished`)
    }
}
