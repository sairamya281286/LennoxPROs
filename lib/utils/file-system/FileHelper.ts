import { createObjectCsvWriter } from 'csv-writer'
import { ObjectMap } from 'csv-writer/src/lib/lang/object'
import { ObjectStringifierHeader } from 'csv-writer/src/lib/record'
import {
    existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync, 
} from 'fs'
import {
    mkdir, stat, writeFile, 
} from 'fs/promises'
import {
    dirname, join, 
} from 'path'
import pdf from 'pdf-parse'
import { Readable } from 'stream'

import { logger } from '~utils/logger/Logger'

export class FileHelper {
    static async writeFileAsync(
        filePath: string,
        data: string | Buffer,
        encoding: BufferEncoding = 'utf-8'
    ): Promise<void> {
        logger.info(`Writing file: ${filePath}`)
        // Extract the directory path from the full file path.
        const dir = dirname(filePath)

        // Check if the directory exists; if not, create it recursively.
        try {
            await stat(dir)
        } catch {
            await mkdir(dir, { recursive: true })
        }

        // Write the file.
        // If data is a string, provide the encoding; if it's a Buffer, this option is ignored.
        await writeFile(filePath, data, typeof data === 'string' ? { encoding } : undefined)
        logger.info(`File written: ${filePath}`)
    }
    
    static ROOT_PROJECT_DIR = join(__dirname, '..', '..', '..')

    static readJsonFile(path: string) {
        return JSON.parse(readFileSync(path, 'binary'))
    }

    static readDirFiles(path: string) {
        return readdirSync(path)
    }

    static makeDir(path: string) {
        mkdirSync(path, { recursive: true })
    }

    static isPathExists(pathToFile: string) {
        return existsSync(pathToFile)
    }

    static readFileData(path) {
        const buffer = readFileSync(path)
        return buffer.toString()
    }

    static async readPDFFile(path) {
        const file = readFileSync(path)
        return pdf(file).then((data) => { return data })
    }

    static async readCSVFile(path) {
        const file = readFileSync(path, 'utf-8')
        return file
    }

    static writeJsonData(filePath: string, data: unknown) {
        const dir = dirname(filePath)
        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true })
        }
        writeFileSync(filePath, JSON.stringify(data, undefined, 2))
    }

    static async writeCSVObjectToFile({
        filePath, header, objectMap, append = true, 
    }: {
        filePath: string;
        header: ObjectStringifierHeader;
        objectMap: ObjectMap<unknown>[]; append?: boolean 
    }) {
        const objectCsvWriter = createObjectCsvWriter({
            path: filePath,
            append,
            header,
        })

        await objectCsvWriter.writeRecords(objectMap)
    }

    static isFileExists(pathToFile) {
        return existsSync(pathToFile)
    }

    static removeFile(path) {
        unlinkSync(path)
    }

    static async readStreamToStringAsync(readStream: Readable): Promise<string> {
        return new Promise((resolve, reject) => {
            let data = ''
            readStream.on('data', (chunk) => {
                data += chunk
            })

            readStream.on('end', () => {
                resolve(data)
            })

            readStream.on('error', (err) => {
                reject(err)
            })
        })
    }
}