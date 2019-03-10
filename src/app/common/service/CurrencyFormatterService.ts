import { Injectable } from '@angular/core';
import { ICurrency, ICurrencyFormatterParseResult } from '../interface/interface';

@Injectable({
    providedIn: 'root'
})
export class CurrencyFormatterService {
    public maxWhole = 99999999999;
    public delimiter = ',';

    parse(value: number, currency?: ICurrency): ICurrencyFormatterParseResult {
        return {
            positive: this.isPositive(value),
            negative: this.isNegative(value),
            sign: this.getSign(value),
            delimiter: this.delimiter,
            whole: this.getWhole(value),
            decimal: this.hasDecimal(currency) ? this.getDecimal(value) : false
        };
    }

    hasDecimal(currency?: ICurrency) {
        return currency ? currency.precision > 0 : true;
    }

    getDecimal(value: number, size = 2) {
        return size ? ('0' + Math.round(Math.abs(value) * Math.pow(10, size)).toString()).substr(-size) : false;
    }

    getWhole(value: number) {
        const string = Math.min(Math.floor(Math.abs(value)), this.maxWhole).toString();

        let index = string.length % 3 || 3;
        let result = string.substr(0, index);

        while (index < string.length) {
            result += ' ' + string.substr(index, 3);
            index += 3;
        }

        return result;
    }

    private getSign(value: number) {
        return this.isPositive(value) ? '+' : (this.isNegative(value) ? '\u2212' : false);
    }

    private isPositive(value: number) {
        return value > 0;
    }

    private isNegative(value: number) {
        return value < 0;
    }
}
