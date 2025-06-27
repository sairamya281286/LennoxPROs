import { Random as Rand } from 'random-js'

export class Random {
    static generateRandomString(length = 10) {
        return new Rand().string(length)
    }

    static generateRandomNumber(start = 0, end: number): number {
        return new Rand().integer(start, end)
    }
}