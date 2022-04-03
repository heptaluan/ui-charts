import { Directive, ElementRef } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import * as XLSX from 'xlsx'
import * as _ from 'lodash'
import { ToastrService } from 'ngx-toastr'
import { Store } from '@ngrx/store'
import * as fromRoot from '../../states/reducers'
import { UtilsService } from '../../share/services/utils.service'
import { Subscription } from 'rxjs'
import { UpdateProjectContent } from '../../states/models/project.model'
import * as ProjectModels from '../../states/models/project.model';
import { UpdateCurrentChartProjectArticleAction } from '../../states/actions/project.action'
import { UpdateCurrentProjectArticleAction } from '../../states/actions/project.action';
import * as ProjectActions from '../../states/actions/project.action'
import { BsModalRef, BsModalService } from 'ngx-bootstrap'
import { ProgressComponent, UploadTipsComponent } from '../../components/modals'
import { DataTransmissionService, VipService } from '../../share/services'
import * as $ from 'jquery'
import { API } from '../../states/api.service'
import { ImageMapService } from '../../block/image-map.service'
import { UpgradeMemberComponent } from '../../components/modals/upgrade-member/upgrade-member.component';

@Directive({
  selector: '[dropUpload]'
})

export class DropUploadDirective {

  private dropBox: HTMLDivElement
  private projectType: string
  private chartList: any[] = []
  private project: ProjectModels.ProjectInfo

  private projectId: string
  private pageId: string
  private isVpl: string = 'None'

  private bsModalRef: BsModalRef

  private chartTemplateList: ReadonlyArray<string> = [
    '5544734748594536493',  // 圆角饼图
    '444734748594536323',   // 基础柱状图
    '3612096174443311105',  // 分组柱状图
    '154772011302084304',   // 基础条形图
    '7955555555502346001'   // 表格
  ]

  private getCurrentChartProjectFullSubscription: Subscription = new Subscription()
  private getCurrentProjectFullSubscription: Subscription = new Subscription()
  private getChartTemplatesSubscription: Subscription = new Subscription()
  private getImageSubjectStateSubscription: Subscription = new Subscription()

  constructor(
    private _el: ElementRef,
    private _activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private _store: Store<fromRoot.State>,
    private _utilsService: UtilsService,
    private modalService: BsModalService,
    private _dataTransmissionService: DataTransmissionService,
    private _vipService: VipService,
    private _api: API,
    private _imageMapService: ImageMapService,
  ) { }

  ngOnInit(): void {
    this.isVpl = this._vipService.getVipLevel();
    this.projectType = this._activatedRoute.snapshot.queryParams.type;

    // 监听扫码上传的图片
    this.getImageSubjectStateSubscription.add(this._dataTransmissionService.getImageSubjectState().subscribe(res => {
      if (res.code === 1) {
        this.handleInsertImage(`${res.data.notify_info}`, true)
      }
    }))
  }

  ngAfterViewInit(): void {
    this.dropBox = <HTMLDivElement>document.querySelector('.drop-box')
    if (this.projectType === 'infographic') {
      this.getCurrentProjectFullSubscription.add(this._store.select(fromRoot.getCurrentProjectFull).subscribe(project => {
        if (project) {
          this.project = project
          this.projectId = project.id
          this.pageId = project.article.contents.pages[0].pageId
        }
      }))
    } else if (this.projectType === 'chart') {
      this.getCurrentChartProjectFullSubscription.add(this._store.select(fromRoot.getCurrentChartProjectFull).subscribe(project => {
        if (project) {
          this.project = project
          this.projectId = project.id
          this.pageId = project.article.contents.pages[0].pageId
        }
      }))
    }

    this.getChartTemplatesSubscription.add(this._store.select(fromRoot.getChartTemplates).subscribe(data => {
      if (data) {
        this.chartList = data
      }
    }))

    this.dropBox.ondragover = function (ev: MouseEvent): void {
      ev.stopPropagation()
      ev.preventDefault()
    }

    this.dropBox.ondragend = function (ev: MouseEvent): void {
      ev.stopPropagation()
      ev.preventDefault()
    }

    document.ondragstart = function (ev: MouseEvent): boolean {
      return false
    }

    document.ondragenter = (ev: MouseEvent): void => {
      this.dropBox.style.display = 'flex'
    }

    document.ondragleave = (ev: MouseEvent): void => {
      if (ev.target['id'] === 'show') {
        this.dropBox.style.display = 'none'
      }
    }

    this.dropBox.ondrop = (ev: MouseEvent): void => {
      console.log(`drop`)
      ev.stopPropagation()
      ev.preventDefault()
      this.dropBox.style.display = 'none'
      this.handleDropFile(ev)
    }
  }

  ngOnDestroy(): void {
    this.getCurrentChartProjectFullSubscription.unsubscribe()
    this.getCurrentProjectFullSubscription.unsubscribe()
    this.getChartTemplatesSubscription.unsubscribe()
    this.dropBox.ondragover = null
    this.dropBox.ondragend = null
    this.dropBox.ondrop = null
    document.ondragstart = null
    document.ondragenter = null
    document.ondragleave = null
    this.getImageSubjectStateSubscription.unsubscribe()
  }

  public handleDropFile(ev: MouseEvent): void {
    switch (this.projectType) {
      case 'chart':
        this.handleSingleChartUploadedFiles(ev)
        break
      case 'infographic':
        this.handleInfographicUploadedFiles(ev)
        break
      default:
        break
    }
  }

  public handleSingleChartUploadedFiles(ev: MouseEvent): void {
    const file: File = this.getSingleChartCsvFile(ev)
    if (!file) {
      this.toastr.error(null, '仅支持上传EXCEL或CSV文件')
      return
    }

    if (!/\.(xlsx|xls|XLSX|XLS|csv|CSV)$/.test(file['name'])) {
      this.toastr.error(null, '仅支持上传EXCEL或CSV文件')
      return
    }

    if (file['size'] > 1024 * 1024) {
      this.toastr.error(null, '请上传1M以内的EXCEL或CSV文件')
      return
    }

    if (this.chartList.length === 0) {
      this.toastr.error(null, '请等待页面加载完成后再行尝试！')
      return
    }
    if (/\.(xlsx|xls|XLSX|XLS)$/.test(file['name'])) {
      console.log(`excel`)
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'chart-drag-excel'])
    } else {
      console.log(`csv`)
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'chart-drag-csv'])
    }
    this.readAsCsvAndExcel(file, this.insertSingleChart.bind(this))
  }

  public handleInfographicUploadedFiles(ev: MouseEvent): void {
    const list: File[] = ev['dataTransfer'].files
    const isImage: boolean = /\.(PNG|JPE?G|GIF|png|jpe?g|gif)(\?.*)?$/.test(list[0]['name'])
    const isCsv: boolean = /\.(xlsx|xls|XLSX|XLS|csv|CSV)$/.test(list[0]['name'])

    if (this.chartList.length === 0) {
      this.toastr.error(null, '请等待页面加载完成后再行尝试！')
      return
    }

    if (list.length > 1) {
      this.toastr.error(null, '每次只能拖拽1份文件')
      return
    }

    if (isImage && list[0]['size'] > 5 * 1024 * 1024) {
      this.toastr.error(null, '请上传5M以内的图片')
      return
    }

    if (isCsv && list[0]['size'] > 1024 * 1024) {
      this.toastr.error(null, '请上传1M以内的EXCEL或CSV文件')
      return
    }

    if (isImage) {
      // 埋点
      switch (list[0].type) {
        case 'image/jpeg':
          console.log(`jpg`)
          window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'info-drag-jpg'])
          break;
        case 'image/png':
          console.log(`png`)
          window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'info-drag-png'])
          break;
        case 'image/gif':
          console.log(`gif`)
          window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'info-drag-gif'])
          break;
        default:
          break;
      }
      this.bsModalRef = this.modalService.show(ProgressComponent, {
        ignoreBackdropClick: true,
        initialState: {
          text: `正在上传，请稍候`
        }
      })
      this.insertInfographicImages(list[0])
    } else if (isCsv) {
      if (/\.(xlsx|xls|XLSX|XLS)$/.test(list[0]['name'])) {
        console.log(`excel`)
        window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'info-drag-excel'])
      } else {
        console.log(`csv`)
        window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'info-drag-csv'])
      }
      this.bsModalRef = this.modalService.show(ProgressComponent, {
        ignoreBackdropClick: true,
        initialState: {
          text: `正在上传，请稍候`
        }
      })
      this.readAsCsvAndExcel(list[0], this.insertInfographicChart.bind(this))
    } else {
      console.log(`failed`)
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'info-drag-failed'])
      this.toastr.error(null, '不支持上传该格式文件')
      return
    }
  }

  public insertSingleChart(name: string, blockId: string, templateId: string, data: any): void {
    const newData = this.filterEmptyValueArr(data)
    let block = _.cloneDeep(_.find(this.chartList, function (o) {
      return o.templateId === templateId
    }))
    block.projectId = this.projectId
    block.blockId = blockId
    block.position = { top: 0, left: 0 }
    block.dataSrc.data[0] = newData
    block.props.titleDisplay.text = name
    block.props.unitDisplay.show = false
    this.checkBlockMap(newData, block)
    if (this.project.article.contents.pages[0].blocks.length === 0) {
      const theme = this.project.article.contents.theme
      this.uploadDesign(this.project.article.contents.design)
      block.theme = theme
      let addData: any = {
        target: {
          blockId: block.blockId,
          pageId: this.pageId,
          type: block.type
        },
        method: 'add',
        block: block
      }
      this._store.dispatch(new ProjectActions.UpdateCurrentChartProjectArticleAction(this.projectId, addData))
    } else {
      this.modalService.show(UploadTipsComponent, {
        initialState: {
          block: block,
          projectId: this.projectId,
          pageId: this.pageId,
        }
      })
    }
    setTimeout(() => {
      this.toastr.success(null, '上传成功')
    }, 500);
  }

  public insertInfographicChart(name: string, blockId: string, templateId: string, data: Array<Array<string>>): void {
    const newData = this.filterEmptyValueArr(data)
    let scale: number = Number.parseInt(document.querySelector('.page-size span').innerHTML)
    let left: number, top: number
    let block = _.cloneDeep(_.find(this.chartList, function (o) {
      return o.templateId === templateId
    }))
    block.projectId = this.projectId
    block.blockId = blockId
    block.dataSrc.data[0] = newData
    block.theme = this.project.article.contents.theme
    block.props.titleDisplay.text = name
    block.props.unitDisplay.show = false
    this.checkBlockMap(newData, block)
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
      left: left
    }
    let addData: UpdateProjectContent = {
      target: {
        blockId: block.blockId,
        pageId: this.pageId,
        type: block.type
      },
      method: 'add',
      block: block
    }
    this._dataTransmissionService.saveProcess('success')
    this._store.dispatch(new ProjectActions.UpdateCurrentProjectArticleAction(this.projectId, addData))
    console.log(`info-drag-succeed-${block.title}`)
    window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', `info-drag-succeed-${block.title}`])
    this.curBlockSelected(block)
    setTimeout(() => {
      this.toastr.success(null, '上传成功')
      this._dataTransmissionService.sendSidebarState('chart')
    }, 500)
  }

  public insertInfographicImages(file: File): void {
    this.checkUploadState(file, this.handleInsertImage.bind(this))
  }

  public handleInsertImage(url: string, hasPrefix?: boolean): void {
    let newUrl
    if (hasPrefix) {
      newUrl = `${url}`
    } else {
      newUrl = `http://${url}`
    }
    const newBlock = _.cloneDeep(this._imageMapService.ImageBlockTemplate)
    const img = new Image()
    img.src = newUrl
    const that = this
    img.onload = function () {
      if (img.width < 600) {
        newBlock.props.size.width = img.width.toString()
        newBlock.props.size.height = img.height.toString()
      } else {
        const a = 600 / img.width
        newBlock.props.size.width = '600'
        newBlock.props.size.height = Math.round(img.height * a) + ''
      }
      newBlock.src = newUrl
      that.addImage(newBlock)
    }
  }

  public addImage(newBlock: any): void {
    newBlock.blockId = this._utilsService.generate_uuid()
    newBlock.props.size.rotate = 0
    let scale: number = Number.parseInt(document.querySelector('.page-size span').innerHTML)
    let left: number, top: number
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
      left: left
    }
    const newData: UpdateProjectContent = {
      target: {
        blockId: newBlock.blockId,
        pageId: this.pageId,
        type: 'image'
      },
      method: 'add',
      block: newBlock
    }
    this._dataTransmissionService.saveProcess('success')
    this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData))
    this.curBlockSelected(newBlock)
    setTimeout(() => {
      this._dataTransmissionService.sendSidebarState('image')
      this.toastr.success(null, '上传成功')
    }, 500);
    setTimeout(() => {
      this._dataTransmissionService.sendImageSidebarSwitch(true)
    }, 800);
  }

  // helpers
  // =========================================
  // =========================================

  private readAsCsvAndExcel(files: File, callback: (name: string, blockId: string, templateId: string, daraSrc: Array<Array<string>>) => void): void {
    const blockId: string = this._utilsService.generate_uuid()
    const name: string = files.name.split('.')[0]
    let isCSV: boolean = false
    if (files.type !== 'application/vnd.ms-excel' && files.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      isCSV = true
    } else {
      isCSV = false
    }
    let wb
    let that = this
    let reader: FileReader = new FileReader()
    let data
    let dataSrc
    try {
      if (isCSV) {
        reader.readAsText(files, 'gb2312')
        reader.onload = function () {
          data = reader.result
          dataSrc = _.map(_.dropRight(data.split(/\n/)) as any, item => item.split(','))
          if (dataSrc.length === 0) {
            console.log(`failed`)
            if (that.projectType === 'chart') {
              window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'chart-drag-failed'])
            } else {
              window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'info-drag-failed'])
            }
            that.toastr.error(null, '上传失败!sheet1内容不能为空')
          } else {
            const templateId: string = that.getCorrespondingChartTemplateId(dataSrc)
            callback && callback(name, blockId, templateId, dataSrc)
          }
        }
      } else {
        reader.readAsBinaryString(files)
        reader.onload = function (e) {
          data = e.target['result']
          wb = XLSX.read(data, {
            type: 'binary'
          })
          dataSrc = _.map(_.dropRight(XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]).split(/\n/)), item => item.split(','))
          if (dataSrc.length === 0) {
            console.log(`failed`)
            if (that.projectType === 'chart') {
              window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'chart-drag-failed'])
            } else {
              window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'info-drag-failed'])
            }
            that.toastr.error(null, '上传失败!sheet1内容不能为空')
          } else {
            const templateId = that.getCorrespondingChartTemplateId(dataSrc)
            callback && callback(name, blockId, templateId, dataSrc)
          }
        }
      }
    } catch (error) {
      this.toastr.error(null, '上传失败')
    }
  }

  private getSingleChartCsvFile(ev: MouseEvent): File {
    const files = ev['dataTransfer'].files
    const filterList = _.filter(files, item => /\.(xlsx|xls|XLSX|XLS|csv|CSV)$/.test(item.name))
    return filterList[0]
  }

  private uploadDesign(design: ProjectModels.ProjectDesign): void {
    let newDesign = _.cloneDeep(design)
    let newData: UpdateProjectContent = {
      target: {
        pageId: this.pageId,
        type: 'article',
        target: 'redo'
      },
      method: 'put',
      design: newDesign
    }
    this._store.dispatch(new UpdateCurrentChartProjectArticleAction(this.projectId, newData))
  }

  private getCorrespondingChartTemplateId(data: string[]): string {
    let newData: any[] = this.filterEmptyValueArr(_.unzip(_.cloneDeep(data).slice(1)))
    const typeList: number[] = this.getDataSrcTypeList(newData)
    let chartTemplateIndex = 0
    if (typeList.length === 2 && (typeList[0] === 0 || typeList[1] === 0)) {
      const count: number = newData[typeList.findIndex(n => n === 0)].reduce((prev: number, cur: number) => prev += Number(cur), 0)
      if ((0.9 < count && count < 1.1) || (95 < count && count < 105)) {
        chartTemplateIndex = 0
      } else {
        chartTemplateIndex = 1
      }
    } else if (typeList.length >= 3) {
      const flag: number = (typeList.slice(1)).reduce((prev: number, cur: number) => prev += Number(cur), 0)
      if (typeList[0] === 1 && flag === 0) {
        chartTemplateIndex = 2
      } else if (typeList.find(n => n === 0) !== undefined) {
        chartTemplateIndex = 3
      } else {
        chartTemplateIndex = 4
      }
    } else {
      chartTemplateIndex = 4
    }
    return this.chartTemplateList[chartTemplateIndex]
  }

  private getDataSrcTypeList(data: Array<Array<string>>): Array<number> {
    const typeList: number[] = []
    for (let i = 0; i < data.length; i++) {
      const list = _.filter(data[i], item => {
        if (item === '') return true
        return isNaN(item as any)
      })
      if (list.length === 0) {
        typeList.push(0)
      } else {
        typeList.push(1)
      }
    }
    return typeList
  }

  private checkBlockMap(data: Array<Array<string>>, block: ProjectModels.Block): void {
    if (!block.props['map']) {
      return
    }
    let newData: string[][] = _.unzip(_.cloneDeep(data).slice(1))
    const typeList: number[] = this.getDataSrcTypeList(newData)
    const dataMap = block.props['map'][0]
    const objColIndex = _.findIndex(dataMap, (o: any) => {
      return o.function === 'objCol'
    })
    const vColIndex = _.findIndex(dataMap, (o: any) => {
      return o.function === 'vCol'
    })
    if ((block.templateId === this.chartTemplateList[0]) || block.templateId === this.chartTemplateList[1]) {
      if (typeList[0] === 1) {
        dataMap[objColIndex].index = 0
        dataMap[vColIndex].index = 1
      } else {
        dataMap[objColIndex].index = 1
        dataMap[vColIndex].index = 0
      }
    } else if (block.templateId === this.chartTemplateList[3]) {
      const objColIndex = typeList.findIndex(n => n === 0)
      dataMap[vColIndex].index = objColIndex
    }
  }

  private curBlockSelected(newBlock: ProjectModels.Block): void {
    let blockList: any[] = []
    let blockBoxList = $('.page').find('.block-container')
    setTimeout(() => {
      blockBoxList.each((k, v) => {
        blockList.push($(v).attr('chartid'))
      })
      const index = blockList.findIndex(x => x === newBlock.blockId);
      if (index !== -1) {
        $(blockBoxList[index]).click()
      }
    }, 300);
  }

  private checkUploadState(file: File, callback: (url: string) => void): void {
    const formData: FormData = new FormData()
    formData.append('img_file', file, file.name)
    const that = this
    const xhr: XMLHttpRequest = new XMLHttpRequest()
    xhr.open('POST', this._api.getUserUploadImg())
    xhr.send(formData)
    xhr.onreadystatechange = function (data) {
      if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
        const dataText = JSON.parse(data.target['response'])
        if (dataText.resultCode === 1000) {
          callback && callback(dataText.data.img_url)
        } else {
          setTimeout(() => {
            that.bsModalRef.hide()
          }, 200);
          that.showUpqradeUserAccountModal()
        }
      }
    }
  }

  private showUpqradeUserAccountModal(): void {
    if (this.isVpl && this.isVpl === 'None') {
      this.modalService.show(UpgradeMemberComponent, {
        initialState: {
          chaeckType: 0,
          vipIds: ['6'],
          svipIds: ['6']
        }
      })
    } else {
      setTimeout(() => {
        this.bsModalRef.hide()
      }, 200);
      this.toastr.warning(null, '图片存储超限')
    }
  }

  private filterEmptyValueArr(data: Array<Array<string>>): Array<Array<string>> {
    // 输出有数字的二维数组，中间空值不过滤（过滤多余的空值）
    let newData = _.cloneDeep(data);
    let colNumArr = [];
    let rowNumArr = [];
    let filterArr = newData.map((item, index) => {
      // 找出有长度的数组, 将 index 存进 colNumArr, 找最大 index
      if (_.compact(item).length > 0) {
        colNumArr.push(index);
      }
      // 找出数组有值的最后一个index, 将 index 存进 rowNumArr
      item.map((i, ind) => {
        if (i) {
          rowNumArr.push(ind);
        }
        return i;
      })
      return item;
    })
    if (colNumArr.length) {
      filterArr.length = Math.max(...colNumArr) + 1;
    } else {
      newData = _.map(newData[0], item => { return _.compact(item) }).filter(d => d.length > 0)
    };
    if (rowNumArr.length) {
      newData = filterArr.map(item => {
        item.length = Math.max(...rowNumArr) + 1;
        return item;
      })
    } else {
      newData = _.map(newData[0], item => { return _.compact(item) }).filter(d => d.length > 0);
    }
    return newData
  }

}
