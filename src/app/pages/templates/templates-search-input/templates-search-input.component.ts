import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core'
import { API } from '../../../states/api.service'
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'lx-templates-search-input',
  templateUrl: './templates-search-input.component.html',
  styleUrls: ['./templates-search-input.component.scss'],
})
export class TemplatesSearchInputComponent implements OnInit {
  searchValue
  @Output() searchEmitValue = new EventEmitter()
  @ViewChild('searchInput') searchInput: ElementRef
  @Input() value

  hotSearchWords = []

  constructor(private _api: API, private _http: HttpClient) {}

  ngOnInit() {
    if (this.value) {
      this.searchValue = this.value
    }
    this._http.get(this._api.gotTemplateHotSearchWords(), { withCredentials: true }).subscribe((res) => {
      this.hotSearchWords = res['data']
    })
  }

  searchHandle() {
    this.searchEmitValue.emit(this.searchValue)
    this.searchInput.nativeElement.blur()
  }

  onKeyPress(event) {
    if (event.keyCode == '13') {
      this.searchValue = event.target.value
      this.searchInput.nativeElement.blur()
      this.searchHandle()
    }
  }

  onKeyUp(event) {
    if (window.location.href.indexOf('index') > 0) {
      return
    } else {
      this.searchValue = event.target.value
      if (this.searchValue === '') {
        this.searchEmitValue.emit(this.searchValue)
      }
    }
  }

  searchAll() {
    this.searchValue = ''
    this.searchInput.nativeElement.blur()
    this.searchHandle()
  }

  searchHotWords(item, i) {
    this.searchValue = item
    this.searchEmitValue.emit(item)
  }
}
