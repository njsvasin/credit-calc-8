import { Component, ContentChild, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CRangeValue } from './CRangeValue';
import { CRangeInput } from './CRangeInput';

/**
 using
 HTML:
     <c-range [control]="control" [minValue]="50000" [maxValue]="1500000">
         <amount *cRangeValue="let value" [value]="value" [currency]="currency" [showDecimal]="false"></amount>
         <c-input-currency *cRangeInput [control]="control" [currency]="currency"></c-input-currency>
     </c-range>

     <c-range [control]="control" [minValue]="31" [maxValue]="730" [step]="1">
         <input *cRangeInput [id]="control.id" [formControl]="control" [cInput]="parsers">
     </c-range>

     <c-range [control]="control" [fixedValues]="[31, 91, 181, 266, 730]"></c-range>

 OPTIONS priority:
     1. fixedValues
     2. minValue && maxValue && step
     3. minValue && maxValue
        * Recommended using only this cases (1 | 2 | 3).
 */
@Component({
    selector: 'c-range',
    templateUrl: 'CRange.pug',
    styleUrls: ['CRange.styl'],
    encapsulation: ViewEncapsulation.None
})
export class CRange {
    @ContentChild(CRangeValue) rangeValue: CRangeValue;
    @ContentChild(CRangeInput) inputContent: CRangeInput;
    @Input() control: FormControl;
    @Input() minValue?: number;
    @Input() maxValue?: number;
    @Input() step?: number;
    @Input() fixedValues?: number[];
    @Input() text: string;
    @HostBinding('class.c-range') className = true;

    setValue(val: number) {
        this.control.setValue(val);
        this.control.markAsTouched();
    }
}
