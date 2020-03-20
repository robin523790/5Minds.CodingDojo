import { Injectable, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TimerService implements OnDestroy {

    private subscription$ = new Subscription();
    private timer$: Subscription = null;
    date = new Date();
    runSpeed = 0;
    private addPerTick = 1;

    ngOnDestroy(): void {
        if (this.subscription$) {
            this.subscription$.unsubscribe();
        }
    }

    setRunSpeed(i: number) {
        this.runSpeed = i;

        // Remove timer with old speed...
        if (this.timer$) {
            this.subscription$.remove(this.timer$);
            this.timer$.unsubscribe();
            this.timer$ = null;
        }

        // Create timer with new speed...
        if (this.runSpeed > 0) {
            /*
            * Problem: At high runSpeeds, interval doesn't fire predicably. It works fine until ca. 20x,
            * but 500x always fails (and runs at ~250x instead).
            * Workaround: For runSpeeds greater than 20x, assume 20x and add more seconds per tick.
            */
            let divisor = this.runSpeed
            if (this.runSpeed > 20) {
                divisor = 20;
            }

            this.addPerTick = this.runSpeed / divisor;
            this.timer$ = interval(1000 / divisor)
                .subscribe(() => this.addSeconds(this.addPerTick));
            this.subscription$.add(this.timer$);
        }
    }

    resetTime() {
        this.date = new Date();
    }

    addHours(i: number) {
        if (i != null) {
            this.date.setHours(this.date.getHours() + i);
            this.date = new Date(this.date);  // Angular detects changes to non-primitives only after change to the memory address... :(
        }
    }

    addMinutes(i: number) {
        if (i != null) {
            this.date.setMinutes(this.date.getMinutes() + i);
            this.date = new Date(this.date);  // Angular detects changes to non-primitives only after change to the memory address... :(
        }
    }

    addSeconds(i: number) {
        if (i != null) {
            this.date.setSeconds(this.date.getSeconds() + i);
            this.date = new Date(this.date);  // Angular detects changes to non-primitives only after change to the memory address... :(
        }
    }
}
