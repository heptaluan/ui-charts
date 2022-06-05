import { Component, OnInit, Input } from '@angular/core'
import * as fromRoot from '../../../../states/reducers'
import { Store } from '@ngrx/store'
import { Subscription } from 'rxjs'
import * as ProjectActions from '../../../../states/actions/project.action'
import { ActivatedRoute } from '@angular/router'
import * as _ from 'lodash'
import * as $ from 'jquery'
import { UpdateProjectContent } from '../../../../states/models/project.model'
import { UpdateCurrentProjectArticleAction } from '../../../../states/actions/project.action'
import { UtilsService } from '../../../../share/services/utils.service'
import { take } from 'rxjs/operators'
import { BsModalService } from 'ngx-bootstrap'
import { ContactUsModalComponent } from '../../../../components/modals'

@Component({
  selector: 'lx-single-chart-template-item',
  templateUrl: './single-chart-template-item.component.html',
  styleUrls: ['./single-chart-template-item.component.scss'],
})
export class SingleChartTemplateItemComponent implements OnInit {
  @Input() data
  @Input() pageId: string
  @Input() searchText: string
  mySubscription = new Subscription()
  project
  projectId: string
  singleChartTemplatesList: any[] = []
  copySingleChartTemplatesList: any[] = []

  constructor(
    private _store: Store<fromRoot.State>,
    private _activatedRouter: ActivatedRoute,
    private _utilsService: UtilsService,
    private _modalService: BsModalService
  ) {
    this.projectId = this._activatedRouter.snapshot.queryParams.project
  }

  ngOnInit() {
    this.singleChartTemplatesList = this.data
    this.copySingleChartTemplatesList = [...this.singleChartTemplatesList]
  }

  ngOnChanges(changes): void {
    this.singleChartTemplatesList = []
    if (changes.data.currentValue) {
      this.singleChartTemplatesList = changes.data.currentValue
    }
    _.each(this.copySingleChartTemplatesList, (item) => {
      if (changes.searchText && _.includes(item.title, changes.searchText.currentValue)) {
        this.singleChartTemplatesList.push(item)
      }
    })
  }

  insertSingleChartHandle(item) {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-insert-one-mychart'])
    // 根据 id 获取单图详情
    this._store.dispatch(new ProjectActions.GetSingleChartInfoAction(item.id, 'chart'))
    this.mySubscription.add(
      this._store
        .select(fromRoot.getCurrentChartProjectFull)
        .filter((project) => !!project && project.id === item.id)
        .pipe(take(1))
        .subscribe((project) => {
          if (project) {
            this.project = project
            this.insertChart(project.article.contents.pages[0].blocks[0])
          }
        })
    )
  }

  insertChart(data) {
    if (!data) {
      this._modalService.show(ContactUsModalComponent, {
        initialState: {
          content: ' 不可插入空白单图项目',
          title: {
            position: 'center',
            content: '提示',
            button: '确定',
          },
        },
      })
      return
    }
    let block = _.cloneDeep(data)
    block.projectId = this.projectId
    block.blockId = this._utilsService.generate_uuid()

    // 位置视野居中
    // let top = Math.round($('.center-content')[0].clientHeight / 2) + $('.center-content')[0].scrollTop - 46 - 66 - 200 + 50;
    // let viewWidth = $(window).width() - 50 - 160 - 242;
    // let left;
    // if ($('.page').width() < viewWidth) {
    //   left = Math.round(($('.page').width() + $('.center-content').scrollLeft()) / 2) - 250
    // } else {
    //   left = (Math.round($('.center-content').scrollLeft()) + 450) - 150
    // }

    let scale: number = Number.parseInt(document.querySelector('.page-size span').innerHTML)
    let left, top
    left = Math.round($('.center-content').scrollLeft() / (scale / 100)) + 200
    top = Math.round($('.center-content')[0].scrollTop / (scale / 100)) + 200

    if (scale < 100) {
      left = left + 100 * (scale / 100)
      top = top + 100 * (scale / 100)
    } else {
      left = left - 100 * (scale / 100)
      top = top - 100 * (scale / 100)
    }

    block.position = {
      top: top,
      left: left,
    }

    let newData: UpdateProjectContent = {
      target: {
        blockId: block.blockId,
        pageId: this.pageId,
        type: block.type,
      },
      method: 'add',
      block: block,
    }

    this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData))

    // 让当前新插入的图表选中
    this.curBlockSelected(block)
  }

  // 选中当前图表
  curBlockSelected(newBlock) {
    let blockList = []
    let blockBoxList = $('.page').find('.block-container')
    setTimeout(() => {
      blockBoxList.each((k, v) => {
        blockList.push($(v).attr('chartid'))
      })
      const index = blockList.findIndex((x) => x === newBlock.blockId)
      if (index !== -1) {
        $(blockBoxList[index]).click()
      }
    }, 300)
  }
}
