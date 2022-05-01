import { Component, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service'
import { BsModalService } from 'ngx-bootstrap/modal'
import * as _ from 'lodash'
import { DeleteUploadComponent } from '../../../components/modals/delete-upload/delete-upload.component'
import { API } from '../../../states/api.service'
import { Observable } from 'rxjs/Observable'
import { debounceTime, catchError } from 'rxjs/operators'
import { ToastrService } from 'ngx-toastr'
import { take } from 'rxjs/operators'
import { CreateProjectService, ScrollService, WaterfallService } from '../../../share/services'
import { Store } from '@ngrx/store'
import * as fromRoot from '../../../states/reducers'
import { Subscription } from 'rxjs/Subscription'
import * as CaseActions from '../../../states/actions/project-case.action'

@Component({
  selector: 'lx-favorite-template',
  templateUrl: './favorite-template.component.html',
  styleUrls: ['./favorite-template.component.scss'],
})
export class FavoriteTemplateComponent implements OnInit {
  initSearch
  myFavoriteList = []
  showInputFlag: boolean = false
  allFavDeleteFlag: boolean = false
  isCheckedAll: boolean = false
  listIds = []
  bsModalRef: BsModalRef
  private httpOptions = { withCredentials: true }

  pageNum = 1
  totalNum = 0 // 总条数
  showSearchLoading = false // 搜索加载动画
  isStopScroll = false // 是否停止加载
  searchKeyWord = ''
  showWaterfallArr = []
  containerHeight = 0
  hoverIndex = -1
  userName: string

  getUserInfoSubscription = new Subscription()
  favInfoSubscription = new Subscription()

  constructor(
    private _http: HttpClient,
    private _modalService: BsModalService,
    private _api: API,
    private toastr: ToastrService,
    private _scrollService: ScrollService,
    private _waterfallService: WaterfallService,
    private _createProjectService: CreateProjectService,
    private _store: Store<fromRoot.State>
  ) {
    this.favInfoSubscription.add(
      this._scrollService
        .getCollectScroll()
        .pipe(debounceTime(20))
        .subscribe((res) => {
          if (res) {
            if (this.totalNum > this.myFavoriteList.length) {
              this.pageNum++
              this.getFavoriteList(this.pageNum, false, this.searchKeyWord)
            }
          }
        })
    )
  }

  ngOnInit() {
    // 窗口改变时 动态改变宽度
    Observable.fromEvent(window, 'resize')
      .pipe(
        debounceTime(100) // 加点去抖，毕竟 `resize` 频率非常高
      )
      .subscribe(async (event) => {
        const containerWidth = document.documentElement.clientWidth - 350
        if (containerWidth > 930 && this.myFavoriteList.length) {
          this.waterfallLayout()
        }
      })
    // 获取列表
    this.pageNum = 1
    this.getFavoriteList(this.pageNum, true)
    // 获取用户信息
    this.getUserInfo()
  }

  // 获取用户信息（判断是否登录）
  getUserInfo() {
    this.getUserInfoSubscription.add(
      this._store
        .select(fromRoot.getUserInfo)
        .filter((user) => !!user)
        .subscribe((user) => {
          this.userName = user.nickname || user.loginname
        })
    )
  }

  search(value) {
    if (value === undefined || value === '') {
      this.searchKeyWord = ''
    } else {
      this.searchKeyWord = value
    }
    this.pageNum = 1
    this.getFavoriteList(this.pageNum, true, this.searchKeyWord)
  }

  checkedAll(e) {
    this.isCheckedAll = e.target.checked
    if (this.isCheckedAll) {
      this.listIds = []
      this.myFavoriteList.map((item) => {
        this.listIds.push(item.caseid)
      })
    } else {
      this.listIds = []
    }
  }

  checkedOne(listId) {
    let idIndex = this.listIds.indexOf(listId)
    if (idIndex >= 0) {
      // 如果已经包含就去除
      this.listIds.splice(idIndex, 1)
    } else {
      // 如果没有包含就添加
      this.listIds.push(listId)
    }
  }

  allDelete() {
    let tip = this.listIds.length + '个'
    this.bsModalRef = this._modalService.show(DeleteUploadComponent, {
      initialState: {
        content: '删除后将无法恢复，是否要进行删除操作？',
        deleteTitle: {
          position: 'left',
          content: `确认删除${tip}模板吗?`,
        },
      },
    })
    this._modalService.onHidden.pipe(take(1)).subscribe((r: string) => {
      if (this.bsModalRef.content.confirmFlag) {
        this._http
          .post(`${this._api.caseLike()}/bulk_del`, { caseid_list: this.listIds }, this.httpOptions)
          .pipe(
            catchError((err) => {
              this.toastr.error(null, '删除失败')
              console.log(err)
              return err
            })
          )
          .subscribe((data) => {
            // this.myFavoriteList = this.myFavoriteList.filter(item => this.listIds.indexOf(item.caseid) === -1);
            // this.waterfallLayout();
            this.allFavDeleteFlag = true
            this.listIds = []
            this.toastr.success(null, '删除成功')
            // 获取列表 因为是分页的，用户可能只删除了第一页，不获取数据，用户看到的就是没有数据
            this.pageNum = 1
            this.getFavoriteList(this.pageNum, true)
          })
      }
    })
  }

  // 删除单个
  toggleLike(id) {
    this.myFavoriteList = this.myFavoriteList.filter((item) => item.caseid !== id)
    this.waterfallLayout()
    this._store.dispatch(
      new CaseActions.ToggleLikeCaseAction({
        type: 'infographic',
        caseid: id,
        islike: 0,
      })
    )
  }

  // 获取喜欢的信息图列表
  getFavoriteList(page: number = 1, isFirstPage: boolean = false, searchWord = '') {
    if (isFirstPage) {
      this.pageNum = 1
      this.showSearchLoading = true
      this.myFavoriteList.length = 0
    }
    const url = `${this._api.getFavTemplates()}?type=infographic&step=10&pagenum=${page}&title=${searchWord}`
    this._http.get(url, this.httpOptions).subscribe(async (data) => {
      if (data['resultCode'] === 1000) {
        this.totalNum = data['data']['total']
        this.myFavoriteList = !isFirstPage
          ? this.myFavoriteList.concat(data['data']['list'])
          : _.cloneDeep(data['data']['list'])
      }
      if (this.myFavoriteList.length) {
        this.waterfallLayout()
      } else {
        this.showWaterfallArr = []
      }
      this.showSearchLoading = false
    })
  }

  // 瀑布流重排
  async waterfallLayout() {
    const { data: aData, containerHeight } = await this._waterfallService.initWaterFall(this.myFavoriteList)
    this.showWaterfallArr = aData
    this.containerHeight = containerHeight
  }

  // 创建信息图副本模版 this.initialState.type
  createInfoTemplateHandle(e, id) {
    e.stopPropagation()
    if (this.userName) {
      // 判断是否可以创建
      const urla = `${this._api.getOldUrl()}/vis/dychart/fork/infographic/${id}`
      this._createProjectService.createProject(urla, 'infographic')
    } else {
      window.location.href =
        `${this._api.getOldUrl()}/vis/auth/signin.html?redirect=` +
        encodeURIComponent(window.location.href.split('#')[0] + window.location.hash)
    }
  }

  // 信息图模版预览
  previewInfo(id) {
    const tempPage = window.open('', '_blank')
    tempPage.location.href = window.location.href.split('#')[0] + '#/pages/templates/item?id=' + id
  }

  ngOnDestroy(): void {}
}
