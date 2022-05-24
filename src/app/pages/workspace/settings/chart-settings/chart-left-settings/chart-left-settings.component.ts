/*
 * @Description: 图表表格配置项-编辑数据
 */
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core'
import * as fromRoot from '../../../../../states/reducers'
import { Store } from '@ngrx/store'
import * as ProjectModels from '../../../../../states/models/project.model'
import { ActivatedRoute } from '@angular/router'
import { TabComponent } from '../../tab.component'
import * as _ from 'lodash'
import { Subject, Observable } from 'rxjs'

import {
  UpdateCurrentProjectArticleAction,
  UpdateCurrentChartProjectArticleAction,
} from '../../../../../states/actions/project.action'
import { UpdateProjectContent } from '../../../../../states/models/project.model'
import { CompleteBlockService } from '../../../../../share/services/complete-block.service'

import { handleColorList } from '../chart-right-settings/handleColor'

@Component({
  selector: 'lx-chart-left-settings',
  templateUrl: './chart-left-settings.component.html',
  styleUrls: ['./chart-left-settings.component.scss'],
})
export class ChartLeftSettingsComponent implements TabComponent, OnInit, AfterViewInit, OnDestroy {
  @ViewChild('leftLine') leftLine
  @ViewChild('tables') tables

  curBlock
  curPageId: string

  // 当前选中图表数据
  curData: Subject<any[]> = new Subject()
  curData$: Observable<any[]> = this.curData.asObservable()

  tbWidth = 536
  removeColIndex: number
  projectType: string
  projectId: string

  removeAllCol: any
  removeAllRow: any

  // 特殊处理气泡图
  bubbleList = [
    '3612096174443311121', // 极坐标气泡图
    '3612096174443311122', // 打卡气泡图
    '3612096174443311123', // 多轴气泡图
  ]

  constructor(
    private _store: Store<fromRoot.State>,
    private _router: ActivatedRoute,
    private _completeBlockService: CompleteBlockService
  ) {
    this.curData.next([])
  }

  ngOnInit() {
    this.projectType = this._router.snapshot.queryParams.type
    this.projectId = this._router.snapshot.queryParams.project
  }

  ngAfterViewInit() {}

  updateBlock(block: ProjectModels.Block, pageId?: string) {
    this.curBlock = block
    this.curPageId = pageId
    // 深拷贝数组
    const data = block.dataSrc.data
    setTimeout(() => {
      this.curData.next(<any[]>data)
    }, 10)
  }

  tbAfterChange(dataObj) {
    const newBlock = _.cloneDeep(this.curBlock)
    newBlock.dataSrc.data = dataObj.data

    // cross 类型图表
    if (newBlock.templateSwitch === 'cross') {
      let dataMap = newBlock.props.map[0]
      let dataSrc = newBlock.dataSrc.data[0][0]
      // 如果删除的是第一列
      if (this.removeColIndex === 0) {
        // 删除第一个 vCol 并且重新排序
        const vColIndex = 1
        dataMap = [...dataMap.slice(0, vColIndex), ...dataMap.slice(vColIndex + 1)]
        let index: number = 0
        for (let i = 0; i < dataMap.length; i++) {
          dataMap[i].index = index++
        }
        newBlock.props.map[0] = dataMap
        this.removeColIndex = null
      }

      // 如果小于，执行的删除操作，默认重新排列 map 的 index，忽略掉 null
      if (dataSrc.length < dataMap.length) {
        // map 对应删除一项（之所以要删除对应项，因为是要跟映射面板对应起来）
        if (this.removeColIndex) {
          dataMap = [...dataMap.slice(0, this.removeColIndex), ...dataMap.slice(this.removeColIndex + 1)]
          // 删除后重新排列 index
          let index: number = 0
          for (let i = 0; i < dataMap.length; i++) {
            dataMap[i].index = index++
          }
          newBlock.props.map[0] = dataMap
          this.removeColIndex = null
        }

        // 执行了删除整列操作，根据 dataSrc 重新排列 map 即可
        else if (this.removeAllCol) {
          if (dataSrc.length <= 0) return
          let newDataMap = []
          // 折柱混合单独处理
          if (newBlock.templateId === '5544734748594536332') {
            for (let i = 0; i < dataSrc.length; i++) {
              if (i === 0) {
                newDataMap.push({
                  name: 'X轴对象',
                  index: i,
                  allowType: ['string'],
                  isLegend: false,
                  function: 'objCol',
                  configurable: true,
                })
              } else if (i === 1) {
                newDataMap.push({
                  name: '折线列',
                  index: i,
                  allowType: ['number'],
                  isLegend: false,
                  function: 'vCol',
                  configurable: true,
                })
              } else {
                newDataMap.push({
                  name: '数值列',
                  index: i,
                  allowType: ['number'],
                  isLegend: false,
                  function: 'vCol',
                  configurable: true,
                })
              }
            }
            // 斜率图
          } else if (newBlock.templateId === '154778232785223023') {
            for (let i = 0; i < dataSrc.length; i++) {
              if (i === 0) {
                newDataMap.push({
                  name: 'X轴对象',
                  index: i,
                  allowType: ['string'],
                  isLegend: true,
                  function: 'objCol',
                  configurable: true,
                })
              } else if (i === 1) {
                newDataMap.push({
                  name: '数值列',
                  index: i,
                  allowType: ['number'],
                  isLegend: false,
                  function: 'vCol',
                  configurable: true,
                })
              } else {
                newDataMap.push({
                  name: '数值列',
                  index: i,
                  allowType: ['number'],
                  isLegend: false,
                  function: 'vCol',
                  configurable: true,
                })
              }
            }
            // 气泡图
          } else if (this.bubbleList.indexOf(newBlock.templateId) > -1) {
            for (let i = 0; i < dataSrc.length; i++) {
              if (i === 0) {
                newDataMap.push({
                  name: '对象',
                  index: i,
                  allowType: ['string'],
                  isLegend: true,
                  function: 'objCol',
                  configurable: true,
                })
              } else {
                newDataMap.push({
                  name: '数值列',
                  index: i,
                  allowType: ['number'],
                  isLegend: false,
                  function: 'vCol',
                  configurable: true,
                })
              }
            }
          } else {
            for (let i = 0; i < dataSrc.length; i++) {
              if (i === 0) {
                newDataMap.push({
                  name: 'X轴对象',
                  index: i,
                  allowType: ['string'],
                  isLegend: false,
                  function: 'objCol',
                  configurable: true,
                })
              } else {
                newDataMap.push({
                  name: '数值列',
                  index: i,
                  allowType: ['number'],
                  isLegend: false,
                  function: 'vCol',
                  configurable: true,
                })
              }
            }
          }
          newBlock.props.map[0] = newDataMap
        }

        // 其他默认处理
        else {
          newBlock.props.map[0] = _.take(dataMap, dataSrc.length)
        }
      }

      // 如果大于，执行新增操作，默认在尾部添加一个最新 map
      else if (dataSrc.length > dataMap.length) {
        // 新增也补齐颜色面板
        newBlock.props.colors.list = handleColorList(newBlock, dataObj.changeRowCol)
        // 折柱混合图
        if (newBlock.templateId === '5544734748594536332') {
          const dataLength = dataSrc.length
          const mapLength = dataMap.length
          for (let i = 0; i < dataLength - mapLength; i++) {
            dataMap.push({
              name: '柱图列',
              index: dataMap.length,
              allowType: ['number'],
              isLegend: false,
              function: 'vCol',
              configurable: true,
            })
          }
          let index: number = 0
          for (let i = 0; i < dataMap.length; i++) {
            if (i === 1) {
              dataMap[i].name = '折线列'
            }
            dataMap[i].index = index++
          }
          newBlock.props.map[0] = dataMap
        } else {
          // 根据 dataSrc 长度补齐 Map
          const diffLength = dataSrc.length - dataMap.length
          for (let i = 0; i < diffLength; i++) {
            dataMap.push({
              name: '数值列',
              index: 0,
              allowType: ['number'],
              isLegend: false,
              function: 'vCol',
              configurable: true,
            })
          }
          // 重新排列 index
          let index: number = 0
          for (let i = 0; i < dataMap.length; i++) {
            dataMap[i].index = index++
          }
          newBlock.props.map[0] = dataMap
        }
      } else {
        newBlock.props.map[0] = dataMap
      }

      // cross 补齐颜色列表
      if (this.removeAllCol) {
        let newChartColorList = newBlock.props.colors.list
        const delList = _.cloneDeep(this.removeAllCol)
        for (let i = 0; i < delList.length; i++) {
          newChartColorList[delList[i][0] - 1] = undefined
        }
        // 剔除 undefined 项，但是需要保留 null 项
        var colorList = newChartColorList.filter((item) => item != undefined)
        newBlock.props.colors.list = colorList
      } else {
        newBlock.props.colors.list = handleColorList(newBlock, dataObj.changeRowCol)
      }
    }
    // key-value 类型图表
    else if (newBlock.templateSwitch === 'key-value') {
      // 针对 key-value 类型图表，新增数据的时候颜色列表也需要补齐
      // 但是对于颜色类型为 single 的图表，则略过
      if (newBlock.props.colors.type !== 'single') {
        if (this.removeAllRow) {
          let newChartColorList = newBlock.props.colors.list
          let newChartSvgList
          if (newBlock.props.pictures && newBlock.props.pictures.svglist) {
            newChartSvgList = newBlock.props.pictures.svglist
          }
          const delList = _.cloneDeep(this.removeAllRow)
          for (let i = 0; i < delList.length; i++) {
            newChartColorList[delList[i][0] - 1] = undefined
            if (newChartSvgList) {
              newChartSvgList[delList[i][0] - 1] = undefined
            }
          }
          // 剔除 undefined 项，但是需要保留 null 项
          var colorList = newChartColorList.filter((item) => item != undefined)
          if (newChartSvgList) {
            newBlock.props.pictures.svglist = newChartSvgList.filter((item) => item != undefined)
          }
          newBlock.props.colors.list = colorList
        } else {
          newBlock.props.colors.list = handleColorList(newBlock, dataObj.changeRowCol)
        }
      }
    }
    // 对应的颜色列表也要调整（圆堆积还是之前逻辑）
    else if (
      newBlock.templateId === '8000000011111111001' ||
      newBlock.templateId === '8000000011111111002' ||
      newBlock.templateId === '8000000011111111003'
    ) {
      let newDataPictures
      if (newBlock.props.pictures) {
        newDataPictures = newBlock.props.pictures.urlList
      } else {
        newDataPictures = []
      }
      let dynamicChartColorList = newBlock.props.colors.list
      if (this.removeAllCol) {
        const delList = _.cloneDeep(this.removeAllCol)
        for (let i = 0; i < delList.length; i++) {
          newDataPictures[delList[i][0] - 1] = undefined
          dynamicChartColorList[delList[i][0] - 1] = undefined
        }
        // 剔除 undefined 项，但是需要保留 null 项
        var picList = newDataPictures.filter((item) => item !== undefined)
        var colorList = dynamicChartColorList.filter((item) => item !== undefined)
        newBlock.props.pictures.urlList = picList
        newBlock.props.colors.list = colorList
      } else {
        newBlock.props.colors.list = handleColorList(newBlock, dataObj.changeRowCol)
      }
    } else {
      // 桑基图 气泡图等 逻辑未处理
      if (newBlock.props.colors) {
        newBlock.props.colors.list = handleColorList(newBlock, dataObj.changeRowCol)
      }
    }

    let newData: UpdateProjectContent = {
      target: {
        blockId: newBlock.blockId,
        pageId: this.curPageId,
        type: newBlock.type,
      },
      method: 'put',
      block: newBlock,
    }

    // 归位
    this.removeAllCol = null
    this.removeAllRow = null

    if (this.projectType === 'infographic') {
      this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData))
    } else if (this.projectType === 'chart') {
      this._store.dispatch(new UpdateCurrentChartProjectArticleAction(this.projectId, newData))
    }
  }

  onRemoveColIndex(index) {
    this.removeColIndex = index
  }

  onRemoveAllCol(indexArr) {
    this.removeAllCol = indexArr
  }

  onRemoveAllRow(indexArr) {
    this.removeAllRow = indexArr
  }

  onLineMouseDown(event) {
    const dx = event.clientX // 当第一次单击的时候，存储 x 轴的坐标
    const dy = event.clientY // 当第一次单击的时候，储存 y 轴的坐标
    const dw = this.tbWidth
    document.onmousemove = (devent: MouseEvent) => {
      const diEvent = devent
      const newTbW = dx - diEvent.clientX + dw
      if (newTbW < 240) {
        this.tbWidth = 240
        return
      }
      if (newTbW > 860) {
        this.tbWidth = 860
        return
      }
      this.tbWidth = newTbW
    }
    document.onmouseup = () => {
      document.onmousedown = null
      document.onmousemove = null
    }
  }

  onSelected() {
    this.tables.onSelected()
  }

  ngOnDestroy() {}
}
