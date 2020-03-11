import { Time } from '@angular/common';

/**
 * Interface for "normal time" to BerlinClock display.
 * 
 * @sa https://de.wikipedia.org/wiki/Berlin-Uhr#Anzeigeprinzip (German)
 */
export interface IClockData {
    row5HourFields: boolean[];
    row1HourFields: boolean[];
    row5MinuteFields: boolean[];
    row1MinuteFields: boolean[];
    secondField: boolean;
}

/**
 * @brief Creates a ClockData object from normal time formats (Date, Time, hours + minutes + seconds).
 */
export class ClockData implements IClockData {
    row5HourFields = [];
    row1HourFields = [];
    row5MinuteFields = [];
    row1MinuteFields = [];
    secondField = false;

    /**
    * @brief Creates a ClockData object from the specified time.
    * @param hours - hours to display on the BerlinClock
    * @param minutes - minutes to display on the BerlinClock
    * @param secs - (optional) specific second to display; if not provided, second from the current Date() is used
    */
    constructor(hours: number, minutes: number, secs?: number) {
        if (secs === undefined) {
            secs = new Date().getSeconds();
        }
        if (!Number.isInteger(hours) || hours < 0 || hours > 23) {
            throw new Error(`invalid argument 'hours: ${hours}'`);
        }
        if (!Number.isInteger(minutes) || minutes < 0 || minutes > 59) {
            throw new Error(`invalid argument 'minutes: ${minutes}'`);
        }
        if (!Number.isInteger(secs) || secs < 0 || secs > 59) {
            throw new Error(`invalid argument 'secs: ${secs}'`);
        }

        const fiveHrs = Math.floor(hours / 5);
        const oneHrs = Math.floor(hours % 5);
        const fiveMin = Math.floor(minutes / 5);
        const oneMin = Math.floor(minutes % 5);

        // Initialize all arrays...
        for (let i = 0; i < 4; i++) {
            this.row5HourFields[i] = i < fiveHrs;
            this.row1HourFields[i] = i < oneHrs;
            this.row5MinuteFields[i] = i < fiveMin;
            this.row1MinuteFields[i] = i < oneMin;
        }

        // row5MinuteFields is longer than the rest...
        for (let i = 4; i < 11; i++) {
            this.row5MinuteFields[i] = i < fiveMin;
        }

        // Not clearly specified. For now, take every odd second as "on"...
        this.secondField = (secs & 1) == 1;
    }

    /**
     * @brief Creates a ClockData object from the specified time.
     * @param time - Time object to display on the BerlinClock
     * @param secs - (optional) specific second to display; if not provided, second from the current Date() is used
     */
    static fromTime(time: Time, secs?: number): IClockData {
        return new ClockData(time.hours, time.minutes, secs);
    }

    /**
     * @brief Creates a ClockData object from the specified date.
     * @param date - Date object to display on the BerlinClock. Only time component is considered (discarding milliseconds).
     */
    static fromDate(date: Date): IClockData {
        return new ClockData(date.getHours(), date.getMinutes(), date.getSeconds());
    }
}