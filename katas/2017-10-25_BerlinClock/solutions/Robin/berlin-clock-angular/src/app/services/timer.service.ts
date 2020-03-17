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
            this.timer$ = interval(1000 / this.runSpeed)
                .subscribe(() => this.addSeconds(1));
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
