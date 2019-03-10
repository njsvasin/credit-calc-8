import {
    AfterViewInit,
    ApplicationRef,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    NgZone,
    OnChanges,
    Output,
    SimpleChanges,
    ViewEncapsulation
} from '@angular/core';
import { CRangeValue } from '../CRangeValue';

@Component({
    selector: 'c-range-control',
    templateUrl: 'CRangeControl.pug',
    styleUrls: ['CRangeControl.styl'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CRangeControl implements OnChanges, AfterViewInit {
    @Input() controlValue: number;
    @Input() minValue: number;
    @Input() maxValue: number;
    @Input() fixedValues: number[];
    @Input() step?: number;
    @Input() rangeValue: CRangeValue;
    @Output() valueChange = new EventEmitter<number>();
    @HostBinding('class.c-range-control') className = true;

    public currentValue: number;
    public offset = 0;
    public stepPx: number;
    public isMaximum: boolean;
    public maxOffset: number;
    public linePadding = 0;
    public values: number[];              // public need for test
    private readonly threshold = 2;
    private offsetVariation = 0;          // px to change to the newIndex
    private valueIndex: number;
    private maxValueIndex: number;
    private nearestIndex: number;

    constructor(private elementRef: ElementRef, private changeDetectorRef: ChangeDetectorRef,
        private ngZone: NgZone, private applicationRef: ApplicationRef) {}

    ngOnChanges({minValue, maxValue, fixedValues, step, controlValue}: SimpleChanges) {
        if (!this.fixedValues && (minValue && this.minValue || maxValue && this.maxValue || step && this.step)) {
            this.generateValues();
            this.updateVariables();
        }

        if (fixedValues && this.fixedValues) {
            this.values = this.fixedValues;
            this.updateVariables();
        }

        if (controlValue && this.values && this.values.length > 0) {
            this.currentValue = +this.controlValue || 0;
            this.isMaximum = this.currentValue >= this.values[this.maxValueIndex];
            this.setOffset();
        }
    }

    ngAfterViewInit() {
        this.setViewParams();
    }

    @HostListener('window:resize')
    windowResize() {
        this.setViewParams();
    }

    setValueByOffset(newOffset: number) {
        const offset = newOffset + (newOffset >= this.offset ? this.offsetVariation : -this.offsetVariation);
        const roundFunc = offset >= this.offset ? Math.floor : Math.ceil;
        let newIndex = roundFunc(offset / this.stepPx);

        newIndex = (newIndex < 0) ? 0 : (newIndex > this.maxValueIndex) ? this.maxValueIndex : newIndex;

        if (this.valueIndex !== -1 || newIndex !== this.nearestIndex + Number(offset < this.offset)) {
            this.setValue(this.values[newIndex]);
        }
    }

    setValue(value: number) {
        if (value !== this.currentValue) {
            this.ngZone.run(() => {
                this.valueChange.emit(value);
                this.applicationRef.tick();
            });
        }
    }

    private generateValues() {
        const result = [];
        const accuracy = this.step && this.step % 1 !== 0 ? String(this.step).split('.')[1].length : 0;
        const maxValue = this.step ? this.maxValue : Math.floor(this.maxValue);

        let i = this.minValue;
        while (i < maxValue) {
            result.push(i);
            i = this.step ? Number((i + this.step).toFixed(accuracy)) : (i + this.thresholdDegree(i));
        }
        result.push(this.maxValue);         // because maxValue can be 9 999 999,99, e.g.

        this.values = result;
    }

    private updateVariables() {
        this.setMaxValueIndex();
        this.isMaximum = this.currentValue >= this.values[this.maxValueIndex];
        this.setStepOffsetAndVariation();
    }

    private setViewParams() {
        this.maxOffset = this.elementRef.nativeElement.clientWidth;
        this.linePadding = parseInt(getComputedStyle(this.elementRef.nativeElement).marginLeft, 10);
        this.setStepOffsetAndVariation();
    }

    private setStepOffsetAndVariation() {
        this.setStepPx();
        this.setOffsetVariation();
        this.setOffset();
    }

    private thresholdDegree(val: number) {
        return Math.pow(10, String(Math.floor(val)).length - this.threshold);
    }

    private setMaxValueIndex() {
        this.maxValueIndex = this.values.length - 1;
    }

    private setStepPx() {
        this.stepPx = this.maxOffset / this.maxValueIndex;
    }

    private setOffsetVariation() {
        this.offsetVariation = this.stepPx > 2 ? this.stepPx / 2 : 0;
    }

    private setOffset() {
        if (!this.values) { return; }

        this.valueIndex = this.values.indexOf(this.currentValue);

        if (this.valueIndex === -1) {
            this.calcNearestValues(this.currentValue);
        } else {
            this.offset = this.valueIndex * this.stepPx;
        }

        this.changeDetectorRef.detectChanges();
    }

    private calcNearestValues(value: number) {
        if (value === undefined || value < this.values[0]) {
            this.nearestIndex = -Infinity;
            this.offset = 0;
            return;
        }

        if (value > this.values[this.maxValueIndex]) {
            this.nearestIndex = Infinity;
            this.offset = this.maxOffset;
            return;
        }

        const thresholdDegree = this.thresholdDegree(value);
        const nearestValue = Math.floor(value / thresholdDegree) * thresholdDegree;
        this.nearestIndex = this.values.indexOf(nearestValue);
        this.offset = (this.nearestIndex + (value - nearestValue) / (this.values[this.nearestIndex + 1] - nearestValue))
            * this.stepPx;
    }
}
