import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: '[cRangeValue]'
})
export class CRangeValue {
    constructor(public templateRef: TemplateRef<{$implicit: number}>) {}
}
