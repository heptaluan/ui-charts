import {
  Component,
  OnInit,
  Input,
  Inject,
  Output,
  EventEmitter,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core'
import { Observable } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import { DOCUMENT } from '@angular/common'
import * as _ from 'lodash'
import { preventDefault } from '../../../utils/helper'
declare var jQuery: any

type ShowList = {
  id: string
  name: string
  collected: boolean
  count: number
  imgUrl: string
}

@Component({
  selector: 'lx-dy-panel',
  templateUrl: './dy-panel.component.html',
  styleUrls: ['./dy-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DyPanelComponent implements OnInit {
  @Input() name = '图表模板合集'
  @Input() isCarousel: boolean = false // 是否需要内嵌轮播
  @Input() isNeedMoreBtn: boolean = true // 是否需要更多按钮
  @Input() showColunmNum: number = 1 // 是否单个子元素更宽，窄屏显示4个，宽屏5个
  @Input() typeArr = [] // 类型数组
  @Input() arr = [] //传进来的数组
  @Input() collectObj = null // 传递收藏状态

  @Output() collectChange = new EventEmitter<any>()
  @Output() getCollectState = new EventEmitter<any>()
  @Output() editClick = new EventEmitter<string>()
  @Output() itemClick = new EventEmitter()
  @Output() typeClick = new EventEmitter()

  @Input() showList: ShowList[] = [] // 展示的数组
  diffNum: number = 0 // 默认展示值减去差值
  perLineNum: number = 6 // 一行展示个数

  activeIndex = -1

  constructor(@Inject(DOCUMENT) private doc: Document) {}

  ngOnInit() {
    this.diffNum = this.showColunmNum - 1
    this.getPage(this.arr)
    if (this.isNeedMoreBtn) {
      this.typeArr.push({ name: '更多', id: 0 })
    }
    Observable.fromEvent(window, 'resize')
      .pipe(
        debounceTime(100) // 加点去抖，毕竟 `resize` 频率非常高
      )
      .subscribe(() => {
        this.getPage(this.arr)
      })
  }

  ngOnChanges(changes: SimpleChanges): void {
    // 收藏状态改变就改变相对应数组
    if (changes.collectObj && !changes.firstChange && this.collectObj && this.showList.length) {
      if (this.showList[this.collectObj.index]) {
        this.showList[this.collectObj.index]['collected'] = this.collectObj.collected
      }
    }
    if (changes.arr && !changes.firstChange && this.arr) {
      if (this.arr.length) {
        this.getPage(this.arr)
      }
    }
  }

  // 处理传进来的数组
  private getPage(arr: ShowList[]) {
    const clientWidth = this.doc.documentElement.clientWidth
    this.perLineNum = clientWidth > 1366 ? 6 - this.diffNum : 5 - this.diffNum
    this.showList = this.getShowList(arr)
  }

  private getShowList(arr: ShowList[]) {
    let cloneArr = _.cloneDeep(arr)
    return cloneArr.slice(0, this.perLineNum * this.showColunmNum)
  }

  getBottom(i) {
    return i < this.perLineNum && this.showColunmNum === 2 ? '24px' : '0'
  }

  handleClickType(item, index) {
    this.typeClick.emit({ item, index })
  }

  // 鼠标移入
  onMouseEnter(index: number, item: any) {
    this.activeIndex = index
    this.getCollectState.emit({ index: index, id: item.id })
  }

  // 编辑点击
  edit(item, e: Event) {
    preventDefault(e)
    this.editClick.emit(item.id)
  }

  // 收藏点击
  collect(item, e) {
    preventDefault(e)
    this.collectChange.emit({ id: item.id, collectState: !item.collected })
    if (!item.collected) {
      jQuery(function ($) {
        var img = $(e.target).parents('li').find('img').attr('src')
        var flyer = $('<img class="fly-item" src="' + img + '">')
        const target = $('.create-project .my li').eq(1)
        flyer.fly({
          start: {
            left: e.pageX,
            top: e.pageY,
          },
          end: {
            left: 71,
            top: 321,
            width: 0,
            height: 0,
          },
          speed: 1.2,
          onEnd: function () {
            flyer.remove()
            target.addClass('shake-animation')
            setTimeout(() => {
              target.removeClass('shake-animation')
            }, 600)
            target.append('<div class="top-tips">+ 1</div>')
            $('.top-tips').addClass('top-tips-animation')
            setTimeout(() => {
              $('.top-tips').remove()
            }, 1500)
          },
        })
      })
    }
  }

  // 项目点击
  handleClick(item, index) {
    this.itemClick.emit({ id: item.id, index })
  }

  imgerror(e) {
    e.srcElement.src = '/dyassets/images/share/dy-ui/load-err.svg'
  }
}
