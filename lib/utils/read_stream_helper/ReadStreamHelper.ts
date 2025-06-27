import csv from 'csv-parser' 
import { Readable } from 'stream'

export class ReadStreamHelper {
    static async readStreamAsString(stream: Readable): Promise<string> {
        return new Promise((resolve, reject) => {
            let data = ''
            stream.on('error', () => reject())
                .on('data', (chunk) => data += chunk)
                .on('end', () => resolve(data))
        })
    }

    static async readStreamAsCSV(stream: Readable) {
        return new Promise((resolve, reject) => {
            const data = []
            stream.pipe(csv())
                .on('error', () => reject())
                .on('data', (chunk) => data.push(chunk))
                .on('end', () => resolve(data))
        })
    }
}