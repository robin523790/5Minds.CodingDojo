import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IClockData, ClockData } from '@src/app/models/clock-data';

@Component({
    selector: 'app-display',
    templateUrl: './display.component.html',
    styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnChanges {

    @Input() date: Date;
    clockData: IClockData;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hasOwnProperty('date')) {
            this.clockData = ClockData.fromDate(changes.date.currentValue);
        }
    }

    isQuarter(idx: number): boolean {
        return Number.isInteger((idx + 1) / 3);
    }
}
