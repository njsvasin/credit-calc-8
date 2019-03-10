import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    OnChanges,
    SimpleChanges,
    ViewEncapsulation
} from '@angular/core';
import { ICurrency, ICurrencyFormatterParseResult } from '../../interface/interface';
import { CurrencyFormatterService } from '../../service/CurrencyFormatterService';

@Component({
    selector: 'amount', // tslint:disable-line:component-selector
    templateUrl: 'Amount.pug',
    styleUrls: ['./Amount.styl'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Amount implements OnChanges {
  @Input() decimal = false;
  @Input() value: number;
  @Input() currency: ICurrency;
  @HostBinding('class.amount') className = true;

  public data: ICurrencyFormatterParseResult;

  constructor(private currencyFormatterService: CurrencyFormatterService) { }

  ngOnChanges(_changes: SimpleChanges) {
    this.data = this.currencyFormatterService.parse(this.value || 0, this.currency);
  }

  isShowSign() {
    return !!this.data.sign && !this.data.positive;
  }

  isShowDecimal() {
    return this.decimal && !!this.data.decimal;
  }
}
