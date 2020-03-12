import { Component, Input, OnChanges, SimpleChanges, OnInit, OnDestroy } from '@angular/core';
import { IClockData, ClockData } from '@src/app/models/clock-data';
import { interval, Subscription } from 'rxjs';

@Component({
    selector: 'app-display',
    templateUrl: './display.component.html',
    styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit, OnDestroy, OnChanges {
    @Input() date: Date;
    @Input() running = true;
    @Input() useRealTime = true;

    clockData: IClockData;
    subscription$ = new Subscription();

    ngOnInit(): void {
        this.subscription$.add(
            interval(1000)
                .subscribe(() => {
                    if (this.running) {
                        if (this.useRealTime) {
                            this.date = new Date();
                        } else {
                            this.date.setSeconds(this.date.getSeconds() + 1);
                        }
                        this.clockData = ClockData.fromDate(this.date);
                    }
                })
            );
    }

    ngOnDestroy(): void {
        this.subscription$.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hasOwnProperty('date')) {
            this.clockData = ClockData.fromDate(changes.date.currentValue);
        }
    }

    isQuarter(idx: number): boolean {
        return Number.isInteger((idx + 1) / 3);
    }
}
