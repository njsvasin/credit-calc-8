import { Component, EventEmitter, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { Payments } from './payments';
import { Payment } from './payments/payment';
import { round } from './math';
import { LocalStorageService } from '../services/LocalStorageService';
import { FormControl } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { RcParsers } from '../common/components/controls/RcParsers';
import { Currency } from '../common/currency/Currency';

@Component({
  selector: 'home-page',
  providers: [
    Payments
  ],
  styleUrls: ['form.styl', 'output-results.styl', 'payments.styl', 'copyright.styl'],
  templateUrl: './HomePage.pug',
  encapsulation: ViewEncapsulation.None,
})
export class HomePage implements OnInit, OnDestroy {
  amount: string;
  interest: string;
  term: string;

  monthlyPayment: string;
  allInterestsPayments: string;
  totalAmount: string;

  payments: Payment[];

  public showSchedule = false;
  public year = new Date().getFullYear();
  public amountControl = new FormControl();
  public interestControl = new FormControl();
  public termControl = new FormControl();
  public interestParsers = [RcParsers.decimal(), RcParsers.maxLength(5)];
  public termParsers = [RcParsers.number(), RcParsers.maxLength(2)];

  private destroy = new EventEmitter();

  constructor(private paymentsService: Payments,
              private localStorageService: LocalStorageService,
              public currency: Currency,
  ) {
  }

  ngOnInit() {
    const savedValues = this.localStorageService.get('formInput');
    this.showSchedule = this.localStorageService.get('showSchedule');

    this.amountControl.valueChanges.pipe(
      takeUntil(this.destroy),
      debounceTime(300),
    ).subscribe(amount => {
      this.amount = amount;
      this.onChange();
    });

    this.interestControl.valueChanges.pipe(
      takeUntil(this.destroy),
      debounceTime(300),
    ).subscribe(interest => {
      this.interest = interest;
      this.onChange();
    });

    this.termControl.valueChanges.pipe(
      takeUntil(this.destroy),
      debounceTime(300),
    ).subscribe(term => {
      this.term = term;
      this.onChange();
    });

    if (savedValues) {
      this.amountControl.setValue(savedValues.amount);
      this.interestControl.setValue(savedValues.interest);
      this.termControl.setValue(savedValues.term);
    }
  }

  ngOnDestroy() {
    this.destroy.next();
  }

  onChange() {
    this.localStorageService.set('formInput', {
      amount: this.amount,
      interest: this.interest,
      term: this.term,
    });
    this.calc();
  }

  toggleSchedule() {
    this.showSchedule = !this.showSchedule;
    this.localStorageService.set('showSchedule', this.showSchedule);
  }

  calc() {
    const amount = parseFloat(this.amount);
    const annualInterest = parseFloat(this.interest) / 100;
    const i = annualInterest / 12;
    const n = parseFloat(this.term) * 12;

    // const annuityRatio = i / (1 - Math.pow(1 + i, -(n-1)) );
    const annuityRatio = i * Math.pow((1 + i), n) / (Math.pow(1 + i, n) - 1);

    const monthlyPayment = round(annuityRatio * amount);

    if (isFinite(monthlyPayment)) {
      this.monthlyPayment = String(monthlyPayment);
      this.allInterestsPayments = String(monthlyPayment * n - amount);
      this.totalAmount = String(monthlyPayment * n);

      this.payments = this.paymentsService.calcPayments(amount, annualInterest, monthlyPayment, n);
    } else {
      this.monthlyPayment = null;
      this.allInterestsPayments = null;
      this.totalAmount = null;
    }
  }
}
