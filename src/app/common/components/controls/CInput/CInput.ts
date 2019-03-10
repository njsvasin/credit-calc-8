import {
  Directive,
  ElementRef,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
  HostBinding,
  HostListener
} from '@angular/core';
import { DefaultValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IParser, IParserResult } from '../../../interface/interface';

@Directive({
  selector: '[cInput]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CInput),
      multi: true,
    }
  ]
})
export class CInput extends DefaultValueAccessor implements OnChanges, OnInit {
  @Input('formControl') control?: FormControl;
  @Input('cInput') parsers: IParser[] | IParser;
  @Input() trim = true;
  @HostBinding('class.c-input') className = true;

  constructor(
    _renderer: Renderer2,
    _elementRef: ElementRef,
    private renderer: Renderer2,
    protected elementRef: ElementRef<HTMLInputElement>
  ) {
    super(_renderer, _elementRef, null);
  }

  ngOnInit() {
    this.setTextareaClass();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.parsers && !changes.parsers.isFirstChange()) {
      this.input(this.elementRef.nativeElement);
    }
  }

  @HostListener('focus', ['$event.target'])
  focus(_element: HTMLInputElement) {
    if (this.control) {
      this.control.markAsUntouched();
    }
  }

  @HostListener('blur', ['$event.target'])
  blur(_element: HTMLInputElement) {
    this.onTouched();
  }

  @HostListener('input', ['$event.target'])
  input(element: HTMLInputElement) {
    if (this.getParsers().length > 0) {
      this.parse(element);
    }
    this.change(element.value);
  }

  writeValue(value: any) {
    this.setValue(value);
  }

  protected setValue(value: string) {
    super.writeValue(value);
  }

  protected change(value: string) {
    if (this.trim && value) {
      value = value.trim();
    }

    if ((this.control.value || '') !== (value || '')) {
      this.onChange(value);
    }
  }

  protected parse(element: HTMLInputElement) {
    const {value, selection} = this.parseValue(element.value, element.selectionEnd);

    this.setValue(value);
    // этот if нужен для ie, так как setSelectionRange в ie тригерит событие input - и получается рекурсия :-\
    // selectionEnd в IE = 13, потому нужно сравнивать, что он <= value.length
    if (element.selectionEnd !== selection && element.selectionEnd <= value.length) {
      element.setSelectionRange(selection, selection);
    }
  }

  protected parseValue(val: any, selectionEnd = 0): IParserResult {
    return this.getParsers().reduce(({value, selection}: IParserResult, parser: IParser) => {
      return parser(value, selection);
    }, {value: val, selection: selectionEnd});
  }

  protected getParsers() {
    return [].concat(this.parsers || []);
  }

  private setTextareaClass() {
    const isTextarea = this.elementRef.nativeElement.tagName === 'TEXTAREA';

    if (isTextarea) {
      this.renderer.addClass(this.elementRef.nativeElement, 'c-textarea');
    }
  }
}
