import { DateTime } from 'luxon'

export class DateAndTime {
    static getCurrentTimeFormattedString(format = 'dd/MM/yyyy-HH:mm:ss') {
        return DateTime.now().toFormat(format)
    }

    static getCurrentTimeSimpleFormattedString(format = 'ddMMyyyyHHmmssSSS') {
        return DateTime.now().toFormat(format)
    }

    static getCurrentDateISOString() {
        return DateTime.now().toISO()
    }

    static formatDate(date: Date, format = 'dd/MM/yyyy-HH:mm:ss') {
        return DateTime.fromJSDate(date).toFormat(format)
    }
}