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
import { TextAst } from '@angular/compiler';

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

    it('date should be "now"', () => {
        const t1 = comp.date.valueOf();
        const t2 = new Date().valueOf();  // may be a few msecs "newer" than t1
        expect(t2 - t1).toBeLessThan(100);  // allow for 100msecs difference
    });

    it('#addHours() should work', () => {
        const refDate = '2020-03-16T12:34:56.123Z';
        const tests: Array<[number, string]> = [
            [undefined, refDate],
            [null, refDate],
            [  0, refDate],
            [  1, '2020-03-16T13:34:56.123Z'],
            [ 10, '2020-03-16T22:34:56.123Z'],
            [ 12, '2020-03-17T00:34:56.123Z'],
            [ 14, '2020-03-17T02:34:56.123Z'],
            [ 20, '2020-03-17T08:34:56.123Z'],
            [ 30, '2020-03-17T18:34:56.123Z'],
            [ -1, '2020-03-16T11:34:56.123Z'],
            [-10, '2020-03-16T02:34:56.123Z'],
            [-12, '2020-03-16T00:34:56.123Z'],
            [-14, '2020-03-15T22:34:56.123Z'],
            [-20, '2020-03-15T16:34:56.123Z'],
            [-30, '2020-03-15T06:34:56.123Z'],
        ];
        for (const test of tests) {
            comp.date = new Date(refDate);
            comp.addHours(test[0]);
            expect(comp.date.toISOString()).toEqual(test[1]);
        }
    });

    it('#addMinutes() should work', () => {
        const refDate = '2020-03-16T12:34:56.123Z';
        const tests: Array<[number, string]> = [
            [undefined, refDate],
            [null, refDate],
            [   0, refDate],
            [   1, '2020-03-16T12:35:56.123Z'],
            [  10, '2020-03-16T12:44:56.123Z'],
            [  60, '2020-03-16T13:34:56.123Z'],
            [ 100, '2020-03-16T14:14:56.123Z'],
            [ 200, '2020-03-16T15:54:56.123Z'],
            [  -1, '2020-03-16T12:33:56.123Z'],
            [ -10, '2020-03-16T12:24:56.123Z'],
            [ -60, '2020-03-16T11:34:56.123Z'],
            [-100, '2020-03-16T10:54:56.123Z'],
            [-200, '2020-03-16T09:14:56.123Z'],
        ];
        for (const test of tests) {
            comp.date = new Date(refDate);
            comp.addMinutes(test[0]);
            expect(comp.date.toISOString()).toEqual(test[1]);
        }
    });

    it('#addSeconds() should work', () => {
        const refDate = '2020-03-16T12:34:56.123Z';
        const tests: Array<[number, string]> = [
            [undefined, refDate],
            [null, refDate],
            [   0, refDate],
            [   1, '2020-03-16T12:34:57.123Z'],
            [  10, '2020-03-16T12:35:06.123Z'],
            [  60, '2020-03-16T12:35:56.123Z'],
            [ 100, '2020-03-16T12:36:36.123Z'],
            [ 200, '2020-03-16T12:38:16.123Z'],
            [  -1, '2020-03-16T12:34:55.123Z'],
            [ -10, '2020-03-16T12:34:46.123Z'],
            [ -60, '2020-03-16T12:33:56.123Z'],
            [-100, '2020-03-16T12:33:16.123Z'],
            [-200, '2020-03-16T12:31:36.123Z'],
        ];
        for (const test of tests) {
            comp.date = new Date(refDate);
            comp.addSeconds(test[0]);
            expect(comp.date.toISOString()).toEqual(test[1]);
        }
    });

    it('#resetTime() should work', () => {
        const refDate = '2020-03-16T12:34:56.123Z';
        comp.date = new Date(refDate);
        comp.resetTime();
        expect(comp.date.valueOf()).toBeCloseTo(new Date().valueOf(), 0);
    });

    it('buttons "add x something" should call "#addSomething(x)"', fakeAsync(() => {
        /*
         * Strictly speaking, this only tests if clicking a button has the same effect
         * as calling "addSomething(x)". This is sufficient because there are tests to
         * ensure that the "addSomething(x)" methods work correctly.
         */
        const tests: Array<[string, string]> = [
            ['h', '5'], ['h', '1'], ['h', '-1'], ['h', '-5'],
            ['m', '5'], ['m', '1'], ['m', '-1'], ['m', '-5'],
            ['s', '5'], ['s', '1'], ['s', '-1'], ['s', '-5'],
        ];
        tests.forEach(test => {
            comp.date = new Date();
            switch(test[0]) {
                case 'h':  comp.addHours(+test[1]);  break;
                case 'm':  comp.addMinutes(+test[1]);  break;
                case 's':  comp.addSeconds(+test[1]);  break;
            }
            const expected = new Date(comp.date);
            comp.resetTime();

            const button = debugElement.nativeElement.querySelector(`#btn${test[1]}${test[0]}`);
            expect(button).toBeTruthy(`could not find button with id="btn${test[1]}${test[0]}"`)
            button.click();
            expect(comp.date).toEqual(expected, `should add ${test[1]} ${test[0]}`);
        });
    }));

    it('should display time correctly', () => {
        comp.date = new Date();
        hostFixture.detectChanges();
        const h = debugElement.nativeElement.querySelector(`#show_h`);
        const m = debugElement.nativeElement.querySelector(`#show_m`);
        const s = debugElement.nativeElement.querySelector(`#show_s`);
        expect(h).toBeTruthy('should be able to find id="show_h"');
        expect(m).toBeTruthy('should be able to find id="show_m"');
        expect(s).toBeTruthy('should be able to find id="show_s"');
        const time = `${h.textContent}:${m.textContent}:${s.textContent}`;
        expect(time).toEqual(comp.date.toTimeString().substr(0, 8));
    });

    it('should set runSpeed on button click', fakeAsync(() => {
        const tests = [0, 1, 5, 20, 100, 500];
        tests.forEach(test => {
            const button = debugElement.nativeElement.querySelector(`#btnSpeed${test}-button`);  // use '-button' to access button inside mat-button-toggle
            expect(button).toBeTruthy(`should find id="btnSpeed${test}"`);
            button.click();
            hostFixture.detectChanges();
            tick();
            expect(comp.runSpeed).toEqual(test, `should set speed to x${test} when clicking btnSpeed${test}`);
            discardPeriodicTasks();
        });
    }));
});
