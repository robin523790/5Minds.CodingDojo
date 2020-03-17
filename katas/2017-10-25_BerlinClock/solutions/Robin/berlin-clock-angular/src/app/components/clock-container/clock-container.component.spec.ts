import { async, fakeAsync, ComponentFixture, TestBed, tick, discardPeriodicTasks } from '@angular/core/testing';

import { ClockContainerComponent } from '@src/app/components/clock-container/clock-container.component';
import { TranslateService } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { MaterialModule } from '@src/app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component, DebugElement } from '@angular/core';
import { DisplayComponent } from '../display/display.component';
import { TimerService } from '@src/app/services/timer.service';

@Component({
    template: '<app-clock-container [language]="language"></app-clock-container>'
})
class TestHostComponent {
    language: string;
}

describe('ClockContainerComponent', () => {
    let hostFixture: ComponentFixture<TestHostComponent>;
    let hostComp: TestHostComponent;
    let debugElement: DebugElement;
    let comp: ClockContainerComponent;
    let translate: TranslateService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ClockContainerComponent, TestHostComponent, DisplayComponent],
            imports: [
                MaterialModule,
                BrowserAnimationsModule,
                RouterTestingModule,
                TranslateTestingModule.withTranslations({ en: require('src/assets/i18n/en.json'), de: require('src/assets/i18n/de.json') }),
            ],
            providers: [TimerService]
        }).compileComponents();
    }));

    beforeEach(() => {
        hostFixture = TestBed.createComponent(TestHostComponent);
        hostComp = hostFixture.componentInstance;
        debugElement = hostFixture.debugElement.query(By.directive(ClockContainerComponent));
        comp = debugElement.componentInstance;
        translate = debugElement.injector.get(TranslateService);
        translate.addLangs(['de', 'en', 'it']);
        translate.setDefaultLang('en');
        hostComp.language = 'en';
        hostFixture.detectChanges();
    });

    it('should create', () => {
        expect(comp).toBeTruthy();
    });

    it('should contain three languages: de, en, it', () => {
        expect(comp.languages.length).toBe(3);
        expect(comp.languages[0]).toEqual('en');  // default language first
        expect(comp.languages[1]).toEqual('de');
        expect(comp.languages[2]).toEqual('it');
    });

    it('should use English', () => {
        expect(comp.language).toEqual('en');
    });

    it('should change language to "de"', () => {
        hostComp.language = 'de';
        hostFixture.detectChanges();
        expect(comp.language).toEqual('de');
    });

    it('should offer three languages in mat-select popup', fakeAsync(() => {
        // open options dialog
        const matSelect = debugElement.query(By.css('.mat-select-trigger')).nativeElement;
        matSelect.click();
        hostFixture.detectChanges();
        tick();

        const inquiryOptions = debugElement.queryAll(By.css('.mat-option-text'));
        expect(inquiryOptions.length).toBe(comp.languages.length);
        inquiryOptions.forEach((debugElem, idx) => {
            const ne: HTMLSpanElement = debugElem.nativeElement;
            expect(ne.textContent).toContain(`[${comp.languages[idx].toUpperCase()}] `);
        });

        // hide options dialog again
        matSelect.click();
        hostFixture.detectChanges();
        tick();
    }));

    it('should switch back to English on select in popup', fakeAsync(() => {
        // open options dialog
        const matSelect = debugElement.query(By.css('.mat-select-trigger')).nativeElement;
        matSelect.click();
        hostFixture.detectChanges();
        tick();

        const inquiryOptions = debugElement.queryAll(By.css('.mat-option-text'));
        let found = false;
        inquiryOptions.forEach((debugElem, idx) => {
            const ne: HTMLSpanElement = debugElem.nativeElement;
            if (ne.textContent.includes('[EN]')) {
                ne.click();
                hostFixture.detectChanges();
                tick(500);
                expect(comp.language).toEqual('en');
                found = true;
            }
        });

        // hide options dialog again
        matSelect.click();
        hostFixture.detectChanges();
        tick();
        
        expect(found).toBeTrue();
    }));

    it('buttons "add x something" should call "#addSomething(x)"', fakeAsync(() => {
        const spyAddHour = spyOn(comp.timerService, 'addHours').and.callThrough();
        const spyAddMins = spyOn(comp.timerService, 'addMinutes').and.callThrough();
        const spyAddSecs = spyOn(comp.timerService, 'addSeconds').and.callThrough();
        const tests: Array<[string, string]> = [
            ['h', '5'], ['h', '1'], ['h', '-1'], ['h', '-5'],
            ['m', '5'], ['m', '1'], ['m', '-1'], ['m', '-5'],
            ['s', '5'], ['s', '1'], ['s', '-1'], ['s', '-5'],
        ];
        tests.forEach((test, idx) => {
            const button = debugElement.nativeElement.querySelector(`#btn${test[1]}${test[0]}`);
            expect(button).toBeTruthy(`could not find button with id="btn${test[1]}${test[0]}"`)
            button.click();
            hostFixture.detectChanges();
            tick();

            let spy;
            switch (test[0]) {
                case 'h': spy = spyAddHour; break;
                case 'm': spy = spyAddMins; break;
                case 's': spy = spyAddSecs; break;
            }
            expect(spy).toHaveBeenCalledTimes(idx % 4 + 1);
            expect(spy).toHaveBeenCalledWith(+test[1]);
        });
    }));

    it('should display the current time correctly', () => {
        const h = debugElement.nativeElement.querySelector(`#show_h`);
        const m = debugElement.nativeElement.querySelector(`#show_m`);
        const s = debugElement.nativeElement.querySelector(`#show_s`);
        expect(h).toBeTruthy('should be able to find id="show_h"');
        expect(m).toBeTruthy('should be able to find id="show_m"');
        expect(s).toBeTruthy('should be able to find id="show_s"');
        const time = `${h.textContent}:${m.textContent}:${s.textContent}`;
        expect(time).toEqual(comp.timerService.date.toTimeString().substr(0, 8));
    });

    it('should set runSpeed on button click', fakeAsync(() => {
        const spy = spyOn(comp.timerService, 'setRunSpeed').and.callThrough();
        const tests = [0, 1, 5, 20, 100, 500];
        tests.forEach((test, idx) => {
            const button = debugElement.nativeElement.querySelector(`#btnSpeed${test}-button`);  // use '-button' to access button inside mat-button-toggle
            expect(button).toBeTruthy(`should find id="btnSpeed${test}"`);
            button.click();
            hostFixture.detectChanges();
            tick();
            expect(spy).toHaveBeenCalledTimes(idx + 1);
            expect(spy).toHaveBeenCalledWith(test);
        });
        discardPeriodicTasks();
    }));
});
