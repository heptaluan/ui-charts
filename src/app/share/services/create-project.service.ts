import { Injectable } from '@angular/core'
import { BsModalService } from 'ngx-bootstrap'
import * as ProjectActions from '../../states/actions/project.action'
import * as fromRoot from '../../states/reducers'
import { Store } from '@ngrx/store'
import { UpgradeMemberComponent } from '../../components/modals/upgrade-member/upgrade-member.component'
import { ContactUsModalComponent } from '../../components/modals/contact-us-modal/contact-us-modal.component'
import { ToastrService } from 'ngx-toastr'
import { VipService } from './vip.service'
import { Router } from '@angular/router'

@Injectable()
export class CreateProjectService {
  newUrl

  constructor(
    private _modalService: BsModalService,
    private _store: Store<fromRoot.State>,
    private _toastr: ToastrService,
    private _vipService: VipService,
    private _router: Router
  ) {}

  // url（获取创建项目 id 接口），type (信息图/单图)， dataL (空白模板 payload ) dataL始终为空（目前来说）， copy（是否是创建副本）
  public createProject(url, type, dataL = {}, copy = false) {
    // 用同步
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url, false)
    xhr.send(JSON.stringify(dataL))
    if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
      const data = JSON.parse(xhr.responseText)
      switch (data['resultCode']) {
        // 可以创建
        case 1000:
          const forkProjectId = data['data']['id']
          // 创建副本时不需要清空原本的描述
          if (type === 'chart' && !copy) {
            // 清空描述
            this._store.dispatch(
              new ProjectActions.ConfigChartProjectAction(forkProjectId, {
                action: 'set_description',
                description: '',
                isNoToastrTip: true,
              })
            )
          }
          this.newUrl = window.location.href.split('#')[0] + `#/pages/workspace?project=${forkProjectId}&type=${type}`
          if (dataL && dataL['infoType']) {
            let infoType = dataL['infoType']
            this.newUrl =
              window.location.href.split('#')[0] +
              `#/pages/workspace?project=${forkProjectId}&type=${type}&infoType=${infoType}`
          }
          // 更新全部项目列表
          this._store.dispatch(new ProjectActions.GetAllProjectListAction())
          if (!copy) {
            window.open(this.newUrl, '_blank')
          } else {
            // 不新开，给返回值，原页面显示提示
            this._router.navigate(['pages', 'workspace'], { queryParams: { project: forkProjectId, type: type } })
            return data['resultCode']
          }
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
          // 模板有会员权限
          this._modalService.show(UpgradeMemberComponent, {
            initialState: {
              chaeckType: 0,
              vipIds: ['7'],
              svipIds: ['7'],
            },
          })
          break

        // 创建图表也算一次数据下载  判断数据下载超限
        case 3004:
        case 3005:
          this.showUpgrade()
          break

        default:
          break
      }
      if (data['resultCode'] !== 1000) {
        return data['resultCode']
      }
    }
  }

  showProjectOverrunsModal() {
    const isVpl = this._vipService.getVipLevel()
    if (isVpl === 'None') {
      this._modalService.show(ContactUsModalComponent, {
        initialState: {
          content: '项目存储空间已满，无法继续创建新的项目。快升级到会员，体验更大存储空间吧！',
          title: {
            position: 'center',
            content: '提示',
            button: '升级',
          },
          isUpgrade: true,
          isCloseButton: true,
        },
      })
    } else if (isVpl === 'vip1') {
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
    } else if (isVpl === 'vip2') {
      this._modalService.show(ContactUsModalComponent, {
        initialState: {
          content: '高级会员最多可存储100个项目，请在「项目管理」中删除部分图表后再进行创建项目操作。',
          title: {
            position: 'center',
            content: '提示',
            button: '确定',
          },
        },
      })
    }
  }

  showUpgrade() {
    const isVpl = this._vipService.getVipLevel()
    switch (isVpl) {
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
}
