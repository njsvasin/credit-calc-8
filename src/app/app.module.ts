import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';

import localeRu from '@angular/common/locales/ru';

import { HomePage } from './HomePage/HomePage';
import { CRange } from './common/components/CRange/CRange';
import { CRangeValue } from './common/components/CRange/CRangeValue';
import { CRangeControl } from './common/components/CRange/CRangeControl/CRangeControl';
import { CRangeLine } from './common/components/CRange/CRangeControl/CRangeLine/CRangeLine';
import { CRangeInput } from './common/components/CRange/CRangeInput';
import { CRangeSlider } from './common/components/CRange/CRangeControl/CRangeSlider/CRangeSlider';
import { CRangeScale } from './common/components/CRange/CRangeControl/CRangeScale/CRangeScale';
import { Amount } from './common/components/Amount/Amount';
import { ControlsModule } from './common/components/controls/ControlsModule';
import { CInput } from './common/components/controls/CInput/CInput';
import { CInputCurrency } from './common/components/controls/CInputCurrency/CInputCurrency';
import { CCheckbox } from './common/components/controls/CCheckbox/CCheckbox';

registerLocaleData(localeRu, 'ru');

@NgModule({
  declarations: [
    AppComponent,
    HomePage,
    CRange,
    CRangeControl,
    CRangeLine,
    CRangeSlider,
    CRangeValue,
    CRangeScale,
    CRangeInput,
    Amount,
    CInput,
    CInputCurrency,
    CCheckbox,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ControlsModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'ru' } ],
  bootstrap: [AppComponent],
})
export class AppModule { }
