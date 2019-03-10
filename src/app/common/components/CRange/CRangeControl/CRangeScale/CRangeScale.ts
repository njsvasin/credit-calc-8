import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewEncapsulation
} from '@angular/core';
import { CRangeValue } from '../../CRangeValue';
import { IScaleItem } from '../../CRangeInterface/CRangeInterface';

@Component({
    selector: 'c-range-scale',
    templateUrl: 'CRangeScale.pug',
    styleUrls: ['CRangeScale.styl'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CRangeScale implements OnChanges {
    @Input() rangeValue: CRangeValue;
    @Input() minValue: number;
    @Input() maxValue: number;
    @Input() fixedValues: number[];
    @Input() stepPx: number;
    @Output() scaleValueChange = new EventEmitter<number>();
    @HostBinding('class.c-range-scale') className = true;

    public values: IScaleItem[];

    ngOnChanges({fixedValues, stepPx, minValue, maxValue}: SimpleChanges) {
        if ((fixedValues || stepPx) && this.fixedValues && this.stepPx) {
            this.setValues();
        }

        if (minValue && this.minValue || maxValue && this.maxValue) {
            this.values = [{value: this.minValue, left: 0}, {value: this.maxValue, left: null}];
        }
    }

    onClick(value: number) {
        this.scaleValueChange.emit(value);
    }

    private setValues() {
        this.values = this.fixedValues.map((value, i) => ({
            value,
            left: i < (this.fixedValues.length - 1) && this.stepPx * i
        }));
    }
}
