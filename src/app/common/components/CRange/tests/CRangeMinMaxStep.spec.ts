import { Component, DebugElement } from '@angular/core';
import { setupBefore } from 'test/setupBefore';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RcFormControl } from 'app/Common/Control/RcFormControl';
import { CRange } from 'app/Common/Control/CRange/CRange';
import { CRangeControl } from 'app/Common/Control/CRange/CRangeControl/CRangeControl';
import { CRangeLine } from 'app/Common/Control/CRange/CRangeControl/CRangeLine/CRangeLine';
import { CRangeScale } from 'app/Common/Control/CRange/CRangeControl/CRangeScale/CRangeScale';
import { CRangeSlider } from 'app/Common/Control/CRange/CRangeControl/CRangeSlider/CRangeSlider';

const minValue = 5;
const maxValue = 10;
const step = 0.1;
const cRangeWidth = 500;

@Component({
    template: `<c-range [control]="control" [minValue]="minValue" [maxValue]="maxValue" [step]="step"></c-range>`
})
class CRangeMinMaxStepFixture {
    public control = new RcFormControl<number>(minValue);
    public minValue = minValue;
    public maxValue = maxValue;
    public step = step;
}

describe('<CRangeMinMaxStep>', () => {
    setupBefore([
        CRange,
        CRangeControl,
        CRangeLine,
        CRangeScale,
        CRangeSlider,
        CRangeMinMaxStepFixture,
    ], undefined, undefined, [
        FormsModule
    ]);

    let cRangeMinMaxStep: CRangeMinMaxStepFixture;
    let cRangeMinMaxStepFixture: ComponentFixture<CRangeMinMaxStepFixture>;

    let cRangeDebug: DebugElement;
    let cRange: CRange;
    let cRangeControlDebug: DebugElement;
    let cRangeControl: CRangeControl;
    let cRangeLineDebug: DebugElement;
    let cRangeLine: CRangeLine;
    let cRangeScaleDebug: DebugElement;
    let cRangeScale: CRangeScale;
    let cRangeSliderDebug: DebugElement;
    let cRangeSlider: CRangeScale;

    beforeEach(() => {
        cRangeMinMaxStepFixture = TestBed.createComponent(CRangeMinMaxStepFixture);
        cRangeMinMaxStep = cRangeMinMaxStepFixture.componentInstance;

        cRangeDebug = cRangeMinMaxStepFixture.debugElement.query(By.css('c-range'));
        cRange = cRangeDebug.componentInstance;

        cRangeControlDebug = cRangeMinMaxStepFixture.debugElement.query(By.css('c-range-control'));
        cRangeControl = cRangeControlDebug.componentInstance;
        Object.defineProperties(cRangeControlDebug.nativeElement, {
            clientWidth: {
                get() { return cRangeWidth; }
            }
        });

        cRangeLineDebug = cRangeMinMaxStepFixture.debugElement.query(By.css('c-range-line'));
        cRangeLine = cRangeLineDebug.componentInstance;

        cRangeScaleDebug = cRangeMinMaxStepFixture.debugElement.query(By.css('c-range-scale'));
        cRangeScale = cRangeScaleDebug.componentInstance;

        cRangeSliderDebug = cRangeMinMaxStepFixture.debugElement.query(By.css('c-range-slider'));
        cRangeSlider = cRangeSliderDebug.componentInstance;

        cRangeMinMaxStepFixture.detectChanges();
    });

    describe('<CRangeControl>', () => {
        it('should have correct generated values', () => {
            const result = [];
            const accuracy = step && step % 1 !== 0 ? String(step).split('.')[1].length : 0;
            let i = minValue;

            while (i < maxValue) {
                result.push(i);
                i = Number((i + step).toFixed(accuracy));
            }

            result.push(maxValue);

            expect(cRangeControl.values).toEqual(result);
        });
    });
});
