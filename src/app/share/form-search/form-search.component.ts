import { Component, OnInit, ElementRef, Output, EventEmitter, Input } from '@angular/core'
import * as _ from 'lodash'
import * as $ from 'jquery'
import 'rxjs/add/observable/fromEvent'
import 'rxjs/add/operator/debounceTime'

@Component({
  selector: 'lx-form-search',
  templateUrl: './form-search.component.html',
  styleUrls: ['./form-search.component.scss'],
})
export class FormSearchComponent implements OnInit {
  typing: false
  searchArea: string = ''
  @Input('initValue') initValue = ''
  @Input('type') type
  @Output('searchValue') searchValue = new EventEmitter()
  @Input() placeholder = '搜索'
  isHome: boolean = false

  constructor(private _el: ElementRef) {}

  ngOnInit() {
    this.searchArea = this.initValue
    if (this.type === 'home') {
      this.isHome = true
      $(this._el.nativeElement.children[1])
        .children('input')
        .on(
          'keydown',
          _.debounce(() => {
            this.searchValue.emit(this.searchArea)
          }, 300)
        )
    } else {
      $(this._el.nativeElement.children[0])
        .children('input')
        .on(
          'keydown',
          _.debounce(() => {
            this.searchValue.emit(this.searchArea)
          }, 300)
        )
    }
  }

  resetSearch() {
    this.searchArea = ''
    this.searchValue.emit(this.searchArea)
  }
}
