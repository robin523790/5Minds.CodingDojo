import { TestBed } from '@angular/core/testing';

import { TimerService } from './timer.service';

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

  it('#addHours() should work', () => {
    const refDate = '2020-03-16T12:34:56.123Z';
    const tests: Array<[number, string]> = [
      [undefined, refDate],
      [null, refDate],
      [0, refDate],
      [1, '2020-03-16T13:34:56.123Z'],
      [10, '2020-03-16T22:34:56.123Z'],
      [12, '2020-03-17T00:34:56.123Z'],
      [14, '2020-03-17T02:34:56.123Z'],
      [20, '2020-03-17T08:34:56.123Z'],
      [30, '2020-03-17T18:34:56.123Z'],
      [-1, '2020-03-16T11:34:56.123Z'],
      [-10, '2020-03-16T02:34:56.123Z'],
      [-12, '2020-03-16T00:34:56.123Z'],
      [-14, '2020-03-15T22:34:56.123Z'],
      [-20, '2020-03-15T16:34:56.123Z'],
      [-30, '2020-03-15T06:34:56.123Z'],
    ];
    for (const test of tests) {
      service.date = new Date(refDate);
      service.addHours(test[0]);
      expect(service.date.toISOString()).toEqual(test[1]);
    }
  });

  it('#addMinutes() should work', () => {
    const refDate = '2020-03-16T12:34:56.123Z';
    const tests: Array<[number, string]> = [
      [undefined, refDate],
      [null, refDate],
      [0, refDate],
      [1, '2020-03-16T12:35:56.123Z'],
      [10, '2020-03-16T12:44:56.123Z'],
      [60, '2020-03-16T13:34:56.123Z'],
      [100, '2020-03-16T14:14:56.123Z'],
      [200, '2020-03-16T15:54:56.123Z'],
      [-1, '2020-03-16T12:33:56.123Z'],
      [-10, '2020-03-16T12:24:56.123Z'],
      [-60, '2020-03-16T11:34:56.123Z'],
      [-100, '2020-03-16T10:54:56.123Z'],
      [-200, '2020-03-16T09:14:56.123Z'],
    ];
    for (const test of tests) {
      service.date = new Date(refDate);
      service.addMinutes(test[0]);
      expect(service.date.toISOString()).toEqual(test[1]);
    }
  });

  it('#addSeconds() should work', () => {
    const refDate = '2020-03-16T12:34:56.123Z';
    const tests: Array<[number, string]> = [
      [undefined, refDate],
      [null, refDate],
      [0, refDate],
      [1, '2020-03-16T12:34:57.123Z'],
      [10, '2020-03-16T12:35:06.123Z'],
      [60, '2020-03-16T12:35:56.123Z'],
      [100, '2020-03-16T12:36:36.123Z'],
      [200, '2020-03-16T12:38:16.123Z'],
      [-1, '2020-03-16T12:34:55.123Z'],
      [-10, '2020-03-16T12:34:46.123Z'],
      [-60, '2020-03-16T12:33:56.123Z'],
      [-100, '2020-03-16T12:33:16.123Z'],
      [-200, '2020-03-16T12:31:36.123Z'],
    ];
    for (const test of tests) {
      service.date = new Date(refDate);
      service.addSeconds(test[0]);
      expect(service.date.toISOString()).toEqual(test[1]);
    }
  });

  it('#resetTime() should work', () => {
    const refDate = '2020-03-16T12:34:56.123Z';
    service.date = new Date(refDate);
    service.resetTime();
    expect(service.date).toEqual(new Date());
  });

  // todo it('timer should fire with correct speed', () => {});
});
