import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ComponentRef } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import * as CaseActions from '../../../../states/actions/project-case.action'
import { Store } from '@ngrx/store'
import * as fromRoot from '../../../../states/reducers'
import { filter, take } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
import { API } from '../../../../states/api.service'
import { BlockComponent } from '../../../../block/block.component'
import { ChartDirective } from '../../../../block/chart.directive'
import { Observable, Subscription } from 'rxjs'
import * as ProjectModels from '../../../../states/models/project.model'
import * as ProjectActions from '../../../../states/actions/project.action'
import { DeleteUploadComponent } from '../../../../components/modals'
import { BsModalRef, BsModalService } from 'ngx-bootstrap'
import * as $ from 'jquery'
import * as _ from 'lodash'
import { DataTransmissionService } from '../../../../share/services'

export interface ComponentRefItem {
  id: any
  componentRef: ComponentRef<BlockComponent>
}

@Component({
  selector: 'lx-scene-template-item',
  templateUrl: './scene-template-item.component.html',
  styleUrls: ['./scene-template-item.component.scss'],
})
export class SceneTemplateItemComponent implements OnInit {
  @Input() templates
  @Input() favTemplates
  @Input() isFav = false
  @Output() disLike = new EventEmitter()
  @Output() selected = new EventEmitter()
  @ViewChild(ChartDirective) chartHost: ChartDirective

  project: ProjectModels.ProjectInfo
  isLike: boolean = false
  getInfoDetailTimer

  bsModalRef: BsModalRef

  infoDetailSubscription = new Subscription()
  // 跨域允许
  httpOptions = { withCredentials: true }
  selectItems: Observable<ProjectModels.ProjectContentObject[]>
  blockComponentRef: ComponentRefItem[] = []

  constructor(
    private toastr: ToastrService,
    private _store: Store<fromRoot.State>,
    private _http: HttpClient,
    private _api: API,
    private _modalService: BsModalService,
    private _dataTransmissionService: DataTransmissionService
  ) {}

  ngOnInit() {}

  // 预览新开
  preview(e, item) {
    e.stopPropagation()
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-scene-preview'])
    const tempPage = window.open('', '_blank')
    tempPage.location.href = window.location.href.split('#')[0] + '#/pages/templates/item?id=' + item.id
  }

  toggleLike(e, item) {
    e.stopPropagation()

    // 百度统计
    window['_hmt'].push(['_trackEvent', 'chart', 'createproject', 'template-like'])

    if (this.isFav) {
      this._store.dispatch(
        new CaseActions.ToggleLikeCaseAction({
          type: 'infographic',
          caseid: item.id,
          islike: 0,
        })
      )
      this.disLike.emit()
    } else {
      this.isLike = !this.isLike
      this._store.dispatch(
        new CaseActions.ToggleLikeCaseAction({
          type: 'infographic',
          caseid: item.id,
          islike: this.isLike ? 1 : 0,
        })
      )
    }
  }

  // 鼠标移入获取当前信息图详情，用来得知当前信息图的喜欢状态
  mouseEnterHandler(item) {
    if (this.isFav) {
      return
    }
    this.getInfoDetailTimer = setTimeout(() => {
      this._store.dispatch(new CaseActions.GetProjectCaseDetailAction(item.id))
      this.infoDetailSubscription.add(
        this._store
          .select(fromRoot.getProjectCaseDetail)
          .pipe(filter((data) => !!data))
          .subscribe((data) => {
            this.isLike = data.islike
          })
      )
    }, 500)
  }

  mouseLeavwHandler() {
    if (this.isFav) {
      return
    }
    clearTimeout(this.getInfoDetailTimer)
  }

  // 插入模板
  insertTemplate(item) {
    if (this.isFav) {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-insert-one-myscene'])
    } else {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-insert-scene'])
    }
    const currentProjectId = location.href.split('?project=')[1].split('&')[0]
    const url = `${this._api.getOldUrl()}/vis/dychart/case/${item.id}`
    this._http.get(url, this.httpOptions).subscribe((data) => {
      const upData = data['data']['article']
      upData['contents']['pages'][0]['pageId'] = currentProjectId
      this.bsModalRef = this._modalService.show(DeleteUploadComponent, {
        initialState: {
          content: '使用新模板将会覆盖此画布上所有的内容及数据哦！',
          deleteTitle: {
            position: 'left',
            content: '提示',
          },
          deleteActions: {
            buttons: [
              {
                title: '确定',
                action: 'confirm',
              },
              {
                title: '取消',
                action: 'cancel',
              },
            ],
          },
        },
      })
      this._modalService.onHidden.pipe(take(1)).subscribe((r: string) => {
        if (this.bsModalRef.content.confirmFlag) {
          this._store.dispatch(
            new ProjectActions.UpdateAndExitCurrentProjectAction(currentProjectId, {
              action: 'save_project',
              article: upData,
              type: 'fromScene',
            })
          )
          $('.change-page').click()
          setTimeout(() => {
            this._dataTransmissionService.sendTemplateSwitchingData(true)
            this.filterProjectFonts(upData.contents.pages[0].blocks)
          }, 100)
        }
      })
    })
  }

  filterProjectFonts(blocks) {
    const projectFonts = []
    if (!blocks) {
      return
    }
    _.each(blocks, (item, key) => {
      if (item.type === 'text') {
        if (item.props.fontFamily) {
          projectFonts.push(item.props.fontFamily)
        }
      } else {
        if (item.props.font) {
          projectFonts.push(item.props.font.fontFamily)
        }
        if (item.props.titleDisplay) {
          projectFonts.push(item.props.titleDisplay.fontFamily)
        }
        // 标签
        if (item.props.label) {
          item.props.label.textLabel && projectFonts.push(item.props.label.textLabel.fontFamily)
          item.props.label.numberLabel && projectFonts.push(item.props.label.numberLabel.fontFamily)
          item.props.label.rb_numberLabel && projectFonts.push(item.props.label.rb_numberLabel.fontFamily)
          item.props.label.rb_picLabel && projectFonts.push(item.props.label.rb_picLabel.fontFamily)
          item.props.label.rb_textLabel && projectFonts.push(item.props.label.rb_textLabel.fontFamily)
          item.props.label.timeLabel && projectFonts.push(item.props.label.timeLabel.fontFamily)
          item.props.label.nl_numberLabel && projectFonts.push(item.props.label.nl_numberLabel.fontFamily)
          item.props.label.nl_picLabel && projectFonts.push(item.props.label.nl_picLabel.fontFamily)
          item.props.label.nl_textLabel && projectFonts.push(item.props.label.nl_textLabel.fontFamily)
          item.props.label.rl_numberLabel && projectFonts.push(item.props.label.rl_numberLabel.fontFamily)
          item.props.label.rl_picLabel && projectFonts.push(item.props.label.rl_picLabel.fontFamily)
          item.props.label.rl_textLabel && projectFonts.push(item.props.label.rl_textLabel.fontFamily)
          item.props.label.pc_level1Label && projectFonts.push(item.props.label.pc_level1Label.fontFamily)
          item.props.label.pc_level2Label && projectFonts.push(item.props.label.pc_level2Label.fontFamily)
          item.props.label.pc_level3Label && projectFonts.push(item.props.label.pc_level3Label.fontFamily)
        }
      }
    })
    const filterFonts = _.uniq(projectFonts).map(function (item) {
      if (item === 'noto') {
        return (item = '"Noto Sans SC"')
      } else if (item === 'Droid Sans Fallback') {
        return (item = '"Droid Sans Fallback"')
      } else {
        return item
      }
    })
    $('body').attr('data-json', filterFonts)
  }
}
