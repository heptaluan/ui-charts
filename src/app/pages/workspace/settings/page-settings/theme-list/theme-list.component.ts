import { Component, OnInit } from '@angular/core'
import * as ProjectModels from '../../../../../states/models/project.model'
import * as ProjectActions from '../../../../../states/actions/project.action'
import { UpdateProjectContent } from '../../../../../states/models/project.model'
import * as fromRoot from '../../../../../states/reducers'
import { Store } from '@ngrx/store'
import { Subscription } from 'rxjs'
import { ActivatedRoute } from '@angular/router'
import * as _ from 'lodash'
import { CommonDeleteModalComponent } from '../../../../../components/modals'
import { BsModalRef, BsModalService } from 'ngx-bootstrap'
import { take } from 'rxjs/operators'

@Component({
  selector: 'lx-theme-list',
  templateUrl: './theme-list.component.html',
  styleUrls: ['./theme-list.component.scss'],
})
export class ThemeListComponent implements OnInit {
  mySubscription = new Subscription()
  project: ProjectModels.ProjectInfo
  projectId: string
  projectType: string
  initTheme
  pageId: string
  showCheckedIndex: number = 0
  currentTheme
  themeLists: any[]

  // 弹窗组件
  bsModalRef: BsModalRef

  constructor(
    private _store: Store<fromRoot.State>,
    private _activetedRouter: ActivatedRoute,
    private _modalService: BsModalService
  ) {}

  ngOnInit() {
    this.projectId = this._activetedRouter.snapshot.queryParams.project
    this.projectType = this._activetedRouter.snapshot.queryParams.type

    if (this.projectType === 'infographic') {
      this.mySubscription
        .add(
          this._store.select(fromRoot.getCurrentProjectFull).subscribe((project) => {
            this.project = project
          })
        )
        .add(
          this._store.select(fromRoot.getCurrentProjectTheme).subscribe((themeList) => {
            if (themeList) {
              this.themeLists = themeList.themes
            }
            this._store.select(fromRoot.getCurrentProjectArticle).subscribe((article) => {
              if (article.contents.theme) {
                const index = _.findIndex(this.themeLists, { id: article.contents.theme.id })
                this.showCheckedIndex = index !== -1 ? index : 0
              }
            })
          })
        )
    } else if (this.projectType === 'chart') {
      this.mySubscription
        .add(
          this._store.select(fromRoot.getCurrentChartProjectFull).subscribe((project) => {
            this.project = project
          })
        )
        .add(
          this._store.select(fromRoot.getCurrentProjectTheme).subscribe((themeList) => {
            if (themeList) {
              this.themeLists = themeList.themes
            }
          })
        )
    }

    this.pageId = this.project.article.contents.pages[0].pageId
  }

  toggleThemeHandle(themeList, index) {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-right-theme-changed-index', index])

    // 判断之前是否勾选了不再提示
    if (localStorage.getItem('modalTipStartTime')) {
      const diffTime = this.getDiffTime(new Date().getTime(), localStorage.getItem('modalTipStartTime'))
      if (diffTime > 14) {
        this.showTipModal()
      } else {
        this.toggleTheme(themeList, index)
      }
    } else {
      this.showTipModal()
      this.bindModalCallback(themeList, index)
    }
  }

  bindModalCallback(themeList, index) {
    this._modalService.onHidden.pipe(take(1)).subscribe((r: string) => {
      if (this.bsModalRef.content.confirmFlag) {
        this.toggleTheme(themeList, index)
      }
    })
  }

  toggleTheme(themeList, index) {
    this.currentTheme = themeList
    this.showCheckedIndex = index

    const newProject = _.cloneDeep(this.project)
    const blocks = newProject.article.contents.pages[0].blocks
    const newDesign = newProject.article.contents.design
    newDesign.backgroundColor = themeList.backgroundColor
    newProject.article.contents.theme = themeList

    this.uploadDesign(newDesign)
    _.each(blocks, (block) => {
      this.loadTheme(block)
    })
    _.each(blocks, (block) => {
      if (block.type === 'chart') {
        this.updateCurBlock(block)
      }
    })

    if (this.projectType === 'infographic') {
      this._store.dispatch(
        new ProjectActions.UpdateAndExitCurrentProjectAction(this.projectId, {
          action: 'save_project',
          article: newProject.article,
          // 使用跟模版一样的操作，不记录进 undo/redo 操作池
          // type: 'fromScene'
        })
      )
    } else if (this.projectType === 'chart') {
      this._store.dispatch(
        new ProjectActions.UpdateAndExitCurrentChartProjectAction(this.projectId, {
          action: 'save_project',
          article: newProject.article,
          // type: 'fromScene'
        })
      )
    }
  }

  showTipModal() {
    this.bsModalRef = this._modalService.show(CommonDeleteModalComponent, {
      initialState: {
        content: '主题切换后将无法撤回，确定继续？',
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
        showTip: true,
      },
    })
  }

  getDiffTime(startDate, endDate) {
    var diff = Number(endDate) - Number(startDate)
    var days = Math.floor(diff / (24 * 3600 * 1000))
    return Math.abs(days)
  }

  loadTheme(block) {
    if (block.type === 'chart') {
      if (block.props.axis) {
        block.props.axis.color = this.currentTheme.axis.color
        if (block.props.axis.grid) {
          block.props.axis.grid.color = this.currentTheme.grid.color
        }
      }
      block.theme = this.currentTheme
      if (block.props.font) {
        block.props.font.color = this.currentTheme.fonts.color
        block.props.font.fontFamily = this.currentTheme.fonts.fontFamily
        block.props.font.fontSize = this.currentTheme.fonts.fontSize
      }
    }
  }

  updateCurBlock(block) {
    let newData: any = {
      target: {
        blockId: block.blockId,
        pageId: this.pageId,
        type: block.type,
        target: 'redo',
      },
      method: 'put',
      block: block,
    }
    if (this.projectType === 'infographic') {
      this._store.dispatch(new ProjectActions.UpdateCurrentProjectArticleAction(this.projectId, newData))
    } else if (this.projectType === 'chart') {
      this._store.dispatch(new ProjectActions.UpdateCurrentChartProjectArticleAction(this.projectId, newData))
    }
  }

  uploadDesign(design) {
    let newData: UpdateProjectContent = {
      target: {
        pageId: this.project.article.contents.pages[0].pageId,
        type: 'article',
        target: 'redo',
      },
      method: 'put',
      design: design,
    }
    if (this.project.type === 'infographic') {
      this._store.dispatch(new ProjectActions.UpdateCurrentProjectArticleAction(this.projectId, newData))
    } else if (this.project.type === 'chart') {
      this._store.dispatch(new ProjectActions.UpdateCurrentChartProjectArticleAction(this.projectId, newData))
    }
  }

  ngOnDestroy(): void {
    this.mySubscription.unsubscribe()
  }
}
