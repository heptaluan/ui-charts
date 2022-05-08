import { Component, OnInit } from '@angular/core'
import { VipService } from '../../../share/services/vip.service'
import { BsModalService } from 'ngx-bootstrap/modal'
import { Observable, Subscription } from 'rxjs'
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service'
import * as fromRoot from '../../../states/reducers'
import { Store } from '@ngrx/store'
import * as ProjectActions from '../../../states/actions/project.action'
import { DeleteUploadComponent } from '../../../components/modals/delete-upload/delete-upload.component'
import * as _ from 'lodash'
import { Router } from '@angular/router'
import { API } from '../../../states/api.service'
import { ToastrService } from 'ngx-toastr'
import { debounceTime, take } from 'rxjs/operators'
import {
  ContactUsModalComponent,
  DescriptionComponent,
  PublishModalComponent,
  RenameComponent,
} from '../../../components/modals'
import { CreateProjectService, WaterfallService } from '../../../share/services'
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'lx-project-management',
  templateUrl: './project-management.component.html',
  styleUrls: ['./project-management.component.scss'],
})
export class ProjectManagementComponent implements OnInit {
  allProjectScription = new Subscription()

  // 跨域允许
  httpOptions = { withCredentials: true }
  bsModalRef: BsModalRef
  isVpl: string
  isIframe = false
  type: 'all' | 'info' | 'chart' = 'all'
  searchWord = ''
  allProjects = []
  chartProjects = []
  infoProjects = []
  containerHeight = 0
  showWaterfallArr = []
  hoverIndex = -1
  templateTotal: any = 10
  editMap
  listIds = []
  isCheckedAll: boolean = false
  bindFlag = false
  isShowMenu = false
  timer = null
  showLoading = true

  menuList = [
    {
      text: '创建副本',
      lockText: '创建副本',
      canLock: false,
      dataCollect: ['_trackEvent', 'chart', 'projectmanagement', 'project-manege-prj-clone'],
      handler: this.copyProject.bind(this),
    },
    {
      text: '重命名',
      lockText: '重命名',
      canLock: true,
      dataCollect: ['_trackEvent', 'chart', 'projectmanagement', 'project-manege-prj-rename'],
      handler: this.rename.bind(this),
    },
    {
      text: '项目描述',
      lockText: '项目描述',
      canLock: true,
      dataCollect: ['_trackEvent', 'chart', 'projectmanagement', 'project-manege-prj-description'],
      handler: this.setDescription.bind(this),
    },
    {
      text: '分享',
      lockText: '分享',
      canLock: false,
      dataCollect: ['_trackEvent', 'chart', 'projectmanagement', 'project-manege-prj-share'],
      handler: this.shareProject.bind(this),
    },
    {
      text: '锁定',
      lockText: '解锁',
      canLock: false,
      dataCollect: ['_trackEvent', 'chart', 'projectmanagement', 'project-manege-prj-lock'],
      handler: this.lockProject.bind(this),
    },
    {
      text: '删除',
      lockText: '删除',
      canLock: true,
      dataCollect: ['_trackEvent', 'chart', 'projectmanagement', 'project-manege-prj-delete'],
      handler: this.deleteProject.bind(this),
    },
  ]

  constructor(
    private _vipService: VipService,
    private modalService: BsModalService,
    private _store: Store<fromRoot.State>,
    private _router: Router,
    private _http: HttpClient,
    private _api: API,
    private toastr: ToastrService,
    private _waterfallService: WaterfallService,
    private _createProjectService: CreateProjectService
  ) {
    // 获取全部项目列表
    this._store.dispatch(new ProjectActions.GetAllProjectListAction())
    // 获取项目长度
    this.allProjectScription.add(
      this._store.select(fromRoot.getAllProjectList).subscribe((list) => {
        if (list) {
          this.handleDataFilter(list)
          this.handleData(this.allProjects)
        }
      })
    )
  }

  ngOnInit() {
    if (window.self !== window.top) {
      this.isIframe = true
      this.menuList = [
        {
          text: '重命名',
          lockText: '重命名',
          canLock: true,
          dataCollect: ['_trackEvent', 'chart', 'projectmanagement', 'project-manege-prj-rename'],
          handler: this.rename.bind(this),
        },
        {
          text: '删除',
          lockText: '删除',
          canLock: true,
          dataCollect: ['_trackEvent', 'chart', 'projectmanagement', 'project-manege-prj-delete'],
          handler: this.deleteProject.bind(this),
        },
      ]
    }
    // const num = localStorage.getItem('loginTimes');
    // if (!num) {
    //   this.modalService.show(ContactUsModalComponent, {
    //     initialState: {
    //       content: '由于镝数图表新增标签功能配置项，部分项目图表显示可能发生变化，请您及时核查关键项目显示情况并予以校准。镝数对给您造成的不便表示诚挚的歉意！',
    //       title: {
    //         position: 'center',
    //         content: '温馨提示',
    //         button: '确定'
    //       }
    //     }
    //   });
    //   localStorage.setItem('loginTimes', '1');
    // }
    this.isVpl = this._vipService.getVipLevel()
    if (this.isVpl === 'None') {
      this.templateTotal = 10
    } else if (this.isVpl === 'vip1' || this.isVpl === 'vip2') {
      this.templateTotal = 100
    }

    Observable.fromEvent(window, 'resize')
      .pipe(
        debounceTime(100) // 加点去抖，毕竟 `resize` 频率非常高
      )
      .subscribe((event) => {
        const clientWidth = document.documentElement.clientWidth - 350
        if (clientWidth >= 930) {
          const typeMap = {
            all: this.allProjects,
            info: this.infoProjects,
            chart: this.chartProjects,
          }
          this.handleData(typeMap[this.type])
        }
      })
  }

  ngAfterViewInit(): void {}

  // 筛选数据
  handleDataFilter(list) {
    if (list.length) {
      this.allProjects = list
      this.infoProjects = this.allProjects.filter((item) => item.type === 'infographic')
      this.chartProjects = this.allProjects.filter((item) => item.type === 'chart')
    } else {
      this.allProjects = []
      this.infoProjects = []
      this.chartProjects = []
    }
  }

  // 获取数据
  getDataByType(type) {
    let data = []
    switch (type) {
      case 'all':
        data = this.searchWord
          ? this.allProjects.filter((item) => item.title.indexOf(this.searchWord) > -1)
          : this.allProjects
        break
      case 'info':
        data = this.searchWord
          ? this.infoProjects.filter((item) => item.title.indexOf(this.searchWord) > -1)
          : this.infoProjects
        break
      case 'chart':
        data = this.searchWord
          ? this.chartProjects.filter((item) => item.title.indexOf(this.searchWord) > -1)
          : this.chartProjects
        break
      default:
        break
    }
    return data
  }

  // 处理 tab 点击
  handleTabClick(e) {
    this.showLoading = true
    const text = e.target.textContent
    const textMap = {
      全部: 'all',
      数据图文: 'info',
      单图: 'chart',
    }
    if (textMap[text] === this.type) {
      return
    } else {
      this.type = textMap[text]
      this.showWaterfallArr = []
    }
    switch (text) {
      case '全部':
        // 百度统计
        window['_hmt'].push(['_trackEvent', 'chart', 'projectmanagement', 'project-manege-tab-all'])
        break
      case '数据图文':
        // 百度统计
        window['_hmt'].push(['_trackEvent', 'chart', 'projectmanagement', 'project-manege-tab-inforgraphic'])
        break
      case '单图':
        // 百度统计
        window['_hmt'].push(['_trackEvent', 'chart', 'projectmanagement', 'project-manege-tab-singlechart'])
        break
      default:
        break
    }
    // 处理数据
    this.handleData(this.getDataByType(this.type))
  }

  // 处理用户可编辑项目
  handleEditData() {
    let num = 10
    if (this.isVpl === 'None') {
      num = 10
    } else if (this.isVpl === 'vip1' || this.isVpl === 'vip2') {
      num = 100
    } else if (this.isVpl === 'eip1' || this.isVpl === 'eip2') {
      num = this.allProjects.length
    }
    const data = this.allProjects.slice(0, num)
    this.editMap = {
      all: num,
      info: data.filter((item) => item.type === 'infographic').length,
      chart: data.filter((item) => item.type === 'chart').length,
    }
  }

  // 处理数据
  async handleData(data) {
    if (data.length) {
      // 处理超限
      this.handleEditData()
      const { data: aData, containerHeight } = await this._waterfallService.initWaterFall(data, true)
      this.showWaterfallArr = aData
      this.containerHeight = containerHeight
      this.showLoading = false
    } else {
      this.showWaterfallArr = []
      this.showLoading = false
    }
  }

  // 会员提示
  upgrade() {
    this._router.navigate(['pages', 'home', 'price'])
  }

  // 处理超限点击
  handleOverClick() {
    let tempPage = window.open('', '_blank')
    tempPage.location.href = window.location.href.split('#')[0] + '#/pages/home/price'
  }

  // 搜索
  search(e) {
    this.showLoading = true
    this.searchWord = e
    if (e) {
      this.showWaterfallArr = []
    }
    // 处理数据
    this.handleData(this.getDataByType(this.type))
  }

  // 编辑
  createInfoTemplateHandle(e, item) {
    e.preventDefault()
    if (this.isIframe) {
      this._router.navigate(['pages', 'workspace'], { queryParams: { project: item.id, type: item.type } })
    } else {
      if (item.editable === 'N') return
      const tempPage = window.open('', '_blank')
      if (item.type === 'infographic') {
        tempPage.location.href =
          window.location.href.split('#')[0] + '#/pages/workspace?project=' + item.id + '&type=infographic'
      } else {
        tempPage.location.href =
          window.location.href.split('#')[0] + '#/pages/workspace?project=' + item.id + '&type=chart&from=old'
      }
    }
  }

  // 预览
  previewInfo(item) {
    const tempPage = window.open('', '_blank')
    tempPage.location.href = this._api.getShareUrl() + item.private_url.split('/show/')[1]
  }

  clearListIds() {
    this.listIds.length = 0
  }

  // 多选
  checkedAll(e) {
    this.listIds.length = 0
    this.isCheckedAll = e.target.checked
    const typeMap = {
      all: this.allProjects,
      info: this.infoProjects,
      chart: this.chartProjects,
    }
    // 只需处理当前 tab 下的列表，切换之后清空 listIds
    if (this.isCheckedAll) {
      this.listIds = typeMap[this.type].map((item) => item.id)
    }
  }

  // 单选
  checkedOne(listId) {
    const idIndex = this.listIds.indexOf(listId)
    if (idIndex >= 0) {
      // 如果已经包含就去除
      this.listIds.splice(idIndex, 1)
    } else {
      // 如果没有包含就添加
      this.listIds.push(listId)
    }
    const typeMap = {
      all: this.allProjects,
      info: this.infoProjects,
      chart: this.chartProjects,
    }
    this.isCheckedAll = this.listIds.length === typeMap[this.type].length
  }

  // 多选删除
  allDelete() {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'chart', 'projectmanagement', 'project-manege-multi-delete'])
    const typeMap = {
      all: this.allProjects,
      info: this.infoProjects,
      chart: this.chartProjects,
    }
    const typeTextMap = {
      all: '项目',
      info: '信息图',
      chart: '单图',
    }
    const deleteArr = typeMap[this.type]
      .filter((item) => this.listIds.includes(item.id) && item.editable === 'Y')
      .map((item) => ({
        id: item.id,
        type: item.type,
      }))
    this.bsModalRef = this.modalService.show(DeleteUploadComponent, {
      initialState: {
        content: '删除后将无法恢复，是否要进行删除操作？',
        deleteTitle: {
          position: 'left',
          content: `确认删除${deleteArr.length}个${typeTextMap[this.type]}吗?`,
        },
        text: '删除成功',
      },
    })

    this.modalService.onHidden.pipe(take(1)).subscribe((r: string) => {
      if (this.bsModalRef.content.confirmFlag) {
        this._store.dispatch(new ProjectActions.DeleteProjectListAction({ data: deleteArr }))
        this.listIds = []
        this.showWaterfallArr = []
        this.showLoading = true
        this.isCheckedAll = false
      }
    })
  }

  toggleMenu() {
    this.isShowMenu = !this.isShowMenu
    this.bindFlag = this.isShowMenu
  }

  // 点击菜单外部
  onClickOutSide() {
    this.bindFlag = false
    this.isShowMenu = false
  }

  // 处理离开
  handleMouseLeave() {
    this.bindFlag = false
    this.isShowMenu = false
    this.timer = null
    // 目的为了 clickOutside 取消绑定事件
    this.timer = setTimeout(() => {
      this.hoverIndex = -1
    }, 0)
  }

  handleMouseEnter(index) {
    this.timer = null
    this.timer = setTimeout(() => {
      this.hoverIndex = index
    }, 0)
  }

  // 处理点击
  handleMenuClick(index, item, menu) {
    const isOver = index > this.editMap[this.type] - 1
    const locked = item.editable === 'N'

    // 没有超限
    if (!isOver) {
      // 没有超限 1.没有上锁 2.锁定 且 可以编辑的
      if (!locked || (locked && !menu.canLock)) {
        // 百度统计
        window['_hmt'].push(menu.dataCollect)
        menu.handler(item)
      }
    } else {
      // 超限 没有锁定 可以删除与编辑描述  // 锁定啥都干不了
      if (!locked && (menu.text === '删除' || menu.text === '项目描述')) {
        // 百度统计
        window['_hmt'].push(menu.dataCollect)
        menu.handler(item)
      }
    }
  }

  // 复制项目
  copyProject(item) {
    // 判断是否可以创建
    const url = `${this._api.getOldUrl()}/vis/dychart/fork/${item.type}/${item.id}`
    const code = this._createProjectService.createProject(url, item.type, {}, true)
    if (code === 1000) {
      // this._router.navigate(['pages', 'workspace'], { queryParams: { project: this.project.id, type: this.project.type } });
      this.toastr.success(null, '副本创建成功')
    }
  }

  // 重命名
  rename(item) {
    this.bsModalRef = this.modalService.show(RenameComponent, {
      initialState: {
        project: item,
        type: 'management',
      },
    })
  }

  // 项目描述
  setDescription(item) {
    this.bsModalRef = this.modalService.show(DescriptionComponent, {
      initialState: {
        project: item,
      },
    })
  }

  // 分享项目
  shareProject(item) {
    this.bsModalRef = this.modalService.show(PublishModalComponent, {
      initialState: {
        project: item,
      },
    })
  }

  // 锁定项目
  lockProject(item) {
    const url = `${this._api.getOldUrl()}/vis/dychart/${item.type === 'chart' ? 'chart' : 'project'}/${item.id}`
    const lock = item.editable === 'Y' ? 'N' : 'Y'
    const params = {
      action: 'set_editable',
      editable: lock,
    }
    this._http.put(url, params, this.httpOptions).subscribe((res) => {
      // 处理展示数组
      this.showWaterfallArr = this.showWaterfallArr.map((list) => {
        if (list.id === item.id) {
          list.editable = lock
        }
        return list
      })
      // 处理实际数组
      const arr = _.cloneDeep(this.allProjects).map((list) => {
        if (list.id === item.id) {
          list.editable = lock
        }
        return list
      })
      this.handleDataFilter(arr)
    })
  }

  // 删除
  deleteProject(item) {
    const deleteArr = [
      {
        id: item.id,
        type: item.type,
      },
    ]

    this.bsModalRef = this.modalService.show(DeleteUploadComponent, {
      initialState: {
        content: '删除后将无法恢复，是否要进行删除操作？',
        deleteTitle: {
          position: 'left',
          content: `确认删除该项目吗?`,
        },
      },
    })

    this.modalService.onHidden.pipe(take(1)).subscribe((r: string) => {
      if (this.bsModalRef.content.confirmFlag) {
        this._store.dispatch(new ProjectActions.DeleteProjectListAction({ data: deleteArr }))
        this.listIds = []
        this.showWaterfallArr = []
        this.showLoading = true
        this.isCheckedAll = false
      }
    })
  }

  // 计算进度条颜色
  getProgressColor(usedTotalNum, totalNum) {
    let progressColorType = ''
    // 用户使用空间与总空间
    const rate = usedTotalNum / totalNum
    // 占比 0 - 50% 默认
    if (rate < 0.5) {
      progressColorType = ''
    } else if (rate >= 0.5 && rate < 0.9) {
      // 占比 50% - 90% warning
      progressColorType = 'warning'
    } else {
      // 占比 90% + danger
      progressColorType = 'danger'
    }
    return progressColorType
  }

  ngOnDestroy(): void {
    this.allProjectScription.unsubscribe()
  }
}
