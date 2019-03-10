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
import { IScaleItem } from 'app/Common/Control/CRange/CRangeInterface/CRangeInterface';

const minValue = 50000;
const maxValue = 2000000;
const cRangeWidth = 500;

@Component({
    template: `<c-range [control]="control" [minValue]="minValue" [maxValue]="maxValue"></c-range>`
})
class CRangeMinMaxFixture {
    public control = new RcFormControl<number>(minValue);
    public minValue = minValue;
    public maxValue = maxValue;
}

describe('<CRangeMinMax>', () => {
    setupBefore([
        CRange,
        CRangeControl,
        CRangeLine,
        CRangeScale,
        CRangeSlider,
        CRangeMinMaxFixture,
    ], undefined, undefined, [
        FormsModule
    ]);

    let cRangeMinMax: CRangeMinMaxFixture;
    let cRangeMinMaxFixture: ComponentFixture<CRangeMinMaxFixture>;

    let cRangeDebug: DebugElement;
    let cRange: CRange;
    let cRangeControlDebug: DebugElement;
    let cRangeControl: CRangeControl;
    let cRangeScaleDebug: DebugElement;
    let cRangeScale: CRangeScale;

    beforeEach(() => {
        cRangeMinMaxFixture = TestBed.createComponent(CRangeMinMaxFixture);
        cRangeMinMax = cRangeMinMaxFixture.componentInstance;

        cRangeDebug = cRangeMinMaxFixture.debugElement.query(By.css('c-range'));
        cRange = cRangeDebug.componentInstance;

        cRangeControlDebug = cRangeMinMaxFixture.debugElement.query(By.css('c-range-control'));
        cRangeControl = cRangeControlDebug.componentInstance;
        Object.defineProperties(cRangeControlDebug.nativeElement, {
            clientWidth: {
                get() { return cRangeWidth; }
            }
        });

        cRangeScaleDebug = cRangeMinMaxFixture.debugElement.query(By.css('c-range-scale'));
        cRangeScale = cRangeScaleDebug.componentInstance;

        cRangeMinMaxFixture.detectChanges();
    });

    describe('<CRangeControl>', () => {
        it('should have correct generated values', () => {
            const result = [];
            let i = minValue;

            while (i < maxValue) {
                result.push(i);
                i = i + Math.pow(10, String(Math.floor(i)).length - 2);
            }

            result.push(maxValue);

            expect(cRangeControl.values).toEqual(result);
        });
    });

    describe('<CRangeScale>', () => {
        it('should have only min and max values', () => {
            let values: IScaleItem[];
            values = cRangeScale.values;

            expect(values.map(({value}) => value)).toEqual([minValue, maxValue]);
        });
    });
});
