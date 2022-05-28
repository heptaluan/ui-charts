import { Component, OnInit, Output, OnDestroy, ElementRef, EventEmitter, AfterViewInit, Input } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable, Subscription } from 'rxjs'
import * as _ from 'lodash'

import * as fromRoot from '../../../../../states/reducers'
import { ChartTemplate } from '../../../../../states/models/template.model'
import * as ProjectModels from '../../../../../states/models/project.model'
import * as $ from 'jquery'

@Component({
  selector: 'lx-toggle-icon',
  templateUrl: './toggle-icon.component.html',
  styleUrls: ['./toggle-icon.component.scss'],
})
export class ToggleIconComponent implements OnInit {
  // 当前选中图表数据
  _curBlock
  get curBlock() {
    if (this._curBlock) {
      return this._curBlock
    }
  }
  set curBlock(curBlock) {
    this._curBlock = curBlock
  }

  // 当前PageId
  curPageId: string

  @Input() blockId
  @Output() closeSidebarEvent = new EventEmitter()

  isToggleList: boolean = true

  constructor() {}

  ngOnInit() {}

  clickCloseBtn() {
    $('.right-content').css('width', '240px')
    // $('.header-container').css('padding-right', '240px')
    $('.change-page').css('right', '255px')
    this.closeSidebarEvent.emit(true)
  }

  ngOnDestroy() {
    window.onresize = null
  }
}
