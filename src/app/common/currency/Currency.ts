import { Injectable } from '@angular/core';
import { ICurrency } from '../interface/interface';

@Injectable({
    providedIn: 'root'
})
export class Currency {
    public readonly RUR: ICurrency = {
        id: 'RUR',
        symbol: '₽',
        name: 'Russian Ruble',
        precision: 2,
        code: '810',
        shortName: 'RUB',
        sort: 2
    };
}
