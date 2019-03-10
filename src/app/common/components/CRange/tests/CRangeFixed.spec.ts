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

const fixedValues = [31, 91, 181, 266, 730];
const stepPx = 100;
const cRangeWidth = (fixedValues.length - 1) * stepPx;

@Component({
    template: `<c-range [control]="control" [fixedValues]="fixedValues"></c-range>`
})
class CRangeFixedFixture {
    public control = new RcFormControl<number>(31);
    public fixedValues = fixedValues;
}

describe('<CRangeFixed>', () => {
    setupBefore([
        CRange,
        CRangeControl,
        CRangeLine,
        CRangeScale,
        CRangeSlider,
        CRangeFixedFixture,
    ], undefined, undefined, [
        FormsModule
    ]);

    let cRangeFixed: CRangeFixedFixture;
    let cRangeFixedFixture: ComponentFixture<CRangeFixedFixture>;

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
        cRangeFixedFixture = TestBed.createComponent(CRangeFixedFixture);
        cRangeFixed = cRangeFixedFixture.componentInstance;

        cRangeDebug = cRangeFixedFixture.debugElement.query(By.css('c-range'));
        cRange = cRangeDebug.componentInstance;

        cRangeControlDebug = cRangeFixedFixture.debugElement.query(By.css('c-range-control'));
        cRangeControl = cRangeControlDebug.componentInstance;
        Object.defineProperties(cRangeControlDebug.nativeElement, {
            clientWidth: {
                get() { return cRangeWidth; }
            }
        });

        cRangeLineDebug = cRangeFixedFixture.debugElement.query(By.css('c-range-line'));
        cRangeLine = cRangeLineDebug.componentInstance;

        cRangeScaleDebug = cRangeFixedFixture.debugElement.query(By.css('c-range-scale'));
        cRangeScale = cRangeScaleDebug.componentInstance;

        cRangeSliderDebug = cRangeFixedFixture.debugElement.query(By.css('c-range-slider'));
        cRangeSlider = cRangeSliderDebug.componentInstance;

        cRangeFixedFixture.detectChanges();
    });

    describe('<CRange>', () => {
        it('should be an instance of CRange', () => {
            expect(cRange).toBeInstanceOf(CRange);
        });

        it('should have control', () => {
            expect(cRangeControl).toBeInstanceOf(CRangeControl);
        });

        it('should have line', () => {
            expect(cRangeLine).toBeInstanceOf(CRangeLine);
        });

        it('should have scale', () => {
            expect(cRangeScale).toBeInstanceOf(CRangeScale);
        });

        it('should have slider', () => {
            expect(cRangeSlider).toBeInstanceOf(CRangeSlider);
        });
    });

    describe('<CRangeControl>', () => {
        it(`should have width ${cRangeWidth}`, () => {
            expect(cRangeControlDebug.nativeElement.clientWidth).toBe(cRangeWidth);
        });
    });

    describe('<CRangeLine>', () => {
        it('should set correct control value when user clicks at the line (clientX: stepPx)', () => {
            cRangeLineDebug.triggerEventHandler('click', {clientX: stepPx});

            expect(cRange.control.value).toEqual(fixedValues[1]);
        });

        it('should set correct control value when user clicks at the line (clientX: stepPx / 2)', () => {
            cRangeLineDebug.triggerEventHandler('click', {clientX: stepPx / 2});

            expect(cRange.control.value).toEqual(fixedValues[1]);
        });

        it('should set correct control value when user clicks at the line (clientX: stepPx * 2 - 10)', () => {
            cRangeLineDebug.triggerEventHandler('click', {clientX: stepPx * 2 - 10});

            expect(cRange.control.value).toEqual(fixedValues[2]);
        });

    });

    describe('<CRangeScale>', () => {
        let values: IScaleItem[];

        beforeEach(() => {
            values = cRangeScale.values;
        });

        it('should have values are exactly as inputted', () => {
            expect(values.map(({value}) => value)).toEqual(fixedValues);
        });

        it('should change control value when user clicks at the scale', () => {
            const valueScales = cRangeFixedFixture.debugElement.queryAll(By.css('.c-range-scale__scale-item'));
            const secondValueScale = valueScales[1];
            secondValueScale.triggerEventHandler('click', null);

            expect(cRange.control.value).toEqual(fixedValues[1]);
        });

        it('scale item\'s left positions should be separated by stepPX', () => {
            expect(values.map(({left}) => left))
                .toEqual(fixedValues.map((v, i) => i < (fixedValues.length - 1) && stepPx * i));
        });


    });

    describe('<CRangeSlider>', () => {
        it('should change control value when user drag slider {clientX: stepPx}', () => {
            expect(cRange.control.value).toEqual(fixedValues[0]);
            cRangeSliderDebug.triggerEventHandler('mousedown', {clientX: 0});
            expect(cRange.control.value).toEqual(fixedValues[0]);
            document.dispatchEvent(new MouseEvent('mousemove', {clientX: stepPx}));
            expect(cRange.control.value).toEqual(fixedValues[1]);
        });

        it('should not change control value when user drag slider not enough {clientX: stepPx * 0.3}', () => {
            expect(cRange.control.value).toEqual(fixedValues[0]);
            cRangeSliderDebug.triggerEventHandler('mousedown', {clientX: 0});
            expect(cRange.control.value).toEqual(fixedValues[0]);
            document.dispatchEvent(new MouseEvent('mousemove', {clientX: stepPx * 0.3}));
            expect(cRange.control.value).toEqual(fixedValues[0]);
        });

        it('should change control value when user drag slider back {clientX: 0}', () => {
            expect(cRange.control.value).toEqual(fixedValues[0]);
            cRangeSliderDebug.triggerEventHandler('mousedown', {clientX: 0});
            document.dispatchEvent(new MouseEvent('mousemove', {clientX: stepPx}));
            document.dispatchEvent(new MouseEvent('mouseup', null));
            expect(cRange.control.value).toEqual(fixedValues[1]);

            cRangeFixedFixture.detectChanges();

            cRangeSliderDebug.triggerEventHandler('mousedown', {clientX: stepPx});
            document.dispatchEvent(new MouseEvent('mousemove', {clientX: 0}));
            expect(cRange.control.value).toEqual(fixedValues[0]);
        });

        it('should not change control value when user drag slider back not enough {clientX: stepPx * 0.7}', () => {
            expect(cRange.control.value).toEqual(fixedValues[0]);
            cRangeSliderDebug.triggerEventHandler('mousedown', {clientX: 0});
            document.dispatchEvent(new MouseEvent('mousemove', {clientX: stepPx}));
            document.dispatchEvent(new MouseEvent('mouseup', null));
            expect(cRange.control.value).toEqual(fixedValues[1]);

            cRangeFixedFixture.detectChanges();

            cRangeSliderDebug.triggerEventHandler('mousedown', {clientX: stepPx});
            document.dispatchEvent(new MouseEvent('mousemove', {clientX: stepPx * 0.7}));
            expect(cRange.control.value).toEqual(fixedValues[1]);
        });

        it('should set max control value when user drag slider over the max', () => {
            cRangeSliderDebug.triggerEventHandler('mousedown', {clientX: 0});
            document.dispatchEvent(new MouseEvent('mousemove', {clientX: cRangeWidth + stepPx}));
            expect(cRange.control.value).toEqual(fixedValues[fixedValues.length - 1]);
        });

        it('should set min control value when user drag slider over the min', () => {
            cRangeSliderDebug.triggerEventHandler('mousedown', {clientX: 0});
            document.dispatchEvent(new MouseEvent('mousemove', {clientX: -stepPx}));
            expect(cRange.control.value).toEqual(fixedValues[0]);
        });
    });
});
