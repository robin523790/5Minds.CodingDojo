import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DisplayComponent } from '@src/app/components/display/display.component';
import { ClockData } from '@src/app/models/clock-data';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
    template: '<app-display [date]="date"></app-display>'
})
class TestHostComponent {
    date: Date;
}

describe('DisplayComponent', () => {
    let hostFixture: ComponentFixture<TestHostComponent>;
    let hostComp: TestHostComponent;
    let debugElement: DebugElement;
    let comp: DisplayComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DisplayComponent, TestHostComponent],
            providers: [],
        })
        .compileComponents();
        hostFixture = TestBed.createComponent(TestHostComponent);
        hostComp = hostFixture.componentInstance;
        debugElement = hostFixture.debugElement.query(By.directive(DisplayComponent));
        comp = debugElement.componentInstance;
    });

    it('should create', () => {
        expect(comp).toBeTruthy();
    });

    it('#isQuarter() should return true on 2, 5, and 8', () => {
        const tests = [2, 5, 8];
        for (const test of tests) {
            expect(comp.isQuarter(test)).toBe(true, test);
        }
    });

    it('#isQuarter() should return false on 0, 1, 3, 4, 6, 7, 9, and 10', () => {
        const tests = [0, 1, 3, 4, 6, 7, 9, 10];
        for (const test of tests) {
            expect(comp.isQuarter(test)).toBe(false, test);
        }
    });

    it('#isQuarter() should catch invalid arguments', () => {
        const tests = [undefined, null, 0.1, 10.1, -1, -0.1];
        for (const test of tests) {
            expect(() => comp.isQuarter(test)).toThrowError(`invalid argument 'idx: ${test}'`);
        }
    });

    it('should compute clockData from date on date change', () => {
        const tests = [
            new Date('2020-03-15T13:30:40.000Z'),
            new Date('2020-03-15T13:30:41.100Z'),
            new Date('2020-03-15T13:31:42.200Z'),
            new Date('2020-03-15T14:32:43.300Z'),
        ];
        for (const test of tests) {
            hostComp.date = test;  // real change detection only takes place when @Input() is changed by host component...
            hostFixture.detectChanges();
            expect(comp.clockData).toEqual(ClockData.fromDate(test));
        }
    });

    it('should reject changes to invalid date', () => {
        let test = new Date('2020-03-15T13:30:40.000');
        hostComp.date = test;  // real change detection only takes place when @Input() is changed by host component...
        hostFixture.detectChanges();
        expect(comp.clockData).toEqual(ClockData.fromDate(test), test.toString());
        hostComp.date = undefined;  // should leave comp.clockData unchanged
        hostFixture.detectChanges();
        expect(comp.clockData).toEqual(ClockData.fromDate(test), 'to still be ' + test.toString());
        hostComp.date = null;  // should leave comp.clockData unchanged
        hostFixture.detectChanges();
        expect(comp.clockData).toEqual(ClockData.fromDate(test), 'to again be ' + test.toString());
        test = new Date('2020-03-15T15:33:12.123');
        hostComp.date = test;  // should leave comp.clockData unchanged
        hostFixture.detectChanges();
        expect(comp.clockData).toEqual(ClockData.fromDate(test), test.toString());
    });
});
