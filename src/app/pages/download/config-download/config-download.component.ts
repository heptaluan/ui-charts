import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core'
import * as $ from 'jquery'
import * as _ from 'lodash'
import { BsModalService, BsModalRef } from 'ngx-bootstrap'
import {
  UpgradeMemberComponent,
  ExportToPhoneModalComponent,
  ProgressComponent,
  BusinessPriceComponent,
} from '../../../components/modals'
import { VipService } from '../../../share/services/vip.service'
import { ActivatedRoute } from '@angular/router'
import { API } from '../../../states/api.service'
import { HttpClient } from '@angular/common/http'
import { DataTransmissionService } from '../../../share/services/data-transmission.service'
declare const domtoimage: any
declare function unescape(s: string): string
declare function escape(s: string): string
import { NotifyChartRenderService } from '../../../share/services/notify-chart-render.service'
import { downloadZipImage, handleBaiduCollect } from './helper'
import { catchError, map } from 'rxjs/operators'
import { ToastrService } from 'ngx-toastr'
import { of } from 'rxjs/observable/of'

type exportType = 'jpg' | 'png' | 'svg' | 'gif' | 'mov' | 'png' | 'mp4'

@Component({
  selector: 'lx-config-download',
  templateUrl: './config-download.component.html',
  styleUrls: ['./config-download.component.scss'],
})
export class ConfigDownloadComponent implements OnInit, OnChanges {
  bgTransparent = false
  showLogo = true
  size: number = 0
  type: string
  isVpl: string
  @Input('projectName') projectName: string = ''
  @Output('watermark') watermark = new EventEmitter()
  @Output('toggleTransparent') toggleTransparent = new EventEmitter()
  @Output('scaleChange') scaleChange = new EventEmitter()
  @Input('project') project: any
  projectType: 'chart' | 'infographic'
  chooseType: exportType = 'jpg'
  isTransparentShow: boolean = false
  isSizeShow: boolean = true
  isMp4SettingsShow: boolean = false

  isRetry: boolean = false

  bsModalRef: BsModalRef

  // 当前下载量 / 最大下载量
  curDownloadNum: number = 0
  maxDownloadNum: number = 0

  // 展示升级会员
  showUpgradeButton: boolean = false

  // 是否展示导出量
  isShowExportNum: boolean = true

  // 导出图片大小
  exportImgW = 600
  exportImgH = 510

  // 导出图片原始大小
  imgInitW = 600
  imgInitH = 510

  // 导出图片倍数
  dropdowImgSizeList = ['原始尺寸', 'x2', 'x3', 'x4', '自定义']
  dropdowImgSizeListIndex = 0

  // 导出视频尺寸
  dropdownMp4SizeList = ['480p', '720p']
  dropdownMp4SizeListIndex = 0

  // 导出视频帧率
  dropdownMp4QualityList = ['12fps', '24fps', '30fps']
  dropdownMp4QualityListIndex = 0

  // 是否导出到手机
  isExportToPhone: boolean = false

  // 当前的 base64
  currentBase64: string

  // 新增动态图表相关配置
  showDynamicChatAnimation: boolean = false
  animationData: any
  animationTimeInterval: any
  startTime: any
  endTime: any

  totalTime

  // 导出计数器
  exportTimer = null

  constructor(
    private modalService: BsModalService,
    private _vipService: VipService,
    private _dataTransmissionService: DataTransmissionService,
    private _router: ActivatedRoute,
    private _api: API,
    private _http: HttpClient,
    private _notifyChartRenderService: NotifyChartRenderService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    $('.loading-box').hide()

    this.projectType = this._router.snapshot.queryParams.type
    this.isVpl = this._vipService.getVipLevel()

    // 获取当前下载数
    this.getUserCurDownloadNum()

    // 获取重试
    this._dataTransmissionService.getRetryStatus().subscribe((res) => {
      if (res === 'retry') {
        this.isRetry = true
        this.download(this.isExportToPhone)
      } else if (res === 'clear') {
        this.isRetry = false
      }
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.project && changes.project.currentValue) {
      const value = changes.project.currentValue
      this.exportImgW = value.article.contents.design.width
      this.exportImgH = value.article.contents.design.height
      this.imgInitW = value.article.contents.design.width
      this.imgInitH = value.article.contents.design.height
    }
    if (!this.project && changes.project.currentValue) {
      this.initDynamicChartData(_.cloneDeep(changes.project.currentValue))
    } else if (this.project) {
      this.initDynamicChartData(_.cloneDeep(this.project))
    }
  }

  // 动态图表处理
  initDynamicChartData(project) {
    const block = project.article.contents.pages[0].blocks[0]
    if (!block) return
    const temId = block.templateId
    if (
      temId === '8000000011111111001' ||
      temId === '8000000011111111002' ||
      temId === '8000000011111111003' ||
      temId === '8000000011111111004'
    ) {
      if (this.projectType === 'chart') {
        this.showDynamicChatAnimation = true
      }

      // 动画时间轴
      let mapIndex =
        block.props.map[0][
          _.findIndex(block.props.map[0], (o: any) => {
            return o.function === 'timeCol'
          })
        ]
      mapIndex = mapIndex ? mapIndex.index : 0
      // 圆堆积要去重
      if (temId === '8000000011111111004') {
        this.animationData = _.uniq(_.unzip(block.dataSrc.data[0])[mapIndex].slice(1))
      } else {
        this.animationData = _.unzip(block.dataSrc.data[0])[mapIndex].slice(1)
      }

      this.animationTimeInterval = block.props.timerControl.frameDuration

      // 更新起止时间
      this.startTime = Math.ceil(Number(block.props.animation.startDelay))
      this.endTime = Math.ceil(Number(block.props.animation.endPause))

      this.totalTime = this.handleDynamicTime(block)
      console.log(this.totalTime)
    }
  }

  handleProceeChange(e) {
    this._notifyChartRenderService.sendChartRender(e)
  }

  handleButtonClick(e) {
    if (e) {
      this._notifyChartRenderService.sendChartRender(true)
    } else {
      this._notifyChartRenderService.sendChartRender(false)
    }
  }

  handleClearD3ChartTimer(e) {
    this._notifyChartRenderService.sendChartRender(e)
  }

  handleTimeEndRender(e) {
    this._notifyChartRenderService.sendChartRender(e)
  }

  // 切换类型
  selectType(index, e = null) {
    switch (index) {
      case 0:
        this.chooseType = 'jpg'
        this.isTransparentShow = false
        this.isSizeShow = true
        this.isMp4SettingsShow = false
        break
      case 1:
        this.chooseType = 'png'
        this.isTransparentShow = true
        this.isSizeShow = true
        this.isMp4SettingsShow = false
        break
      case 2:
        this.chooseType = 'svg'
        this.isTransparentShow = false
        this.isSizeShow = false
        this.isMp4SettingsShow = false
        break
      case 3:
        this.chooseType = 'gif'
        this.isTransparentShow = false
        this.isSizeShow = false
        this.isMp4SettingsShow = false
        break
      case 4:
      case 5:
        if (this.isVpl === 'eip1' || this.isVpl === 'eip2') {
          this.chooseType = index === 4 ? 'mp4' : 'mov'
          // 调整宽高
          this.isSizeShow = false
          this.isTransparentShow = false
          this.isMp4SettingsShow = true
          this.resetSize()
        } else {
          e.preventDefault()
          // 升级企业会员
          this.modalService.show(BusinessPriceComponent)
          return
        }
        break
      default:
        break
    }
    // 重置大小
    this.resetSize(this.chooseType)
    // 重置透明度
    this.resetTransparent(this.chooseType)
  }

  // 处理用户输入的宽高
  handleUserChange(e) {
    this.exportImgH = e.value0
    this.exportImgW = e.value1
    this.dropdowImgSizeListIndex = 4
  }

  // 判断是否改变透明度
  resetTransparent(type) {
    // 如果切换到 mov 透明底不是勾选状态, 打开透明底
    if (type === 'mov' && !this.bgTransparent) {
      this.transparentSwitch()
    } else if (this.bgTransparent && type !== 'mov') {
      // 只要透明底是勾选，并且不是 mov, 关闭透明底
      this.transparentSwitch()
    }
  }

  // mp4 宽高
  resetSize(type = 'mp4', size = 480) {
    if (type === 'mp4' || type === 'mov') {
      this.exportImgH = size
      this.exportImgW = Math.floor((this.exportImgH * this.imgInitW) / this.imgInitH)
    } else {
      this.exportImgH = this.imgInitH
      this.exportImgW = this.imgInitW
    }
  }

  // 下载前需调用用户下载数量
  download(isPhone: boolean) {
    this.isExportToPhone = isPhone
    this.verifyUserCurDownloadNum('permission_verify').subscribe((res) => {
      if (res['resultCode'] === 1000) {
        this.exportImage()
      } else {
        if (this.isVpl === 'None') {
          this.upgrade(1)
        } else {
          return false
        }
      }
    })
  }

  exportImage() {
    // 验证可下载权限后 导出时埋点
    handleBaiduCollect(
      this.isExportToPhone,
      this.chooseType,
      this.projectType,
      this.project && this.project.templete_id,
      this.project.templete_id === '0'
    )

    if (!this.isExportToPhone && this.chooseType !== 'mp4' && this.chooseType !== 'mov') {
      // 加载中
      $('.loading-box').show()
    }

    // 过滤当前 project 中所使用的字体
    this.filterProjectFonts()

    // 使当前比例恢复 100%
    $('.page-container').css('transform', 'scale(1)')

    // 截图
    setTimeout(() => {
      this.type = this.chooseType
      if (this.isExportToPhone && !this.isRetry) {
        this.bsModalRef = this.modalService.show(ProgressComponent, {
          ignoreBackdropClick: true,
        })
      }
      switch (this.chooseType) {
        case 'jpg':
          this.toImage('jpg', this.bgTransparent, this.exportImgW, this.exportImgH)
          break
        case 'png':
          this.toImage('png', this.bgTransparent, this.exportImgW, this.exportImgH)
          break
        case 'svg':
          this.downloadSvg('svg')
          break
        case 'gif':
          this.downloadGIF()
          break
        case 'mp4':
        case 'mov':
          this.downloadMp4()
          break
        default:
          break
      }
    }, 300)
  }

  // 将 jpg / png 转成 blob
  toImage(type, isTransparent, width, height) {
    let isOpacity = isTransparent ? null : '#fff'
    const that = this
    const scale: number = Number.parseInt(document.querySelector('.page-size span').innerHTML) / 100
    if (type === 'jpg') {
      domtoimage
        .toJpeg($('.page-box')[1], {
          width: width,
          height: height,
          quality: 0.5,
          style: {
            'transform-origin': '0 0',
            transform: `scale(${Number(that.exportImgW / this.imgInitW) / scale}, ${
              Number(that.exportImgH / this.imgInitH) / scale
            })`,
            'background-color': '#fff',
          },
        })
        .then(function (blob) {
          if (blob) {
            // 如果不是导出到手机
            if (!that.isExportToPhone) {
              let isError = false
              // try {
              //   const a = document.createElement('a')
              //   a.href = window.URL.createObjectURL(blob);
              //   a.download = that.projectName + '.jpg' || 'download.jpg';
              //   a.click();
              // } catch (error) {
              //   isError = true;
              //   that.toastr.error(null, '下载失败');
              // }
              try {
                that.downloadFile(that.projectName + '.jpg' || 'download.jpg', blob)
              } catch (error) {
                isError = true
                that.toastr.error(null, '下载失败')
              }
              $('.loading-box').hide()

              if (!isError) {
                // 计下载数
                that.downloadImageSuccCallback()
              }
            } else {
              that.uploadImg(that.base64ToBlob(blob))
            }
          } else {
            that.toastr.error(null, '下载失败！可尝试调小画布的输出宽高')
            if (that.isExportToPhone) {
              that._dataTransmissionService.saveProcess('fail')
            } else {
              $('.loading-box').hide()
            }
          }
        })
    } else if (type === 'png') {
      domtoimage
        .toBlob($('.page-box')[1], {
          width: width,
          height: height,
          style: {
            'transform-origin': 'top left',
            transform: `scale(${Number(that.exportImgW / this.imgInitW) / scale}, ${
              Number(that.exportImgH / this.imgInitH) / scale
            })`,
            background: isOpacity,
          },
        })
        .then(function (blob) {
          if (blob) {
            let isError = false
            if (!that.isExportToPhone) {
              try {
                const a = document.createElement('a')
                a.href = window.URL.createObjectURL(blob)
                a.download = that.projectName + '.png' || 'download.png'
                a.click()
                $('.loading-box').hide()
              } catch (error) {
                isError = true
                that.toastr.error(null, '下载失败')
              }
              $('.loading-box').hide()

              if (!isError) {
                // 计下载数
                that.downloadImageSuccCallback()
              }
            } else {
              that.uploadImg(blob)
            }
          } else {
            that.toastr.error(null, '下载失败！可尝试调小画布的输出宽高')
            if (that.isExportToPhone) {
              that._dataTransmissionService.saveProcess('fail')
            } else {
              $('.loading-box').hide()
            }
          }
        })
    }
  }

  //下载
  downloadFile(fileName, content) {
    let aLink = document.createElement('a')
    let blob = this.base64ToBlob(content) //new Blob([content]);

    let evt = document.createEvent('HTMLEvents')
    evt.initEvent('click', true, true) //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
    aLink.download = fileName
    aLink.href = URL.createObjectURL(blob)

    // aLink.dispatchEvent(evt);
    //aLink.click()
    aLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window })) //兼容火狐
  }

  //base64转blob
  base64ToBlob(code) {
    let parts = code.split(';base64,')
    let contentType = parts[0].split(':')[1]
    let raw = window.atob(parts[1])
    let rawLength = raw.length

    let uInt8Array = new Uint8Array(rawLength)

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i)
    }
    return new Blob([uInt8Array], { type: contentType })
  }

  // 下载到本地
  downloadPC(base64) {
    const a = document.createElement('a')
    a.href = base64
    a.download = this.projectName + '.' + this.chooseType || 'download.' + this.chooseType
    a.click()
    $('.loading-box').hide()
  }

  // 导出 gif
  downloadGIF() {
    // this._dataTransmissionService.saveGIF('saveGIF');
    this._notifyChartRenderService.sendChartSpeed(1)
    const block = this.project.article.contents.pages[0].blocks[0]
    // 获取元素
    const elementToRecord = document.querySelectorAll('.page-box')[1]
    let imageList = []

    const that = this
    const animation = block.props.animation
    const totalTime = Number(animation.duration) + Number(animation.endPause)
    // 0.1s截屏多少张
    const intervalTime = 0.1
    const intervalNumber = totalTime / intervalTime

    // 时间间隔
    const imgInterval = setInterval(() => {
      getBase64(elementToRecord, function (data) {
        imageList.push(data)
      })

      if (imageList.length >= intervalNumber) {
        clearInterval(imgInterval)
        createGIF()
        return
      }
    }, intervalTime * 1000)

    // const getBase64 = function (el, callback) {
    //   const dom = el;
    //   const box = window.getComputedStyle(dom);
    //   const width = Number.parseInt(box.width, 10);
    //   const height = Number.parseInt(box.height, 10);

    //   // 将节点转成svg，放进数组 imageList
    //   callback(that.makeSvgDataUri(dom, width, height));
    // };

    const getBase64 = (el, cb) => {
      const dom = el
      const box = window.getComputedStyle(dom)
      const width = Number.parseInt(box.width, 10)
      const height = Number.parseInt(box.height, 10)
      domtoimage.impl.options.isGIF = true

      // 节点转成jpg
      domtoimage
        .toBlob($('.page-box')[1], {
          width: width,
          height: height,
          quality: 0.5,
          style: {
            // 'transform-origin': '0 0',
            // 'transform': `scale(${Number(that.exportImgW / this.imgInitW)}, ${Number(that.exportImgH / this.imgInitH)})`,
            'background-color': '#fff',
          },
        })
        .then((blob) => {
          domtoimage.impl.options.isGIF = false
          that.blobToDataURL(blob, cb)
        })
        .catch((err) => {
          console.log(err)
          that._dataTransmissionService.saveProcess('fail')
        })
    }

    const createGIF = function () {
      // gif.js
      // const url = window.location.origin + "/dyassets/js/gif.worker.js";
      // const gif = new window['GIF']({
      //   workers: 2,
      //   quality: 1,
      //   workerScript: url,
      //   background: 'red',
      //   transparent: true,
      //   repeat: -1
      // });
      // imageList.forEach((item, index) => {
      //   const img = new Image();
      //   img.src = item;
      //   img.onload = function() {
      //     gif.addFrame(img, { delay: 100 });
      //     if (index === imageList.length -1) {
      //       gif.on('finished', function (blob) {
      //         $('.loading-box').hide();

      //         // 如果不是导出到手机
      //         // if (!that.isExportToPhone) {
      //         //   const a = document.createElement('a')
      //         //   a.href = URL.createObjectURL(blob);
      //         //   a.download = that.projectName + '.gif' || 'download.gif';
      //         //   a.click();
      //         // } else {
      //         //   that.uploadImg(blob);
      //         // }
      //         console.log(URL.createObjectURL(blob));

      //       });

      //       gif.render();
      //     }
      //     return item;
      //   }
      // })

      // gifshot.js
      const { width, height } = window.getComputedStyle(document.querySelectorAll('.page-box')[1])

      // const blockProps = block.props;
      // const pcMobileDiff = blockProps.logoDisplay.imgHeight === '32' ? '18' : '15';
      // const diffHeightNum = (~~blockProps.logoDisplay.imgHeight + ~~blockProps.logoDisplay.topLineHeight + ~~blockProps.logoDisplay.bottomLineHeight - ~~pcMobileDiff);

      window['gifshot'].createGIF(
        {
          images: imageList,
          // gifWidth: +block.props.size.width,
          // gifHeight: +block.props.size.height + diffHeightNum,
          gifWidth: Number.parseInt(width, 10),
          gifHeight: Number.parseInt(height, 10),
          // 控制速度
          interval: intervalTime * 1,
        },
        function (obj) {
          if (!obj.error) {
            // 如果不是导出到手机
            if (!that.isExportToPhone) {
              let isError = false
              try {
                // 下载到本地 百度统计
                window['_hmt'].push(['_trackEvent', 'editpage', 'edit-download', 'edit-download-gif'])
                const a = document.createElement('a')
                a.href = obj.image
                a.download = that.projectName + '.gif' || 'download.gif'
                a.click()
              } catch (error) {
                isError = true
                that.toastr.error(null, '下载失败')
              }
              $('.loading-box').hide()
              if (!isError) {
                // 百度统计
                window['_hmt'].push(['_trackEvent', 'editpage', 'edit-download', 'edit-download-chart-gif-success'])
                that.downloadImageSuccCallback()
              }
            } else {
              // 下载到手机 百度统计
              window['_hmt'].push(['_trackEvent', 'editpage', 'edit-download', 'edit-download-gif-phone'])
              that.uploadImg(that.dataURLtoBlob(obj.image))
            }
          } else {
            that.toastr.error(null, '下载失败')
            if (that.isExportToPhone) {
              that._dataTransmissionService.saveProcess('fail')
            } else {
              $('.loading-box').hide()
            }
            // 百度统计
            window['_hmt'].push(['_trackEvent', 'editpage', 'edit-download', 'edit-download-chart-gif-failure'])
          }
        }
      )
      return
    }
  }

  // 上传 blob
  uploadImg(blob) {
    const fd = new FormData()
    fd.append('img', blob)
    const url = `${this._api.getOldUrl()}/vis/dychart/export_img_to_mobile`

    this._http.post(url, fd, { withCredentials: true }).subscribe((res) => {
      if (res['resultCode'] === 1000) {
        this._dataTransmissionService.saveProcess('success')
        this.isRetry = false
        this.isExportToPhone = false
        setTimeout(() => {
          this.modalService.show(ExportToPhoneModalComponent, {
            ignoreBackdropClick: true,
            initialState: {
              url: `https://dycharts.com/img-show/index.html?url=${res['data']['url']}`,
            },
          })
          // 计下载数
          this.downloadImageSuccCallback()
        }, 800)
      } else {
        this.toastr.error(null, '下载失败')
        this._dataTransmissionService.saveProcess('false')
      }
    })
  }

  // 下载 svg
  downloadSvg(type) {
    var svg = $('.echart-container').eq(1).find('svg')[0]
    var serializer = new XMLSerializer()
    var source = serializer.serializeToString(svg)

    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"')
    }
    if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
      source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"')
    }

    source = '<?xml version="1.0" standalone="no"?>\r\n' + source
    var url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source)

    $('.loading-box').hide()
    // const dom = document.querySelectorAll('.page-box')[1];
    // const blockSize = this.project.article.contents.pages[0].blocks[0].props.size;
    // const base64 = this.makeSvgDataUri(dom, blockSize.width, blockSize.height);

    // 如果不是导出到手机
    if (!this.isExportToPhone) {
      const a = document.createElement('a')
      a.href = url
      a.download = this.projectName + '.' + type || 'download.' + type
      a.click()
      this.downloadImageSuccCallback()
    }
  }

  // 过滤图中的字体
  filterProjectFonts() {
    if (!this.project) return
    const projectFonts = []
    const blocks = _.cloneDeep(this.project.article.contents.pages[0].blocks)
    if (!blocks) {
      return
    }
    _.each(blocks, (item, key) => {
      if (item.type === 'text') {
        if (item.props.fontFamily) {
          projectFonts.push(item.props.fontFamily)
        }
      } else {
        // 文字
        if (item.props.font) {
          projectFonts.push(item.props.font.fontFamily)
        }

        // 标题
        if (item.props.titleDisplay) {
          projectFonts.push(item.props.titleDisplay.fontFamily)
        }

        // 文字标签
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

        // 附加信息
        if (item.props.sourceDisplay) {
          projectFonts.push(item.props.sourceDisplay.fontFamily)
        }

        // 图例
        if (item.props.legend) {
          projectFonts.push(item.props.legend.fontFamily)
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

  // 开启透明底
  transparentSwitch(type?) {
    this.bgTransparent = !this.bgTransparent
    this.toggleTransparent.emit()
    this.watermark.emit()
    // 如果有 type 表示外面点击透明底，没有则表示切换时重置透明底
    if (type) {
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-download', `edit-download-transparent-${type}`])
    }
  }

  // 升级会员
  upgrade(tip: number = 2) {
    if (tip === 2) {
      this.modalService.show(UpgradeMemberComponent, {
        initialState: {
          chaeckType: 0,
          vipIds: ['2'],
          svipIds: ['2'],
        },
      })
    } else if (tip === 1) {
      this.modalService.show(UpgradeMemberComponent, {
        initialState: {
          chaeckType: 0,
          vipIds: ['1'],
          svipIds: ['1'],
        },
      })
    }
  }

  // 获取用户当前下载数
  getUserCurDownloadNum() {
    const getUserCurDownloadNumUrl = `${this._api.getOldUrl()}/vis/dychart/chart_image_daily_export/`
    this._http.get(getUserCurDownloadNumUrl, { withCredentials: true }).subscribe((res) => {
      if (res['resultCode'] === 1000) {
        if (res['data'].max_export_num) {
          this.curDownloadNum = res['data'].max_export_num - res['data'].daily_export_count
          this.maxDownloadNum = res['data'].max_export_num
          this.isShowExportNum = true
        } else {
          this.isShowExportNum = false
        }
      }
    })
  }

  // 验证用户当前是否可以下载
  verifyUserCurDownloadNum(type) {
    const verifyUserCurDownloadNumUrl = `${this._api.getOldUrl()}/vis/dychart/chart_image_daily_export/`
    return this._http.post(verifyUserCurDownloadNumUrl, { action: type }, { withCredentials: true })
  }

  // 下载成功后的回调
  downloadImageSuccCallback() {
    // this.verifyUserCurDownloadNum('export_num_increase').subscribe(res => {
    //   if (res['resultCode'] === 1000) {
    //     this.curDownloadNum = this.curDownloadNum - 1
    //   }
    // })
    this.exportSucc()
  }

  // 添加参数
  exportSucc() {
    let url = `${this._api.getOldUrl()}/vis/dychart/chart_image_daily_export/`
    let data = {
      action: 'export_num_increase',
      chart_id: this.project.id,
      file_type: this.chooseType,
      chart_type: this.projectType,
    }
    return this._http.post(url, data, { withCredentials: true }).subscribe((res) => {
      if (res['resultCode'] === 1000) {
        this.curDownloadNum = this.curDownloadNum - 1
      }
    })
  }

  // base64 转 blob
  dataURLtoBlob(dataurl) {
    const arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1])
    let n = bstr.length,
      u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
  }

  // blob 转 base64
  blobToDataURL(blob, callback) {
    let a = new FileReader()
    a.onload = function (e) {
      callback(e.target['result'])
    }
    a.readAsDataURL(blob)
  }

  // 将节点转成svg
  makeSvgDataUri(node, width, height) {
    node.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml')
    node.querySelector('svg').setAttributeNS('http://www.w3.org/2000/svg', 'xlink', 'http://www.w3.org/1999/xlink')
    var nodeStr = new XMLSerializer()
      .serializeToString(node)
      .replace(/#/g, '%23')
      .replace(/\n/g, '%0A')
      .replace(/&nbsp;/g, ' ')
      .replace(/\"<br>\"/g, '""')
      .replace(/<br>/g, '')
    var foreignObject = '<foreignObject x="0" y="0" width="100%" height="100%">' + nodeStr + '</foreignObject>'
    var svgStr =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' +
      width +
      '" height="' +
      height +
      '">' +
      foreignObject +
      '</svg>'
    return 'data:image/svg+xml;charset=utf-8,' + svgStr
  }

  // 修改图片倍数
  changeImgSize(e) {
    this.dropdowImgSizeListIndex = e
    switch (e) {
      case 0:
        this.exportImgW = this.imgInitW
        this.exportImgH = this.imgInitH
        break
      case 1:
        this.exportImgW = this.imgInitW * 2
        this.exportImgH = this.imgInitH * 2
        break
      case 2:
        this.exportImgW = this.imgInitW * 3
        this.exportImgH = this.imgInitH * 3
        break
      case 3:
        this.exportImgW = this.imgInitW * 4
        this.exportImgH = this.imgInitH * 4
        break
      default:
        break
    }
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'editpage', 'edit-download', 'edit-download-changesize-byindex', e + 1])
  }

  // 调整 mp4 尺寸
  changeMp4Size(index) {
    this.dropdownMp4SizeListIndex = index
    const size = index === 0 ? 480 : 720
    this.resetSize('mp4', size)
  }

  // 调整帧率
  changeMp4Quality(index) {
    this.dropdownMp4QualityListIndex = index
  }

  // 下载
  downloadMp4() {
    let imageList = []
    const rate = 3
    const that = this
    const block = this.project.article.contents.pages[0].blocks[0]
    const animation = block.props.animation
    const totalTime = Number(animation.startDelay) + Number(animation.duration) + Number(animation.endPause)

    // 0.1s截屏多少张
    const intervalTime = 0.2
    // const intervalNumber = rate * totalTime / intervalTime;
    const startTime = new Date().getTime()

    const id = this.project.private_url.split('show/')[1]
    let fps = this.dropdownMp4QualityList[this.dropdownMp4QualityListIndex].split('fps')[0]
    const dimention = this.exportImgH + ''

    if (!this.showDynamicChatAnimation) {
      this.totalTime = totalTime
    }

    if (!this.isRetry) {
      this.bsModalRef = this.modalService.show(ProgressComponent, {
        ignoreBackdropClick: true,
        initialState: {
          isHideCloseBtn: true,
          text: `导出预计需要${this.handleModalTime(this.totalTime)}，请勿关闭页面。`,
        },
      })
    }

    if (this.showDynamicChatAnimation) {
      const data = {
        // 'fps': 2,
        chart_type: 'dynamic',
        dimension: dimention,
        show_url: this._api.getOldUrl() + '/xshow/index.html?id=' + id,
      }
      this._http.post(this._api.getMp4ByUrl(), data, { withCredentials: true }).subscribe(() => {
        setTimeout(() => {
          this.downloadMp4ById(id, true)
        }, 60000)
      })
      return
    }
    this._notifyChartRenderService.sendChartSpeed(rate)

    // 时间间隔
    const imgInterval = setInterval(() => {
      getBase64(function (data) {
        imageList.push(data)
      })
      const endTime = new Date().getTime()
      const usedTime = (endTime - startTime) / 1000
      if (usedTime >= totalTime * rate) {
        const endTime = new Date().getTime()
        const usedTime = (endTime - startTime) / 1000
        clearInterval(imgInterval)
        const timer = setInterval(() => {
          clearInterval(timer)
          fps = (rate * imageList.length) / usedTime + ''
          // console.log(`fps: ${fps}  useTime: ${usedTime} imageList.length: ${imageList.length}  intervalNumber: ${intervalNumber}`);
          downloadZipImage(imageList, (blob) => {
            const fd = new FormData()
            fd.append('vf', this.chooseType)
            fd.append('chart_id', id)
            fd.append('fps', fps)
            fd.append('zipfile', blob)
            this._http.post(this._api.postImages(), fd, { withCredentials: true }).subscribe(() => {
              this.downloadMp4ById(id)
            })
          })
          return
        }, 1500)
      }
    }, intervalTime * 1000)

    const getBase64 = (cb) => {
      const width = this.exportImgW
      const height = this.exportImgH
      domtoimage.impl.options.isGIF = true
      let isOpacity = '#fff'
      // MOV 透明底判定
      if (this.chooseType === 'mov' && this.bgTransparent) {
        isOpacity = null
      }
      // 节点转成 blob
      domtoimage
        .toBlob($('.page-box')[1], {
          width: width,
          height: height,
          quality: 0.5,
          style: {
            'transform-origin': '0 0',
            transform: `scale(${Number(that.exportImgW / this.imgInitW)}, ${Number(that.exportImgH / this.imgInitH)})`,
            background: isOpacity,
          },
        })
        .then((blob) => {
          domtoimage.impl.options.isGIF = false
          that.blobToDataURL(blob, cb)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  // 下载后端已经处理完成的视频 flag true 为动态图表
  downloadMp4ById(id, flag = false) {
    let timer = null
    const intervalTime = flag ? 5000 : 3000
    this._http
      .get(this._api.getVideo(id), { withCredentials: true })
      .pipe(catchError((e) => of(e)))
      .subscribe((res) => {
        if (res.status === 404) {
          timer = setTimeout(() => {
            this.downloadMp4ById(id, flag)
          }, intervalTime)
        } else {
          clearTimeout(timer)
          // 百度统计
          window['_hmt'].push([
            '_trackEvent',
            'editpage',
            'edit-download',
            `edit-download-chart-${this.chooseType}-success`,
          ])
          this._dataTransmissionService.saveProcess('success')
          this.exportTimer = setTimeout(() => {
            const url = this._api.getVideo(id)
            const a = document.createElement('a')
            a.href = url
            a.download = this.project.title + '.' + this.chooseType || 'download.' + this.chooseType
            a.click()
          }, 1000)
        }
      })
    // if (!this.isExportToPhone) {
    //   setTimeout(() => {
    //     const url = this._api.getVideo(id);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = this.project.title + '.' + this.chooseType || 'download.' + this.chooseType;
    //     a.click();
    //     $('.loading-box').hide();
    //   }, 2000);
    // } else {
    //   setTimeout(() => {
    //     this.modalService.show(ExportToPhoneModalComponent, {
    //       ignoreBackdropClick: true,
    //       initialState: {
    //         url: this._api.getVideo(id)
    //       }
    //     })
    //   }, 800);
    // }
  }

  handleModalTime(second: number) {
    const time = second * 2.5
    if (time < 60) {
      return `50秒`
    } else {
      return `${Math.ceil(time / 60)}分钟`
    }
  }

  handleDynamicTime(data) {
    let length = 0
    let mapIndex

    // 圆堆积要去重
    if (data.templateId === '8000000011111111004') {
      mapIndex =
        data.props.map[0][
          _.findIndex(data.props.map[0], (o) => {
            return o['function'] === 'timeCol'
          })
        ].index
      mapIndex = mapIndex !== undefined ? mapIndex : 1
      data.dynamicData = _.uniq(_.unzip(data.dataSrc.data[0])[mapIndex].slice(1))
      length = data.dynamicData.length
    } else {
      mapIndex =
        data.props.map[0][
          _.findIndex(data.props.map[0], (o) => {
            return o['function'] === 'timeColUni'
          })
        ].index
      mapIndex = mapIndex !== undefined ? mapIndex : 1
      data.dynamicData = _.unzip(data.dataSrc.data[0])[mapIndex].slice(1)
      length = data.dynamicData.length
    }
    const time =
      (length - 1) * Number(data.props.timerControl.frameDuration) +
      Number(data.props.animation.startDelay) +
      Number(data.props.animation.endPause)
    return time
  }

  ngOnDestroy(): void {
    clearTimeout(this.exportTimer)
  }
}
