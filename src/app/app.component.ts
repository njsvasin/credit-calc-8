import { Component, HostBinding, ViewEncapsulation } from '@angular/core';
import { config } from 'src/config';

@Component({
  selector: 'app-credit-calc',
  templateUrl: './app.component.pug',
  styleUrls: ['./app.component.styl'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  @HostBinding('class.app-credit-calc') cssClass = true;

  public title = 'credit-calc';
  public version = config.version;
}
