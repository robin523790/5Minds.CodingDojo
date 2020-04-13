import { Component, OnInit, Input, AfterViewInit, ChangeDetectorRef } from '@angular/core';
// import { TranslateService } from '@ngx-translate/core';
import { TimerService as TimerService } from '@src/app/services/timer.service';

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
export class ClockContainerComponent implements OnInit, AfterViewInit {

    @Input() language = 'de';

    languages: string[];
    sliderValue = 0;
    sliderLabel = '';

    constructor(
        // public translate: TranslateService,
        public timerService: TimerService,
        private cdr: ChangeDetectorRef,
    )
    {
    }

    ngOnInit(): void {
        this.languages = [];
        // this.translate.getLangs().forEach((lang: string) => {
        //     this.languages.push(lang);
        // });
    }

    ngAfterViewInit(): void {
        this.timerService.setRunSpeed(1);
        this.sliderValue = this.mapTimerToSlider(this.timerService.runSpeed);
        this.sliderLabel = this.mapSliderValueToLabel(this.sliderValue);
        this.cdr.detectChanges();
    }

    onLanguageChanged() {
        // this.translate.use(this.language);
    }

    onSliderChanged(value: number) {
        this.sliderValue = value;
        this.timerService.setRunSpeed(this.mapSliderToTimer(this.sliderValue));
        this.sliderLabel = this.mapSliderValueToLabel(this.sliderValue);
    }

    private mapSliderToTimer(value: number) {
        switch (value) {
            default:
            case 0: return 0;
            case 1: return 1;
            case 2: return 5;
            case 3: return 20;
            case 4: return 100;
            case 5: return 500;
        }
    }

    private mapTimerToSlider(value: number): number {
        switch (value) {
            default:
            case 0: return 0;
            case 1: return 1;
            case 5: return 2;
            case 20: return 3;
            case 100: return 4;
            case 500: return 5;
        }
    }

    private mapSliderValueToLabel(value: number): string {
        switch (value) {
            default:
            case 0: return 'Pause';
            case 1: return 'x1';
            case 2: return 'x5';
            case 3: return 'x20';
            case 4: return 'x100';
            case 5: return 'x500';
        }
    }
}
