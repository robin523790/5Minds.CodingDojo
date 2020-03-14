import { Component, OnInit, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { interval, Subscription } from 'rxjs';

/**
 * Component to contain the clock's DisplayComponent as well as a few
 * other elements that allow to change the time and see the result in
 * DisplayComponent.
 */
@Component({
    selector: 'app-clock-container',
    templateUrl: './clock-container.component.html',
    styleUrls: ['./clock-container.component.scss']
})
export class ClockContainerComponent implements OnInit, OnDestroy {
    
    @Input() language = 'de';
    @Output() languageChanged = new EventEmitter<string/*language*/>();

    languages: string[];
    date = new Date();
    runSpeed = 1;
    subscription$ = new Subscription();
    timer$: Subscription = null;

    constructor(public translate: TranslateService) {
    }

    ngOnInit(): void {
        this.languages = [];
        this.translate.getLangs().forEach((lang: string) => {
            this.languages.push(lang);
        });
        this.setRunSpeed(this.runSpeed);
    }

    ngOnDestroy(): void {
        this.subscription$.unsubscribe();
    }

    onLanguageChanged() {
        this.translate.use(this.language);
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
        this.date.setHours(this.date.getHours() + i);
        this.date = new Date(this.date);  // Angular detects changes to non-primitives only after change to the memory address... :(
    }

    addMinutes(i: number) {
        this.date.setMinutes(this.date.getMinutes() + i);
        this.date = new Date(this.date);  // Angular detects changes to non-primitives only after change to the memory address... :(
    }

    addSeconds(i: number) {
        this.date.setSeconds(this.date.getSeconds() + i);
        this.date = new Date(this.date);  // Angular detects changes to non-primitives only after change to the memory address... :(
    }
}
