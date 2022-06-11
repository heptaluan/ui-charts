import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import * as fromRoot from '../../../states/reducers'
import { Store } from '@ngrx/store'
import * as ProjectActions from '../../../states/actions/project.action'
import * as $ from 'jquery'

@Component({
  selector: 'lx-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Input() type: string
  @Input() pageId: string
  @Output() closeSidebarEvent = new EventEmitter()

  constructor(private _store: Store<fromRoot.State>) {
    // 获取单图项目列表
    this._store.dispatch(new ProjectActions.GetSingleChartProjectAction())
  }

  ngOnInit() {}

  closeSidebar() {
    this.closeSidebarEvent.emit()
    // 定位 topbar
    $('.topbar-padding').hide()
  }
}
