import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
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
export class ClockContainerComponent implements OnInit {
    
    @Input() language = 'de';

    languages: string[];

    constructor(
        public translate: TranslateService,
        public timerService: TimerService,
    )
    {
    }

    ngOnInit(): void {
        this.languages = [];
        this.translate.getLangs().forEach((lang: string) => {
            this.languages.push(lang);
        });
        this.timerService.setRunSpeed(1);
    }

    onLanguageChanged() {
        this.translate.use(this.language);
    }
}
