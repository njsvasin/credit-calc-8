import { AbstractControlOptions, AsyncValidatorFn, FormControl, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';

export class RcFormControl<T> extends FormControl {
  private static uniqueId = 0;
  public errorKey: string; // маппинг контрола на ключ, под которым придёт ошибка с бека
  public id: string;
  public readonly value: T;
  public readonly valueChanges: Observable<T>;

  constructor(
    formState?: T,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super(formState, validatorOrOpts, asyncValidator);
    this.id = `RcFormControl-${RcFormControl.uniqueId++}`;
  }

  validate() {
    this.updateValueAndValidity({emitEvent: false});
  }

  setErrorKey(key: string) {
    this.errorKey = key;
    return this;
  }

  setDisabled(isDisabled: boolean, opts?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
  }) {
    if (isDisabled) {
      if (this.enabled) {
        this.disable(opts);
      }
    } else if (this.disabled) {
      this.enable(opts);
    }
  }

  setEnabled(isEnabled: boolean, opts?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
  }) {
    this.setDisabled(!isEnabled, opts);
  }

  setValueUnique(value: T, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
    emitModelToViewChange?: boolean;
    emitViewToModelChange?: boolean;
  }) {
    if (this.value !== value) {
      this.setValue(value, options);
    }
  }

  setValue(value: T, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
    emitModelToViewChange?: boolean;
    emitViewToModelChange?: boolean;
  }) {
    super.setValue(value, options);
  }
}
