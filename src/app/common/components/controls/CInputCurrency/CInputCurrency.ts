import { Component, EventEmitter, HostBinding, Input, Output, ViewEncapsulation } from '@angular/core';
import { RcFormControl } from '../RcFormControl';

@Component({
  selector: 'c-input-currency',
  templateUrl: 'CInputCurrency.pug',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['CInputCurrency.styl']
})
export class CInputCurrency {
  @HostBinding('class.c-input-currency') className = true;
  @Input() control: RcFormControl<number>;
  @Output() blur = new EventEmitter();
}
