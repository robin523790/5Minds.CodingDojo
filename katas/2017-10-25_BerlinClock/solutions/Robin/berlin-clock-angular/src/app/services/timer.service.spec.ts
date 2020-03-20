import { TestBed, fakeAsync, tick, discardPeriodicTasks, async } from '@angular/core/testing';

import { TimerService } from './timer.service';
import { interval } from 'rxjs';

describe('TimerServiceService', () => {
    let service: TimerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TimerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('date should be "now"', () => {
        const t1 = service.date.valueOf();
        const t2 = new Date().valueOf();  // may be a few msecs "newer" than t1
        expect(t2 - t1).toBeLessThan(100);  // allow for 100msecs difference
    });

    {
        const refDate = '2020-03-16T12:34:56.123Z';
        const tests = [
            { description: '#addHours(undefined) should do nothing', add: undefined, expected: refDate },
            { description: '#addHours(null) should do nothing', add: null, expected: refDate },
            { description: '#addHours(0) should do nothing', add: 0, expected: refDate },
            { description: '#addHours(1) should add 1 hour', add: 1, expected: '2020-03-16T13:34:56.123Z' },
            { description: '#addHours(10) should add 10 hours', add: 10, expected: '2020-03-16T22:34:56.123Z' },
            { description: '#addHours(12) should add 12 hours', add: 12, expected: '2020-03-17T00:34:56.123Z' },
            { description: '#addHours(14) should add 14 hours', add: 14, expected: '2020-03-17T02:34:56.123Z' },
            { description: '#addHours(20) should add 20 hours', add: 20, expected: '2020-03-17T08:34:56.123Z' },
            { description: '#addHours(30) should add 30 hours', add: 30, expected: '2020-03-17T18:34:56.123Z' },
            { description: '#addHours( -1) should sub 1 hour', add: -1, expected: '2020-03-16T11:34:56.123Z' },
            { description: '#addHours(-10) should sub 10 hours', add: -10, expected: '2020-03-16T02:34:56.123Z' },
            { description: '#addHours(-12) should sub 12 hours', add: -12, expected: '2020-03-16T00:34:56.123Z' },
            { description: '#addHours(-14) should sub 14 hours', add: -14, expected: '2020-03-15T22:34:56.123Z' },
            { description: '#addHours(-20) should sub 20 hours', add: -20, expected: '2020-03-15T16:34:56.123Z' },
            { description: '#addHours(-30) should sub 30 hours', add: -30, expected: '2020-03-15T06:34:56.123Z' },
        ];
        tests.forEach(test => {
            it(test.description, () => {
                service.date = new Date(refDate);
                service.addHours(test.add);
                expect(service.date.toISOString()).toEqual(test.expected);
            });
        });
    }

    {
        const refDate = '2020-03-16T12:34:56.123Z';
        const tests = [
            { description: '#addMinutes(undefined) should do nothing', add: undefined, expected: refDate },
            { description: '#addMinutes(null) should do nothing', add: null, expected: refDate },
            { description: '#addMinutes(0) should do nothing', add: 0, expected: refDate },
            { description: '#addMinutes(1) should add 1 minute', add: 1, expected: '2020-03-16T12:35:56.123Z' },
            { description: '#addMinutes(10) should add 10 minutes', add: 10, expected: '2020-03-16T12:44:56.123Z' },
            { description: '#addMinutes(60) should add 60 minutes', add: 60, expected: '2020-03-16T13:34:56.123Z' },
            { description: '#addMinutes(100) should add 100 minutes', add: 100, expected: '2020-03-16T14:14:56.123Z' },
            { description: '#addMinutes(200) should add 200 minutes', add: 200, expected: '2020-03-16T15:54:56.123Z' },
            { description: '#addMinutes(300) should add 300 minutes', add: 300, expected: '2020-03-16T17:34:56.123Z' },
            { description: '#addMinutes( -1) should sub 1 minute', add: -1, expected: '2020-03-16T12:33:56.123Z' },
            { description: '#addMinutes(-10) should sub 10 minutes', add: -10, expected: '2020-03-16T12:24:56.123Z' },
            { description: '#addMinutes(-60) should sub 60 minutes', add: -60, expected: '2020-03-16T11:34:56.123Z' },
            { description: '#addMinutes(-100) should sub 100 minutes', add: -100, expected: '2020-03-16T10:54:56.123Z' },
            { description: '#addMinutes(-200) should sub 200 minutes', add: -200, expected: '2020-03-16T09:14:56.123Z' },
            { description: '#addMinutes(-300) should sub 300 minutes', add: -300, expected: '2020-03-16T07:34:56.123Z' },
        ];
        tests.forEach(test => {
            it(test.description, () => {
                service.date = new Date(refDate);
                service.addMinutes(test.add);
                expect(service.date.toISOString()).toEqual(test.expected);
            });
        });
    }

    {
        const refDate = '2020-03-16T12:34:56.123Z';
        const tests = [
            { description: '#addSeconds(undefined) should do nothing', add: undefined, expected: refDate },
            { description: '#addSeconds(null) should do nothing', add: null, expected: refDate },
            { description: '#addSeconds(0) should do nothing', add: 0, expected: refDate },
            { description: '#addSeconds(1) should add 1 second', add: 1, expected: '2020-03-16T12:34:57.123Z' },
            { description: '#addSeconds(10) should add 10 seconds', add: 10, expected: '2020-03-16T12:35:06.123Z' },
            { description: '#addSeconds(60) should add 60 seconds', add: 60, expected: '2020-03-16T12:35:56.123Z' },
            { description: '#addSeconds(100) should add 100 seconds', add: 100, expected: '2020-03-16T12:36:36.123Z' },
            { description: '#addSeconds(200) should add 200 seconds', add: 200, expected: '2020-03-16T12:38:16.123Z' },
            { description: '#addSeconds(300) should add 300 seconds', add: 300, expected: '2020-03-16T12:39:56.123Z' },
            { description: '#addSeconds( -1) should sub 1 second', add: -1, expected: '2020-03-16T12:34:55.123Z' },
            { description: '#addSeconds(-10) should sub 10 seconds', add: -10, expected: '2020-03-16T12:34:46.123Z' },
            { description: '#addSeconds(-60) should sub 60 seconds', add: -60, expected: '2020-03-16T12:33:56.123Z' },
            { description: '#addSeconds(-100) should sub 100 seconds', add: -100, expected: '2020-03-16T12:33:16.123Z' },
            { description: '#addSeconds(-200) should sub 200 seconds', add: -200, expected: '2020-03-16T12:31:36.123Z' },
            { description: '#addSeconds(-300) should sub 300 seconds', add: -300, expected: '2020-03-16T12:29:56.123Z' },
        ];
        tests.forEach(test => {
            it(test.description, () => {
                service.date = new Date(refDate);
                service.addSeconds(test.add);
                expect(service.date.toISOString()).toEqual(test.expected);
            });
        });
    }

    it('#resetTime() should work', () => {
        const refDate = '2020-03-16T12:34:56.123Z';
        service.date = new Date(refDate);
        service.resetTime();
        expect(service.date.toISOString()).toEqual(new Date().toISOString());
    });

    {
        const tests = [
            { description: 'time should advance 0 secs in 1 sec with runSpeed: 0', runSpeed: 0, expected: 0 },
            { description: 'time should advance 1 secs in 1 sec with runSpeed: 1', runSpeed: 1, expected: 1 },
            { description: 'time should advance 5 secs in 1 sec with runSpeed: 5', runSpeed: 5, expected: 5 },
            { description: 'time should advance 20 secs in 1 sec with runSpeed: 20', runSpeed: 20, expected: 20 },
            { description: 'time should advance 100 secs in 1 sec with runSpeed: 100', runSpeed: 100, expected: 100 },
            { description: 'time should advance 500 secs in 1 sec with runSpeed: 500', runSpeed: 500, expected: 500 },
        ];
        tests.forEach(test => {
            it(test.description, (done) => {
                service.setRunSpeed(test.runSpeed);
                service.resetTime();
                let startValue = service.date.valueOf();
                setTimeout(() => {
                    let endValue = service.date.valueOf();
                    expect((endValue - startValue) / 1000).toBeCloseTo(test.expected, 0);
                    done();
                }, 1000);
            });
        });
    }
});
