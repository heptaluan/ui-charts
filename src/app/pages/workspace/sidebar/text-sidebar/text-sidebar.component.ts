import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core'
import * as _ from 'lodash'

@Component({
  selector: 'lx-text-sidebar',
  templateUrl: './text-sidebar.component.html',
  styleUrls: ['./text-sidebar.component.scss'],
})
export class TextSidebarComponent implements OnInit, OnDestroy {
  @Input() pageId: string
  styles
  @Output() closeSidebarEvent = new EventEmitter()

  textTemplates = [
    {
      title: '一级标题',
      content: '一级标题',
      styles: {
        'font-size': '14px',
      },
    },
    {
      title: '二级标题',
      content: '二级标题',
      styles: {
        'font-size': '14px',
      },
    },
    {
      title: '正文',
      content: '正文',
      styles: {
        'font-size': '12px',
      },
    },
  ]

  constructor() {}

  ngOnInit() {
    this.styles = {
      height: innerHeight - 50 + 'px',
      width: '280px',
      backgroundColor: 'transparent',
    }

    window.onresize = _.debounce((event) => (this.styles.height = innerHeight - 50 + 'px'), 500)
  }

  clickCloseBtn() {
    this.closeSidebarEvent.emit()
  }

  ngOnDestroy() {
    window.onresize = null
  }
}
