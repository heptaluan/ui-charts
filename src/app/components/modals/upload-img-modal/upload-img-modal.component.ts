import { Component, OnInit, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core'
import { BsModalRef } from 'ngx-bootstrap'
import { API } from '../../../states/api.service'
import { HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http'
import { ToastrService } from 'ngx-toastr'
import { UpdateCurrentChartProjectArticleAction } from '../../../states/actions/project.action'
import { Store } from '@ngrx/store'
import * as fromRoot from '../../../states/reducers'
import * as _ from 'lodash'

@Component({
  selector: 'lx-upload-img-modal',
  templateUrl: './upload-img-modal.component.html',
  styleUrls: ['./upload-img-modal.component.scss'],
})
export class UploadImgModalComponent implements OnInit, AfterViewInit {
  title = 'Logo设置'
  desc = '建议上传不大于50K的透明底PNG格式文件，参考尺寸：100px * 40px'
  btnValue = '应用'
  selectId = '0'
  defaultImg = ``
  firstImg = ''
  secondImg = ''
  type = 'logo'
  httpOptions = { withCredentials: true }
  url = ''
  // 选择的图片地址
  selectImgUrl = ''

  oldImgUrl = ''
  oldId

  block
  curPageId
  projectId

  imgList = [
    {
      img: '',
      showDel: false,
      id: '',
      title: '默认',
    },
    {
      img: '',
      showDel: false,
      id: '',
      title: '自定义1',
    },
    {
      img: '',
      showDel: false,
      id: '',
      title: '自定义2',
    },
  ]
  @ViewChildren('uploadImg') uploadImg: QueryList<ElementRef>

  constructor(
    public bsModalRef: BsModalRef,
    private _http: HttpClient,
    private _api: API,
    private toastr: ToastrService,
    private _store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    this.url = `${this._api.getOldUrl()}/vis/dychart/watermark_and_logo`
    this.selectImgUrl = this.oldImgUrl
    this.handleType(this.type)
    // 获取用户上传的图片
    this.getUserUploadImgs()
  }

  ngAfterViewInit(): void {}

  // 关闭按钮
  close() {
    this.bsModalRef.hide()
  }

  // 处理类型
  handleType(type: string) {
    this.title = type === 'logo' ? 'Logo设置' : '水印设置'
    this.desc =
      type === 'logo'
        ? '建议上传不大于50K的透明底PNG格式文件，参考尺寸：100px * 40px'
        : '建议上传不大于50K的透明底PNG格式文件'
  }

  // 选择
  selectOption(id: string) {
    this.selectId = id
    this.imgList.forEach((item) => {
      if (item.id === id) {
        this.selectImgUrl = this.resetBgImage(item.img)
      }
      return item
    })
  }

  // 设置背景图
  setBgImage(url: string) {
    if (url) {
      return `url(${url}) no-repeat center / contain`
    } else {
      return ``
    }
  }

  // 背景图转 url
  resetBgImage(bgUrl: string) {
    return bgUrl.match(/\(([^)]*)\)/)[1]
  }

  // 处理显示删除
  handleStatus(item, flag) {
    item.show = flag
  }

  // 处理删除图片
  delImg(id) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        withCredentials: true,
        option: this.type,
      },
    }
    this._http.delete(`${this.url}/${id}`, options).subscribe(() => {
      this.toastr.success(null, '删除成功')
      // 手动清空图片
      this.imgList = this.imgList.map((item, index) => {
        if (index !== 0) {
          item.img = ''
        }
        return item
      })
      if (this.oldId === id) {
        this.selectId = '0'
        console.log(this.imgList[0].img)
        this.selectImgUrl = this.resetBgImage(this.imgList[0].img)
        console.log(this.selectImgUrl)

        this.updateCurBlock(false)
      } else {
        this.selectId = this.oldId
      }
      // 获取用户上传的图片
      this.getUserUploadImgs(true)
    })
  }

  // 获取用户上传的照片
  getUserUploadImgs(isDel = false) {
    this._http.get(`${this.url}?option=${this.type}`, this.httpOptions).subscribe((res) => {
      const imgs = res['data']
      imgs.forEach((item, index) => {
        this.imgList[index].img = this.setBgImage(item.url)
        this.imgList[index].id = item.id ? item.id : '0'
        // 默认选择哪一项
        if (item.enable && !isDel) {
          this.selectId = item.id ? item.id : '0'
          this.oldId = item.id
        }
      })
    })
  }

  // 处理上传照片
  handleImgUpload(ev: Event): void {
    ev.preventDefault()
    const fd = new FormData()
    const file = ev.target['files'][0]
    this.formattedImages(file, (img) => {
      const newFile = this.dataURLtoFile(img, file.name)
      fd.append('option', this.type)
      fd.append('img', newFile)
      this.postImage(fd)
    })
  }

  // 上传图片
  postImage(fd) {
    const req = new HttpRequest('POST', `${this.url}/`, fd, {
      reportProgress: true,
    })
    const that = this
    that._http.request(req).subscribe((event) => {
      if (event.type === HttpEventType.Response) {
        if (event.body['resultCode'] === 1000) {
          this.toastr.success(null, '上传成功')
          // 获取用户上传的图片
          this.getUserUploadImgs()
        }
      }
    })
  }

  // 应用
  updateSetting() {
    // 进来的图片地址与选择的图片地址不一样需要调用选择的连接
    if (this.selectImgUrl !== this.block.props.logoDisplay.imgUrl) {
      this._http.put(`${this.url}/${this.selectId}/`, { option: this.type }, this.httpOptions).subscribe(() => {
        this.updateCurBlock()
      })
    } else {
      this.close()
    }
  }

  // 更新 block
  updateCurBlock(flag = true) {
    const newBlock = _.cloneDeep(this.block)
    if (this.type === 'logo') {
      newBlock.props.logoDisplay.imgUrl = this.selectImgUrl
    } else {
      newBlock.props.watermarkDisplay.imgUrl = this.selectImgUrl
    }
    this.block = newBlock
    let newData: any = {
      target: {
        blockId: this.block.blockId,
        pageId: this.curPageId,
        type: this.block.type,
      },
      method: 'put',
      block: this.block,
    }
    this._store.dispatch(new UpdateCurrentChartProjectArticleAction(this.projectId, newData))
    this.toastr.success(null, '应用成功')

    if (flag) {
      this.close()
    }
  }

  // 图片转换压缩
  private formattedImages(file: File, callback: Function): void {
    if (!/\.(PNG|JPE?G|Gif|png|jpe?g|gif)(\?.*)?$/.test(file['name'])) {
      this.toastr.error(null, '仅支持上传图片文件')
      return
    }
    if (file['size'] > 5 * 1024 * 1024) {
      this.toastr.error(null, '图片不能超过5M')
      return
    }
    const reader = new FileReader()
    const that = this
    reader.readAsArrayBuffer(file)
    reader.onload = (ev) => {
      const imageSrc = (window['URL'] || window['webkitURL']).createObjectURL(new Blob([ev.target['result']]))
      const image = new Image()
      image.src = imageSrc
      image.onload = (_) => {
        var newImage = that.resizeImages(image, file.type, file.size)
        callback && callback(newImage)
      }
    }
  }

  // 图片压缩
  // 1、小于等于 300k，直接上传
  // 2、大于 300k，小于等于 1M，宽高等比压缩至原图的三分之二
  // 3、大于 1M，小于等于 5M，宽高等比压缩至原图的五分之二
  private resizeImages(img: any, type: string, size: number): string {
    let imageScale = 1
    if (size <= 300 * 1024) {
      imageScale = 1
    } else if (size >= 300 * 1024 && size <= 1 * 1024 * 1024) {
      imageScale = parseFloat((2 / 3).toFixed(2))
    } else if (size >= 1 * 1024 * 1024 && size <= 5 * 1024 * 1024) {
      imageScale = 2 / 5
    }
    const canvas = document.createElement('canvas')
    const width = img.width * imageScale
    const height = img.height * imageScale
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    canvas.width = width
    canvas.height = height
    ctx.drawImage(img, 0, 0, width, height)
    return canvas.toDataURL(type, 0.8)
  }

  // base64 转换为 file
  private dataURLtoFile(dataurl: string, filename: string): File {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  }
}
