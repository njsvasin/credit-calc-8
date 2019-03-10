import { Directive, ElementRef, forwardRef, HostListener, Input, Renderer2 } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ICurrency } from '../../../interface/interface';
import { CurrencyFormatterService } from '../../../service/CurrencyFormatterService';
import { RcParsers } from '../RcParsers';
import { CInput } from '../CInput/CInput';

@Directive({
  selector: '[cInputCurrencyAccessor]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CInputCurrencyAccessor),
      multi: true
    }
  ]
})
export class CInputCurrencyAccessor extends CInput {
  @Input('cInputCurrencyAccessor') currency: ICurrency;
  @Input() decimal: boolean;

  private prevValue: string;

  constructor(_renderer: Renderer2, _elementRef: ElementRef, private currencyFormatterService: CurrencyFormatterService) {
    super(_renderer, _elementRef, _renderer, _elementRef);
  }

  @HostListener('mousedown', ['$event.target'])
  mouseDown(element: HTMLInputElement) {
    this.prevValue = element.value;
  }

  @HostListener('keydown', ['$event.target'])
  keyDown(element: HTMLInputElement) {
    this.prevValue = element.value;
  }

  focus(element: HTMLInputElement) {
    super.focus(element);

    const value = element.value;

    if (value.length > 0) {
      let newValue = value;
      if (newValue.indexOf(',') !== -1) {
        newValue = newValue.replace(/0+$/g, '');
      }
      if (newValue.endsWith(',')) {
        newValue = newValue.replace(',', '');
      }

      this.setValue(newValue);
    }
  }

  blur(element: HTMLInputElement) {
    super.blur(element);

    let newValue = element.value;

    if (newValue.length > 0) {
      newValue = newValue.replace(/ /g, '');
      this.writeValue(this.getAmount(newValue));
    }
  }

  writeValue(value: number) {
    if (typeof value === 'number') {
      const parse = this.currencyFormatterService.parse(value, this.currency);

      super.writeValue(parse.whole + (this.decimal && parse.decimal ? `,${parse.decimal}` : ''));
    } else {
      super.writeValue('');
    }
  }

  protected change(value: string) {
    const resultValue = value === '' ? null : this.getAmount(value);

    if (this.control.value !== resultValue) {
      this.writeValue(resultValue);

      this.onChange(resultValue);
    }
  }

  protected getParsers() {
    return super.getParsers().concat(
      RcParsers.notAllowed(/[^\d.,]/g),
      (value: string, selection: number) => this.parseCurrency(value, selection)
    );
  }

  private getAmount(value: string) {
    return +value.replace(',', '.').replace(' ', '');
  }

  private parseCurrency(value: string, selection: number) {
    const hasDecimal = this.decimal && this.currencyFormatterService.hasDecimal(this.currency);
    const maxWhole = this.currencyFormatterService.maxWhole;
    let countRemoved = 0;

    value = value.replace(/\./g, ',');
    // удаляем лишние запятые
    while (value.indexOf(',') !== value.lastIndexOf(',')) {
      value = value.substr(0, value.lastIndexOf(',')) + value.substr(value.lastIndexOf(',') + 1);
    }
    // если дроби быть не может - вырезаем её
    if (value.indexOf(',') !== -1 && !hasDecimal) {
      value = value.substr(0, value.indexOf(','));
    }
    // обрезаем лишние символы после сотой дроби
    if (value.indexOf(',') !== -1) {
      value = value.substr(0, value.indexOf(',') + 3);
    }
    // удаляем ведущие нули
    while (value.startsWith('0') && value !== '0') {
      value = value.substr(1);
      countRemoved++;
    }
    // ставим 0 перед запятой, если с неё начали писать
    if (value.startsWith(',')) {
      value = '0' + value;
      countRemoved--;
    }
    // ставим запятую сразу после 0
    if (value === '0') {
      if (this.prevValue === '0,') {
        value = '';
        countRemoved++;
      } else if (hasDecimal) {
        value = '0,';
        countRemoved--;
      }
    }
    // физическое ограничение длины числа
    const split = value.split(',');

    if (split[0].length > maxWhole.toString().length) {
      value = split[0].substr(0, maxWhole.toString().length);

      if (split[1]) {
        value += ',' + split[1];
      }
    }

    return RcParsers.getResult(value, selection, countRemoved);
  }
}
