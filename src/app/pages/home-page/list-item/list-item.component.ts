import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { ToastrService } from 'ngx-toastr'
import { API } from '../../../states/api.service'

import {
  PublishShareComponent,
  RenameComponent,
  UpgradeMemberComponent,
  ContactUsModalComponent,
  UploadDataModalComponent,
} from '../../../components/modals'
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service'
import { BsModalService } from 'ngx-bootstrap/modal'
import { DeleteUploadComponent } from '../../../components/modals/delete-upload/delete-upload.component'
import { take, catchError } from 'rxjs/operators'
import { Store } from '@ngrx/store'
import * as fromRoot from '../../../states/reducers'
import { VipService } from '../../../share/services/vip.service'
import { Subscription } from 'rxjs'
import * as ProjectActions from '../../../states/actions/project.action'

@Component({
  selector: 'lx-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
})
export class ListItemComponent implements OnInit {
  @Input() type
  @Input('data') listTemplates = []
  @Input() listIds
  @Output() deleteSucc = new EventEmitter()
  @Input() searchResult: boolean = false
  @Input() dataType = 'xlsx'
  @Input() currentPage = 1
  bsModalRef: BsModalRef
  isVpl: string = 'None'
  upShow: boolean = false

  allProjects$
  allProjectScription = new Subscription()
  editDataScription = new Subscription()
  mySubscription = new Subscription()

  totalLength // 信息图与单图总长度

  // 上传数据
  limitPage = 10

  hoverIndex = -1

  private httpOptions = { withCredentials: true }

  constructor(
    private _router: Router,
    private _http: HttpClient,
    private toastr: ToastrService,
    private _modalService: BsModalService,
    private _api: API,
    private _store: Store<fromRoot.State>,
    private _vipService: VipService
  ) {
    this.allProjects$ = this._store.select(fromRoot.getAllProjectList)
  }

  ngOnInit() {
    this.isVpl = this._vipService.getVipLevel()
    // 获取项目长度
    this.allProjectScription.add(
      this.allProjects$.subscribe((list) => {
        this.totalLength = list.length
      })
    )

    // 此处是分页，判断页数
    const limitMap = {
      None: 1,
      vip1: 10,
      vip2: 10,
      eip1: 100,
    }
    this.limitPage = limitMap[this.isVpl] || 1
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

  // 分享
  share(item) {
    this.bsModalRef = this._modalService.show(PublishShareComponent, {
      initialState: {
        url: window.location.href.split('#')[0] + '#/pages/store/item?id=' + item.dataId,
        title: '数据分享',
        type: 'datastore',
      },
    })
  }

  // 重命名
  rename(item) {
    this.bsModalRef = this._modalService.show(RenameComponent, {
      initialState: {
        project: item,
        type: 'upload',
      },
    })

    this._modalService.onHidden.pipe(take(1)).subscribe((r: string) => {
      if (this.bsModalRef.content.confirmFlag) {
        let renameTitle = this.bsModalRef.content.projectName.value
        this._http
          .put(`${this._api.getUploadList()}${item.id_str}/`, { title: renameTitle }, this.httpOptions)
          .pipe(
            catchError((err) => {
              this.toastr.error(null, '修改失败')
              return err
            })
          )
          .subscribe(() => {
            this.deleteSucc.emit()
            this.toastr.success(null, '修改成功')
          })
      }
    })
  }

  // 编辑数据
  editData(item) {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'chart', 'data-management', 'data-manege-upload-excel-edit'])
    this._modalService.show(UploadDataModalComponent, {
      initialState: {
        modalType: 'blank',
        dataId: item.id_str,
        option: 'edit',
      },
    })
  }

  // 制作图表
  edit(item) {
    // 判断可视化权限
    const url = `${this._api.getOldUrl()}/vis/dychart/check_data_visualization/${item.dataId}`
    this._http.get(url, { withCredentials: true }).subscribe((res) => {
      switch (res['resultCode']) {
        // 可以创建
        case 1000:
          this.createJumpToEditUrl(item.dataId)
          break

        // 项目未找到
        case 3001:
          alert(`项目未找到，请刷新后重新尝试`)
          break

        // 项目数超限
        case 3002:
        case 3003:
          this.showProjectOverrunsModal()
          break

        // 无高级 vip 以上权限
        case 2018:
          // 只有非会员和 vip1 不能一键可视化
          this._modalService.show(UpgradeMemberComponent, {
            initialState: {
              chaeckType: 1,
              vipIds: [],
              svipIds: ['10'],
            },
          })
          break

        // 下载超限 编辑项目也算一次下载量
        case 3004:
        case 3005:
          this.toastr.warning(null, '下载超限')
          this.showUpgrade()
          break

        default:
          break
      }
    })
  }

  showUpgrade() {
    switch (this.isVpl) {
      case 'None':
      case 'vip1':
        this._modalService.show(UpgradeMemberComponent, {
          initialState: {
            chaeckType: 1,
            vipIds: [],
            svipIds: ['11'],
          },
        })
        break
      case 'vip2':
        this._modalService.show(ContactUsModalComponent, {
          initialState: {
            content: '高级会员每月最多可下载100条自营数据，目前已超限，请次月下载',
            title: {
              position: 'center',
              content: '提示',
              button: '确定',
            },
          },
        })
        break
      case 'eip1':
        this._modalService.show(ContactUsModalComponent, {
          initialState: {
            content: '企业会员每月最多可下载100条自营数据，目前已超限，请次月下载',
            title: {
              position: 'center',
              content: '提示',
              button: '确定',
            },
          },
        })
        break
      case 'eip2':
        this._modalService.show(ContactUsModalComponent, {
          initialState: {
            content: '高级企业会员每月最多可下载3000条自营数据，目前已超限，请次月下载',
            title: {
              position: 'center',
              content: '提示',
              button: '确定',
            },
          },
        })
        break
      default:
        break
    }
  }

  showProjectOverrunsModal() {
    this._modalService.show(ContactUsModalComponent, {
      initialState: {
        content: '会员最多可存储100个项目，请在「项目管理」中删除部分图表后再进行创建项目操作。',
        title: {
          position: 'center',
          content: '提示',
          button: '确定',
        },
      },
    })
  }

  createJumpToEditUrl(dataId) {
    this._store.dispatch(new ProjectActions.CreateTemplateProjectAction(dataId))
    this.editDataScription.add(
      this._store.select(fromRoot.getForkTemplateProjectId).subscribe((id) => {
        if (id) {
          // 清空描述
          this._store.dispatch(
            new ProjectActions.ConfigChartProjectAction(id, { action: 'set_description', description: '' })
          )
          this._router.navigate(['pages', 'workspace'], {
            queryParams: { project: id, type: 'chart', from: 'datastore' },
          })
        }
      })
    )
  }

  newWin(url) {
    var a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('style', 'display:none')
    a.setAttribute('target', '_blank')
    a.setAttribute('rel', 'noreferrer noopener')
    document.body.appendChild(a)
    a.click()
    a.parentNode.removeChild(a)
  }

  // 一键可视化
  oneStep(item) {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'chart', 'data-management', 'data-manege-upload-click'])
    this._modalService.show(UploadDataModalComponent, {
      initialState: {
        modalType: 'blank',
        dataId: item.id_str,
      },
    })
  }

  // 取消喜欢
  dislike(id) {
    var arr = []
    arr.push(id)
    const formData = new FormData()
    formData.append('data_list', JSON.stringify(arr))
    formData.append('action', 'DELETE')
    this._http
      .post(`${this._api.getFavoriteList()}`, formData, this.httpOptions)
      .pipe(
        catchError((err) => {
          this.toastr.error(null, '取消喜欢失败')
          return err
        })
      )
      .subscribe((data) => {
        if (data['resultCode'] === 1000) {
          this.toastr.success(null, '已从「我的喜欢」移除')
          this.deleteSucc.emit()
        }
      })
    this.listIds = []
  }

  // 删除单个下载数据
  delete(item) {
    this._http
      .delete(`${this._api.getDownloadList()}${item.Id}`, this.httpOptions)
      .pipe(
        catchError((err) => {
          this.toastr.error(null, '删除失败')
          return err
        })
      )
      .subscribe((data) => {
        this.deleteSucc.emit()
        this.toastr.success(null, '删除成功')
        this.listIds = []
      })
  }

  // 删除单个上传数据
  deleteProject(id) {
    var arr = []
    arr.push(id)
    this.bsModalRef = this._modalService.show(DeleteUploadComponent, {
      initialState: {
        content: '删除后将无法恢复，是否要进行删除操作？',
        deleteTitle: {
          position: 'left',
          content: '确认删除所选的数据吗?',
        },
      },
    })
    this._modalService.onHidden.pipe(take(1)).subscribe(() => {
      // 走的是批量删除的接口
      if (this.bsModalRef.content.confirmFlag) {
        this._http
          .post(`${this._api.getUploadList()}`, { action: 'DELETE', data: arr }, this.httpOptions)
          .pipe(
            catchError((err) => {
              this.toastr.error(null, '删除失败')
              return err
            })
          )
          .subscribe(() => {
            this.deleteSucc.emit()
            this.toastr.success(null, '删除成功')
          })
        this.listIds = []
      }
    })
  }

  // 处理点击超限
  handleOverClick() {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'chart', 'data-management', 'data-manege-upload-excel-over'])
    const tempPage = window.open('', '_blank')
    tempPage.location.href = window.location.href.split('#')[0] + '#/pages/home/price'
  }

  ngOnDestroy(): void {
    this.allProjectScription.unsubscribe()
    this.editDataScription.unsubscribe()
  }
}
