import { TestBed } from '@angular/core/testing';
import { ClockData } from './clock-data';

describe('ClockData', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        const data = new ClockData(0, 0, 0);
        expect(data).toBeTruthy();
    });

    it('should be initilized correctly', () => {
        const data = new ClockData(0, 0, 0);
        expect(data.row5HourFields.length).toBe(4);
        expect(data.row1HourFields.length).toBe(4);
        expect(data.row5MinuteFields.length).toBe(11);
        expect(data.row1MinuteFields.length).toBe(4);
        // 00:00:00 gets interpreted as "24:59:59 = all lights on!" Special case treatment.
        data.row5HourFields.forEach(b => expect(b).toBeTrue());
        data.row1HourFields.forEach(b => expect(b).toBeTrue());
        data.row5MinuteFields.forEach(b => expect(b).toBeTrue());
        data.row1MinuteFields.forEach(b => expect(b).toBeTrue());
        expect(data.secondField).toBeTrue();
    });

    it('should catch invalid hours argument', () => {
        const tests = [undefined, null, 1.4, -1, 24, 'test', '1'];
        for (const test of tests) {
            expect(() => new ClockData(test as number, 0, 0)).toThrowError(`invalid argument 'hours: ${test}'`);
        }
    });

    it('should catch invalid minutes argument', () => {
        const tests = [undefined, null, 1.4, -1, 60, 'test', '1'];
        for (const test of tests) {
            expect(() => new ClockData(0, test as number, 0)).toThrowError(`invalid argument 'minutes: ${test}'`);
        }
    });

    it('should catch invalid seconds argument', () => {
        const tests = [/*undefined <- allowed!*/ null, 1.4, -1, 60, 'test', '1'];
        for (const test of tests) {
            expect(() => new ClockData(0, 0, test as number)).toThrowError(`invalid argument 'secs: ${test}'`);
        }
    });

    it('should parse 00:01:00 correctly', () => {
        const data = new ClockData(0, 1, 0);
        expect(data.row5HourFields).toEqual([false, false, false, false]);
        expect(data.row1HourFields).toEqual([false, false, false, false]);
        expect(data.row5MinuteFields).toEqual([false, false, false, false, false, false, false, false, false, false, false]);
        expect(data.row1MinuteFields).toEqual([true, false, false, false]);
        expect(data.secondField).toBeTrue();
    });

    it('should parse 01:00:01 correctly', () => {
        const data = new ClockData(1, 0, 1);
        expect(data.row5HourFields).toEqual([false, false, false, false]);
        expect(data.row1HourFields).toEqual([true, false, false, false]);
        expect(data.row5MinuteFields).toEqual([false, false, false, false, false, false, false, false, false, false, false]);
        expect(data.row1MinuteFields).toEqual([false, false, false, false]);
        expect(data.secondField).toBeFalse();
    });

    it('should parse 03:04:02 correctly', () => {
        const data = new ClockData(3, 4, 2);
        expect(data.row5HourFields).toEqual([false, false, false, false]);
        expect(data.row1HourFields).toEqual([true, true, true, false]);
        expect(data.row5MinuteFields).toEqual([false, false, false, false, false, false, false, false, false, false, false]);
        expect(data.row1MinuteFields).toEqual([true, true, true, true]);
        expect(data.secondField).toBeTrue();
    });

    it('should parse 04:05:03 correctly', () => {
        const data = new ClockData(4, 5, 3);
        expect(data.row5HourFields).toEqual([false, false, false, false]);
        expect(data.row1HourFields).toEqual([true, true, true, true]);
        expect(data.row5MinuteFields).toEqual([true, false, false, false, false, false, false, false, false, false, false]);
        expect(data.row1MinuteFields).toEqual([false, false, false, false]);
        expect(data.secondField).toBeFalse();
    });

    // Example case from https://de.wikipedia.org/wiki/Berlin-Uhr
    it('should parse 16:50:04 -> 17:05:19 correctly', () => {
        let data = new ClockData(16, 50, 4);
        expect(data.row5HourFields).toEqual([true, true, true, false]);
        expect(data.row1HourFields).toEqual([true, false, false, false]);
        expect(data.row5MinuteFields).toEqual([true, true, true, true, true, true, true, true, true, true, false]);
        expect(data.row1MinuteFields).toEqual([false, false, false, false]);
        expect(data.secondField).toBeTrue();
        data = new ClockData(16, 51, 5);
        expect(data.row5HourFields).toEqual([true, true, true, false]);
        expect(data.row1HourFields).toEqual([true, false, false, false]);
        expect(data.row5MinuteFields).toEqual([true, true, true, true, true, true, true, true, true, true, false]);
        expect(data.row1MinuteFields).toEqual([true, false, false, false]);
        expect(data.secondField).toBeFalse();
        data = new ClockData(16, 52, 6);
        expect(data.row5HourFields).toEqual([true, true, true, false]);
        expect(data.row1HourFields).toEqual([true, false, false, false]);
        expect(data.row5MinuteFields).toEqual([true, true, true, true, true, true, true, true, true, true, false]);
        expect(data.row1MinuteFields).toEqual([true, true, false, false]);
        expect(data.secondField).toBeTrue();
        data = new ClockData(16, 53, 7);
        expect(data.row5HourFields).toEqual([true, true, true, false]);
        expect(data.row1HourFields).toEqual([true, false, false, false]);
        expect(data.row5MinuteFields).toEqual([true, true, true, true, true, true, true, true, true, true, false]);
        expect(data.row1MinuteFields).toEqual([true, true, true, false]);
        expect(data.secondField).toBeFalse();
        data = new ClockData(16, 54, 8);
        expect(data.row5HourFields).toEqual([true, true, true, false]);
        expect(data.row1HourFields).toEqual([true, false, false, false]);
        expect(data.row5MinuteFields).toEqual([true, true, true, true, true, true, true, true, true, true, false]);
        expect(data.row1MinuteFields).toEqual([true, true, true, true]);
        expect(data.secondField).toBeTrue();
        data = new ClockData(16, 55, 9);
        expect(data.row5HourFields).toEqual([true, true, true, false]);
        expect(data.row1HourFields).toEqual([true, false, false, false]);
        expect(data.row5MinuteFields).toEqual([true, true, true, true, true, true, true, true, true, true, true]);
        expect(data.row1MinuteFields).toEqual([false, false, false, false]);
        expect(data.secondField).toBeFalse();
        data = new ClockData(16, 56, 10);
        expect(data.row5HourFields).toEqual([true, true, true, false]);
        expect(data.row1HourFields).toEqual([true, false, false, false]);
        expect(data.row5MinuteFields).toEqual([true, true, true, true, true, true, true, true, true, true, true]);
        expect(data.row1MinuteFields).toEqual([true, false, false, false]);
        expect(data.secondField).toBeTrue();
        data = new ClockData(16, 57, 11);
        expect(data.row5HourFields).toEqual([true, true, true, false]);
        expect(data.row1HourFields).toEqual([true, false, false, false]);
        expect(data.row5MinuteFields).toEqual([true, true, true, true, true, true, true, true, true, true, true]);
        expect(data.row1MinuteFields).toEqual([true, true, false, false]);
        expect(data.secondField).toBeFalse();
        data = new ClockData(16, 58, 12);
        expect(data.row5HourFields).toEqual([true, true, true, false]);
        expect(data.row1HourFields).toEqual([true, false, false, false]);
        expect(data.row5MinuteFields).toEqual([true, true, true, true, true, true, true, true, true, true, true]);
        expect(data.row1MinuteFields).toEqual([true, true, true, false]);
        expect(data.secondField).toBeTrue();
        data = new ClockData(16, 59, 13);
        expect(data.row5HourFields).toEqual([true, true, true, false]);
        expect(data.row1HourFields).toEqual([true, false, false, false]);
        expect(data.row5MinuteFields).toEqual([true, true, true, true, true, true, true, true, true, true, true]);
        expect(data.row1MinuteFields).toEqual([true, true, true, true]);
        expect(data.secondField).toBeFalse();
        data = new ClockData(17, 0, 14);
        expect(data.row5HourFields).toEqual([true, true, true, false]);
        expect(data.row1HourFields).toEqual([true, true, false, false]);
        expect(data.row5MinuteFields).toEqual([false, false, false, false, false, false, false, false, false, false, false]);
        expect(data.row1MinuteFields).toEqual([false, false, false, false]);
        expect(data.secondField).toBeTrue();
        data = new ClockData(17, 1, 15);
        expect(data.row5HourFields).toEqual([true, true, true, false]);
        expect(data.row1HourFields).toEqual([true, true, false, false]);
        expect(data.row5MinuteFields).toEqual([false, false, false, false, false, false, false, false, false, false, false]);
        expect(data.row1MinuteFields).toEqual([true, false, false, false]);
        expect(data.secondField).toBeFalse();
        data = new ClockData(17, 2, 16);
        expect(data.row5HourFields).toEqual([true, true, true, false]);
        expect(data.row1HourFields).toEqual([true, true, false, false]);
        expect(data.row5MinuteFields).toEqual([false, false, false, false, false, false, false, false, false, false, false]);
        expect(data.row1MinuteFields).toEqual([true, true, false, false]);
        expect(data.secondField).toBeTrue();
        data = new ClockData(17, 3, 17);
        expect(data.row5HourFields).toEqual([true, true, true, false]);
        expect(data.row1HourFields).toEqual([true, true, false, false]);
        expect(data.row5MinuteFields).toEqual([false, false, false, false, false, false, false, false, false, false, false]);
        expect(data.row1MinuteFields).toEqual([true, true, true, false]);
        expect(data.secondField).toBeFalse();
        data = new ClockData(17, 4, 18);
        expect(data.row5HourFields).toEqual([true, true, true, false]);
        expect(data.row1HourFields).toEqual([true, true, false, false]);
        expect(data.row5MinuteFields).toEqual([false, false, false, false, false, false, false, false, false, false, false]);
        expect(data.row1MinuteFields).toEqual([true, true, true, true]);
        expect(data.secondField).toBeTrue();
        data = new ClockData(17, 5, 19);
        expect(data.row5HourFields).toEqual([true, true, true, false]);
        expect(data.row1HourFields).toEqual([true, true, false, false]);
        expect(data.row5MinuteFields).toEqual([true, false, false, false, false, false, false, false, false, false, false]);
        expect(data.row1MinuteFields).toEqual([false, false, false, false]);
        expect(data.secondField).toBeFalse();
    });

    it('should create identical values from Time', () => {
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m++) {
                const s = Math.floor(Math.random() * 59);  // full 24x60x60 test would take awhile, so test random samples
                expect(new ClockData(h, m, s)).toEqual(
                    ClockData.fromTime({ hours: h, minutes: m }, s));
            }
        }
    });

    it('should create identical values from Date', () => {
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m++) {
                const s = Math.floor(Math.random() * 59);  // full 24x60x60 test would take awhile, so test random samples
                const date = new Date();
                date.setHours(h, m, s);
                expect(new ClockData(h, m, s)).toEqual(ClockData.fromDate(date));
            }
        }
    });
});
