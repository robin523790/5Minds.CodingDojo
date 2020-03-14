import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IClockData, ClockData } from '@src/app/models/clock-data';

/**
 * Display of the Berlin Clock
 * 
 * Takes any valid date object as input and displays it as
 * the Berlin Clock would.
 * 
 * Special case (because it's unclear what the real Berlin Clock does)
 * is 00:00:00 which lights up all the lights at once. (Which would
 * be read as 24:59:59, strictly speaking.)
 */
@Component({
    selector: 'app-display',
    templateUrl: './display.component.html',
    styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnChanges {

    @Input() date: Date;  // Date to display
    clockData: IClockData = new ClockData(0, 0, 0);  // ClockData helper to display date

    /** Check for changes of date to display, and convert to ClockData */
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hasOwnProperty('date')) {
            if (changes.date.currentValue) {
                this.clockData = ClockData.fromDate(changes.date.currentValue);
            }
        }
    }

    /**
     * Checks if this 5minutes light signifies a quarter (ie. 15min, 30min, 45min)
     * @param idx - Index of the 5minutes light that might be a quarter
     * @return true if idx is a quarter, otherwise false
     */
    isQuarter(idx: number): boolean {
        if (idx == null || !Number.isInteger(idx) || idx < 0 || idx > 11) {
            throw new Error(`invalid argument 'idx: ${idx}'`);
        }

        return Number.isInteger((idx + 1) / 3);
    }
}
