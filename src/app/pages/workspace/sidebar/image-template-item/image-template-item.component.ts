import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, SimpleChanges } from '@angular/core'
import { Store } from '@ngrx/store'
import { ActivatedRoute } from '@angular/router'
import { HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http'
import * as _ from 'lodash'

import { UtilsService } from '../../../../share/services/utils.service'
import { UpdateCurrentProjectArticleAction } from '../../../../states/actions/project.action'
import * as fromRoot from '../../../../states/reducers'
import { UpdateProjectContent } from '../../../../states/models/project.model'
import { ImageMapService } from '../../../../block/image-map.service'
import * as $ from 'jquery'
import { DeleteUploadComponent } from '../../../../components/modals/delete-upload/delete-upload.component'
import { BsModalService } from 'ngx-bootstrap/modal'
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service'
import { UpgradeMemberComponent } from '../../../../components/modals/upgrade-member/upgrade-member.component'
import { VipService } from '../../../../share/services/vip.service'
import { ContactUsModalComponent } from '../../../../components/modals'
import { API } from '../../../../states/api.service'
import { ToastrService } from 'ngx-toastr'
import { take } from 'rxjs/operators'
import { DataTransmissionService } from '../../../../share/services'

@Component({
  selector: 'lx-image-template-item',
  templateUrl: './image-template-item.component.html',
  styleUrls: ['./image-template-item.component.scss'],
})
export class ImageTemplateItemComponent implements OnInit {
  @Input() pageId: string
  @Input('data') imageTemplates
  // @Input() isShowPreview: boolean = true;
  @Input() deleteFlag
  @Input() usedCapacity
  @Input() capacity
  @Input() isHideUpload
  @Input() tabActive
  @Output() public updateSucc = new EventEmitter()
  @Output() public switchTab = new EventEmitter()
  @Output() public deleteSucc = new EventEmitter()
  @ViewChild('uploadImage') uploadImage: ElementRef

  bsModalRef: BsModalRef
  projectId: string
  isVpl: string = 'None'
  uploadImageTooltip: string = '' // ????????????????????????
  percent: number = 0
  percentStyle
  localImage: string
  isHideInput: boolean = false
  inputText: string = '????????????'

  isShowPreview: boolean = false // ????????????????????????

  // locaReviewList
  // show: ??????????????????
  // percent: ????????????
  // localImage: ?????????????????????
  // percentStyle: ????????????
  localReviewList = []

  private options = { withCredentials: true }

  constructor(
    private _utilsService: UtilsService,
    private _activateRouter: ActivatedRoute,
    private _store: Store<fromRoot.State>,
    private _http: HttpClient,
    private _imageMapService: ImageMapService,
    private _vipService: VipService,
    private _api: API,
    private _modalService: BsModalService,
    private toastr: ToastrService,
    private _dataTransmissionService: DataTransmissionService
  ) {
    this.projectId = this._activateRouter.snapshot.queryParams.project
  }

  ngOnInit() {
    // ???????????????????????????
    this.isVpl = this._vipService.getVipLevel()
    this.uploadImageTooltip = '????????????JPG???PNG???GIF???????????????????????????5M'
    this._dataTransmissionService.getImageSidebarSwitch().subscribe((res) => {
      if (res) {
        this.switchTab.emit()
        this.deleteSucc.emit()
      }
    })
  }

  // ????????????
  async onUploadImg(e) {
    e.preventDefault()
    // ????????????
    window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-upload-image'])

    const fileList: FileList = e.target.files
    const fileListL = fileList.length

    if (fileListL > 0) {
      const codeSet = new Set()
      for (let i = 0; i < fileListL; i++) {
        const num = await this.uploadSingleImg(fileList[i])
        codeSet.add(num)
      }
      this.inputText = '????????????'
      this.isHideInput = false
      this.uploadImage.nativeElement.value = ''
      // ??????5M
      if (codeSet.has(1)) {
        this._modalService.show(ContactUsModalComponent, {
          initialState: {
            content: '???????????????5M???????????????',
            title: {
              position: 'center',
              content: '??????',
              button: '??????',
            },
          },
        })
      } else if (codeSet.has(2)) {
        this.toastr.warning(null, '??????????????????')
        this.upgrade()
      } else if (codeSet.has(3)) {
        const nameMap = {
          None: '????????????',
          vip1: '??????',
          vip2: '????????????',
          eip1: '????????????',
        }
        const name = nameMap[this.isVpl]
        this._modalService.show(ContactUsModalComponent, {
          initialState: {
            content: `${name}??????????????????${this.capacity}???????????????????????????????????????????????????????????????????????????`,
            title: {
              position: 'center',
              content: '??????',
              button: '??????',
            },
          },
        })
      } else if (codeSet.has(5)) {
        this.toastr.error(null, '????????????')
      } else if (codeSet.has(4)) {
        this.toastr.success(null, '????????????')
      }
    }
  }

  /**
   * @param {string} fileList ??????????????????
   * @memberof ImageTemplateItemComponent
   */
  async uploadSingleImg(fileList) {
    const fileSize = Math.round((fileList.size / 1024 / 1024) * 100) / 100
    // ????????????????????? 5M ???????????????
    if (fileSize > 5) {
      return Promise.resolve(1)
    }

    let usedData
    let totalData
    if (this.isVpl !== 'eip2') {
      // ?????????????????????
      if (this.usedCapacity.indexOf('G') > 0) {
        usedData = Number(this.usedCapacity.split('G')[0]) * 1024
      } else if (this.usedCapacity.indexOf('M') > 0) {
        usedData = Number(this.usedCapacity.split('M')[0])
      }

      // ??????????????????
      if (this.capacity.indexOf('G') > 0) {
        totalData = Number(this.capacity.split('G')[0]) * 1024
      } else if (this.capacity.indexOf('M') > 0) {
        totalData = Number(this.capacity.split('M')[0])
      }
      // console.log(`????????????: ${usedData},?????????: ${totalData},??????????????????: ${fileSize}`);

      // ???????????????
      if (usedData + fileSize > totalData) {
        if (this.isVpl === 'None') {
          return Promise.resolve(2)
        } else {
          return Promise.resolve(3)
        }
      }
    }

    const file: File = fileList
    const reader = new FileReader()
    const formData: FormData = new FormData()
    formData.append('img_file', file, file.name)

    const that = this
    that.inputText = '???????????????'
    that.isHideInput = true

    // ????????????????????????
    reader.readAsDataURL(file)
    return new Promise((resolve, reject) => {
      reader.onload = function (event) {
        let e = event || window.event
        that.localReviewList.unshift({
          percent: 0,
          localImage: e.target['result'],
          hideProcess: false,
          percentStyle: {
            height: '100%',
          },
        })
        // angular ??????
        // const req = new HttpRequest('POST', that._api.getUserUploadImg(), formData, {
        //   reportProgress: true
        // });

        // that._http.request(req)
        //   .subscribe(event => {
        //     if (event.type === HttpEventType.UploadProgress) {

        //       that.localReviewList[i].percent = Math.round(100 * event.loaded / event.total);

        //       that.localReviewList[i].percentStyle = {
        //         'height': `${Math.round(92 - that.localReviewList[i].percent * 0.92)}px`
        //       };

        //     }
        //     if (event.type === HttpEventType.Response) {
        //         console.log("response received...", event.body);
        //         if (event.body['resultCode'] === 1000) {
        //           that.uploadImage.nativeElement.value = '';
        //           that.toastr.success(null, '????????????');
        //           if (i === length - 1) {
        //             that.inputText = '????????????';
        //             that.isHideInput = false;
        //             that.updateSucc.emit();
        //             that.localReviewList = that.localReviewList.map(item => {
        //               item.show = false;
        //               return item;
        //             })
        //           }
        //         } else {
        //           that.toastr.error(null, '????????????');
        //         }
        //     }
        //   })

        // ????????????
        const xhr = new XMLHttpRequest()
        // ????????????
        xhr.open('POST', that._api.getUserUploadImg())
        // ??????????????????
        xhr.upload.onprogress = function (event) {
          if (event.lengthComputable) {
            that.localReviewList[0].percent = Math.floor((event.loaded * 100) / event.total)
            // ??????????????????
            that.localReviewList[0].percentStyle = {
              height: `${Math.round(92 - that.localReviewList[0].percent * 0.92)}px`,
            }
          }
        }

        // ????????????
        xhr.send(formData)

        // ??????????????????????????????
        xhr.onreadystatechange = function (data) {
          if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
            const dataText = JSON.parse(data.target['response'])
            const dataCode = dataText.resultCode
            if (dataCode === 1000) {
              that.localReviewList[0].localImage = `https://${dataText['data']['img_url']}`
              that.localReviewList[0].id = dataText['data']['id']
              that.localReviewList[0].hideProcess = true
              if (that.isVpl !== 'eip2') {
                that.updateSucc.emit(Math.round((fileSize + usedData) * 100) / 100)
              }
              resolve(4)
            } else if (dataCode === 2020) {
              // ??????
              that.localReviewList.shift()
              if (that.isVpl === 'None') {
                resolve(2)
              } else {
                resolve(3)
              }
            } else {
              that.localReviewList.shift()
              resolve(5)
            }
          }
        }
      }

      reader.onerror = function (error) {
        console.log(error)
      }
    })
  }

  // ??????????????????
  deleteImg(e) {
    const id = e.currentTarget.parentElement.getAttribute('id')
    this.bsModalRef = this._modalService.show(DeleteUploadComponent, {
      initialState: {
        content: '???????????????????????????????????????????????????????????????',
        deleteTitle: {
          position: 'left',
          content: '?????????????????????????',
        },
        text: '????????????',
      },
    })
    this._modalService.onHidden.pipe(take(1)).subscribe((r: string) => {
      if (this.bsModalRef.content.confirmFlag) {
        this._http.delete(`${this._api.getUserUploadImg()}/${id}/del`, this.options).subscribe(
          () => {
            this.toastr.success(null, '????????????')
            this.deleteSucc.emit()
            this.localReviewList = []
            // if (this.localReviewList.length !== 0) {
            //   this.localReviewList.map(item => {
            //     if (item.id === id) {
            //       let img = new Image();
            //       img.src = item.localImage;
            //       img.onload = function() {
            //         // console.log(img.fileSize)
            //       }
            //     }
            //   })
            //   // this.localReviewList = this.localReviewList.filter(item => item.id !== id);
            //   // that.updateSucc.emit(Math.round((fileSize + usedData) * 100) / 100);
            // } else {
            //   this.deleteSucc.emit(id);
            // }
          },
          (error) => console.log(error)
        )
      }
    })
  }

  // ?????????????????????????????????
  upgrade() {
    this._modalService.show(UpgradeMemberComponent, {
      initialState: {
        chaeckType: 0,
        vipIds: ['6'],
        svipIds: ['6'],
      },
    })
  }

  switch() {
    this.switchTab.emit()
  }

  // ????????????
  insertImage(e, tip = 1) {
    if (this.tabActive) {
      // ????????????
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-insert-image'])
    } else {
      // ????????????
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-insert-one-myimage'])
    }
    const newBlock = _.cloneDeep(this._imageMapService.ImageBlockTemplate)

    let img_url
    if (tip === 1) {
      img_url = e.currentTarget.parentElement.getAttribute('imgSrc')
    } else {
      img_url = e.srcElement.parentElement.parentElement.children[0].currentSrc
    }
    // ????????????????????????
    const img = new Image()
    img.src = img_url
    const that = this

    img.onload = function () {
      // ??????????????? >600 ???????????? 600
      if (img.width < 600) {
        newBlock.props.size.width = img.width.toString()
        newBlock.props.size.height = img.height.toString()
      } else {
        const a = 600 / img.width
        newBlock.props.size.width = '600'
        newBlock.props.size.height = Math.round(img.height * a) + ''
      }

      newBlock.src = img_url
      that.addImage(newBlock)
      that.curSelected(newBlock)
    }
  }

  addImage(newBlock) {
    newBlock.blockId = this._utilsService.generate_uuid()
    newBlock.props.size.rotate = 0

    // ??????????????????
    // const top = Math.round($('.center-content')[0].clientHeight / 2) + $('.center-content')[0].scrollTop - 200 + 50;
    // // ?????????????????????????????????????????????????????????????????????
    // const viewWidth = $(window).width() - 50 - 160 - 242;
    // let left;
    // if ($('.page').width() < viewWidth) {
    //   left = Math.round(($('.page').width() + $('.center-content').scrollLeft()) / 2) - 250;
    // } else {
    //   left = (Math.round($('.center-content').scrollLeft()) + 450) - 150;
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

    newBlock.position = {
      top: top,
      left: left,
    }

    const newData: UpdateProjectContent = {
      target: {
        blockId: newBlock.blockId,
        pageId: this.pageId,
        type: 'image',
      },
      method: 'add',
      block: newBlock as any,
    }
    this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData))
  }

  // ??????????????????
  curSelected(newBlock) {
    const blockList = []
    const blockBoxList = $('.page').find('.block-container')
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
