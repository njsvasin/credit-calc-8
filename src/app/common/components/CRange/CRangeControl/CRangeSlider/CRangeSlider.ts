import {
    AfterViewChecked,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CRangeValue } from '../../CRangeValue';

@Component({
    selector: 'c-range-slider',
    templateUrl: 'CRangeSlider.pug',
    styleUrls: ['CRangeSlider.styl'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CRangeSlider implements OnChanges, AfterViewChecked, OnDestroy {
    @Input() rangeValue: CRangeValue;
    @Input() offset: number;
    @Input() maxOffset: number;
    @Input() value: number;
    @Input() linePadding: number;

    @Output() move = new EventEmitter();
    @HostBinding('class.c-range-slider') className = true;

    @ViewChild('currentValue') currentValue: ElementRef<HTMLElement>;

    private destroy = new Subject();
    private mouseMove = fromEvent<MouseEvent>(document, 'mousemove');
    private mouseUp = fromEvent(document, 'mouseup');
    private touchMove = fromEvent<TouchEvent>(document, 'touchmove');
    private touchEnd = fromEvent(document, 'touchend');
    private lastOffset: number;
    private currentWidth: number;
    private prevWidth: number;

    constructor(private ngZone: NgZone) {}

    ngOnChanges({offset}: SimpleChanges) {
        if (offset && this.offset >= 0) {
            this.setValueOffsetPosition();
        }
    }

    ngAfterViewChecked() {
        this.currentWidth = this.currentValue.nativeElement.offsetWidth;

        if (this.currentWidth !== this.prevWidth && this.offset >= 0) {
            this.setValueOffsetPosition();
            this.prevWidth = this.currentWidth;
        }
    }

    ngOnDestroy() {
        this.destroy.next();
        this.destroy.complete();
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent) {
        this.lastOffset = this.offset;
        this.startMove(event);
    }

    @HostListener('touchstart', ['$event'])
    onTouchStart(event: UIEvent) {
        event.preventDefault();
        this.lastOffset = this.offset;
        this.startSwipe(event);
    }

    private startMove(mouseDownEvent: MouseEvent) {
        this.ngZone.runOutsideAngular(() => this.mouseMove.pipe(
            takeUntil(this.mouseUp.pipe(take(1))),
            takeUntil(this.destroy)
        ).subscribe(e => {
            this.move.emit(this.lastOffset + (e.clientX - mouseDownEvent.clientX));
        }));
    }

    private startSwipe(touchStartEvent: UIEvent) {
        this.ngZone.runOutsideAngular(() => this.touchMove.pipe(
            takeUntil(this.touchEnd.pipe(take(1))),
            takeUntil(this.destroy)
        ).subscribe(e => {
            this.move.emit(this.lastOffset + (e.touches[0].clientX - (touchStartEvent as TouchEvent).touches[0].clientX));
        }));
    }

    private setValueOffsetPosition() {
        const width = this.currentWidth;
        let offset = 0;

        if (this.offset - width / 2 + this.linePadding < 0) {
            offset = this.currentWidth / 2 - this.linePadding - this.offset;
        } else if (this.offset + width / 2 - this.linePadding > this.maxOffset) {
            offset = this.maxOffset - this.offset - this.currentWidth / 2 + this.linePadding;
        }

        this.currentValue.nativeElement.style.left = offset + 'px';
    }
}
