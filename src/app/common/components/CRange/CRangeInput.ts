import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: '[cRangeInput]'
})
export class CRangeInput {
    constructor(public templateRef: TemplateRef<HTMLElement>) {}
}
