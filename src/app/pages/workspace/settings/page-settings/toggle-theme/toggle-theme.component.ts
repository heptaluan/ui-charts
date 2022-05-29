import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  OnDestroy,
  ElementRef,
  EventEmitter,
  AfterViewInit,
  SimpleChanges,
} from '@angular/core'
import { Store } from '@ngrx/store'
import * as _ from 'lodash'
import * as fromRoot from '../../../../../states/reducers'
import * as $ from 'jquery'

@Component({
  selector: 'lx-toggle-theme',
  templateUrl: './toggle-theme.component.html',
  styleUrls: ['./toggle-theme.component.scss'],
})
export class ToggleThemeComponent implements OnInit {
  @Output() closeSidebarEvent = new EventEmitter(true)
  toggleThemeBoxStyles
  toggleThemeStyles

  constructor(private _store: Store<fromRoot.State>, private el: ElementRef) {}

  ngOnInit() {
    this.toggleThemeBoxStyles = {
      height: innerHeight - 80 + 'px',
    }

    this.toggleThemeStyles = {
      height: innerHeight - 40 + 'px',
    }
  }

  ngAfterViewInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
  }

  clickCloseBtn() {
    $('.right-content').css('width', '240px')
    $('.change-page').css('right', '255px')
    this.closeSidebarEvent.emit(true)
  }
}
