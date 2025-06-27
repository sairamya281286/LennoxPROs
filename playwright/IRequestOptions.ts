import { ReadStream } from 'fs'

import { RequestMethods } from './RequestMethods'

export interface IAPIRequestOptions {
    data ?: string | Buffer | unknown;
    failOnStatusCode ?: boolean;
    form ?: { [key: string]: string | number | boolean;};
    headers ?: { [key: string]: string; };
    ignoreHTTPSErrors ?: boolean;
    maxRedirects ?: number;
    method ?: RequestMethods;
    multipart ?: {
    [key: string]: string | number | boolean | ReadStream | {
        name: string;
        mimeType: string;
        buffer: Buffer;
    };
            };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params ?: { [key: string]: any; } | any;
    timeout ?: number;
        
}