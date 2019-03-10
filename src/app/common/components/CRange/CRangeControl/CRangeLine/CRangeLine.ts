import {
    ChangeDetectionStrategy,
    Component,
    ElementRef, EventEmitter,
    HostBinding,
    HostListener,
    Input, Output,
    ViewEncapsulation
} from '@angular/core';

@Component({
    selector: 'c-range-line',
    templateUrl: 'CRangeLine.pug',
    styleUrls: ['CRangeLine.styl'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CRangeLine {
    @Input() offset: number;
    @Input() @HostBinding('class.c-range-line_maximum') isMaximum: boolean;
    @Output() offsetChange = new EventEmitter();
    @HostBinding('class.c-range-line') className = true;

    @HostListener('click', ['$event'])
    onClick(event: MouseEvent) {
        this.offsetChange.emit(event.clientX - this.elementRef.nativeElement.getBoundingClientRect().left);
    }

    constructor(private elementRef: ElementRef<HTMLElement>) {}
}
