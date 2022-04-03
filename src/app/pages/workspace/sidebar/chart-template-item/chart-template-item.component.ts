/*
 * @Description: 插入图表
 */
import { Component, OnInit, OnChanges, Input, ElementRef, ViewChild, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { UpdateCurrentProjectArticleAction, UpdateCurrentChartProjectArticleAction } from '../../../../states/actions/project.action';
import { UpdateProjectContent } from '../../../../states/models/project.model';
import * as fromRoot from '../../../../states/reducers';
import { UtilsService } from '../../../../share/services/utils.service';
import * as $ from 'jquery';
import { VipService } from '../../../../share/services/vip.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { InsertSingleChartTipComponent } from '../../../../components/modals';
import { Subscription } from '../../../../../../node_modules/rxjs';
import * as ProjectActions from '../../../../states/actions/project.action';
import { NotifyChartRenderService } from '../../../../share/services/notify-chart-render.service';
import { handleAllChartsData } from '../../settings/chart-settings/chart-right-settings/handleColor';

@Component({
  selector: 'lx-chart-template-item',
  templateUrl: './chart-template-item.component.html',
  styleUrls: ['./chart-template-item.component.scss']
})
export class ChartTemplateItemComponent implements OnInit, OnChanges {
  @Input() type: string;
  @Input() data;
  @Input() pageId: string;
  @Input() classifyBy: string;
  @Input() searchText: string;
  @Input() isToggle: boolean;

  // 当前选中的 block
  @Input() curBlock;
  @Input() curPageId;

  // 判断是否是切换列表
  @Input() isToggleList;
  toggleTitle = '插入';

  // 当前选中图表的类型
  curChartType;

  // 如果当前选中的图是 key-value，推荐的时候去掉占比类
  showRecommendCover: boolean = false;

  componentRef: ComponentRef<any>;

  projectId: string;
  projectType: string;
  chartList = [];
  newChartList = [];
  newChartListType = [];
  chartTemplateList = [];

  isVpl: string;

  insertInfoChartSubscription = new Subscription();
  insertSingleChartSubscription = new Subscription();
  toggleChartSubscription = new Subscription();
  project;

  // 颜色
  legendIndex;
  legendList;
  colors;
  linearGradientStyle;

  // 当前图表的类型是不是包含占比类
  isProportion: boolean = false;

  // 新图表列表方便打 new 标签11个
  newChartTagList = [
    '5612096174443311145',
    '154777693253141239',
    '7612096173333355103',
    '7612096173333355101',
    '7612096176663355107',
    '7612096176663355103',
    '7612096176663355104',
    '7612096176663355105',
    '7612096174443355101',
    '7612096174443355102',
    '7612096176663355106'
  ];


  constructor(
    private _activatedRouter: ActivatedRoute,
    private _store: Store<fromRoot.State>,
    private _utilsService: UtilsService,
    private _el: ElementRef,
    private _vipService: VipService,
    private modalService: BsModalService,
    private _notifyChartRenderService: NotifyChartRenderService,
  ) {
    this.projectId = this._activatedRouter.snapshot.queryParams.project;
    this.projectType = this._activatedRouter.snapshot.queryParams.type;
  }

  ngOnInit() {
    if (this.curBlock && this.curBlock.function_type) {
      // 是否本身是占比类,本身是占比类仍然推荐占比类
      this.isProportion = this.curBlock.function_type.indexOf('占比类') >= 0;
    }

    this.isVpl = this._vipService.getVipLevel();
    this.parseData();
    if (this.isToggleList) {
      this.toggleTitle = '切换';
    }
  }

  ngAfterViewInit(): void {
    this.chartTemplateList = this.newChartList;
  }

  ngOnChanges(changes) {
    if (!changes.curBlock) {
      this.parseData();
    }
  }

  ngOnDestroy(): void {
    this.insertInfoChartSubscription.unsubscribe();
    this.insertSingleChartSubscription.unsubscribe();
    this.toggleChartSubscription.unsubscribe();
  }

  parseData() {
    // 初始化列表，默认赋值
    this.chartList = this.data;
    if (this.curBlock) {
      this.curChartType = this.curBlock.templateSwitch;
    }

    // 图表筛选分组
    this.filterChartTemplates();

    // 默认显示图表分类
    this.chartTemplateList = this.newChartList;

    // 搜索功能
    if (this.classifyBy === 'byChartType') {
      this.inputSearch(this.newChartList);
    } else {
      this.inputSearch(this.newChartListType);
    }
  }

  inputSearch(data) {
    // 判断是否进行搜索过滤
    const searchList = {
      title: '',
      data: []
    };
    if (this.searchText) {
      _.forEach(data, (list) => {
        _.forEach(list.data, item => {
          if (_.includes(item.title, this.searchText)) {
            searchList.title = list.title;
            searchList.data.push(item);
          }
        });
      });
      this.chartTemplateList = [];
      // 过滤掉重复图表
      const filterArr = _.uniqBy(searchList.data, 'templateId');
      searchList.data = filterArr;

      this.chartTemplateList.push(searchList);

      // 对查询后的数组再次进行分类
      this.filterChartTemplates(searchList.data);
    } else {
      this.chartTemplateList = data;
    }
  }

  filterChartTemplates(arr?) {

    // 如果传递了数组，则对传入的数组进行筛选，如果没有传递，则使用全局数组（初始化）
    let filterArr;
    if (arr) {
      filterArr = arr;
    } else {
      filterArr = this.data;
    }

    // 图表类型分类
    const dynamicList = [];
    const pieList = [];
    const lineList = [];
    const barList = [];
    const areaList = [];
    const splashesList = [];
    const polarList = [];
    const relationList = [];
    const panelList = [];
    const treeList = [];
    const sankeyList = [];
    const funnelList = [];
    const hotList = [];
    const otherList = [];

    // 图表类型筛选
    _.forEach(filterArr, (item) => {
      if (item.chart_type === '动态图表') {
        dynamicList.push(item);
      } else if (item.chart_type === '饼图') {
        pieList.push(item);
      } else if (item.chart_type === '线形图') {
        lineList.push(item);
      }
      else if (item.chart_type === '柱状图') { barList.push(item); }
      else if (item.chart_type === '面积图') { areaList.push(item); }
      else if (item.chart_type === '散点图') { splashesList.push(item); }
      else if (item.chart_type === '极坐标图') { polarList.push(item); }
      else if (item.chart_type === '关系图') { relationList.push(item); }
      else if (item.chart_type === '仪表盘') { panelList.push(item); }
      else if (item.chart_type === '树图') { treeList.push(item); }
      else if (item.chart_type === '桑基图') { sankeyList.push(item); }
      else if (item.chart_type === '漏斗图') { funnelList.push(item); }
      else if (item.chart_type === '热力图') { hotList.push(item); }
      else { otherList.push(item) }
    })

    // 图表类型赋值
    this.newChartList = [
      { title: '动态图表', data: dynamicList },
      { title: '饼图', data: pieList },
      { title: '线形图', data: lineList },
      { title: '柱状图', data: barList },
      { title: '面积图', data: areaList },
      { title: '散点图', data: splashesList },
      { title: '极坐标图', data: polarList },
      { title: '关系图', data: relationList },
      { title: '仪表盘', data: panelList },
      { title: '树图', data: treeList },
      { title: '桑基图', data: sankeyList },
      { title: '漏斗图', data: funnelList },
      { title: '热力图', data: hotList },
      { title: '其他', data: otherList }
    ]

    // 过滤掉空数组
    this.newChartList = this.newChartList.filter(item => item.data.length > 0);

    // 功能性分类
    let compareList = []
    let shipList = []
    let branchList = []
    let ratioList = []
    let timeList = []
    let proportionList = []
    let flowList = []

    // 功能性筛选
    _.forEach(filterArr, (item) => {
      if (_.includes(item.function_type, '比较类')) { compareList.push(item) }
      if (_.includes(item.function_type, '层级类')) { shipList.push(item) }
      if (_.includes(item.function_type, '分布类')) { branchList.push(item) }
      // if (_.includes(item.function_type, '比例类')) { ratioList.push(item) }
      if (_.includes(item.function_type, '趋势类')) { timeList.push(item) }
      if (_.includes(item.function_type, '占比类')) { proportionList.push(item) }
      if (_.includes(item.function_type, '流向类')) { flowList.push(item) }
    })

    // 功能性赋值
    this.newChartListType = [
      { title: '比较', data: compareList },
      { title: '趋势', data: timeList },
      { title: '占比', data: proportionList },
      { title: '分布', data: branchList },
      { title: '流向', data: flowList },
      { title: '层级', data: shipList },
      // { title: '比例类', data: ratioList },
    ]

    // 过滤掉空数组
    this.newChartListType = this.newChartListType.filter(item => item.data.length > 0);

    // 根据当前所选类型进行赋值
    if (this.classifyBy === 'byChartType') {
      this.chartTemplateList = this.newChartList;
    } else {
      this.chartTemplateList = this.newChartListType;
    }
  }

  insertChart(e, item, i) {
    if (this.isToggleList) {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', `edit-right-changechart-changed`]);
    } else {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', `edit-insert-chart-index${item.label}`, i]);
    }

    const blockId = this._utilsService.generate_uuid();
    const templateId = e.currentTarget.parentElement.parentElement.getAttribute('templateId');

    // 如果 isToggle 存在，则表示为切换图表
    if (this.isToggle) {
      this.toggleChartHandle(blockId, templateId)
    } else {
      if (this.projectType === 'infographic') {
        this.insertInfoChartHandle(blockId, templateId)
      } else if (this.projectType === 'chart') {
        this.insertSingleChartHandle(blockId, templateId)
      }
    }
  }

  // 插入信息图
  insertInfoChartHandle(blockId, templateId) {
    // 否则则是插入图表
    let block = _.cloneDeep(_.find(this.chartList, function (o) {
      return o.templateId === templateId;
    }));

    this.insertInfoChartSubscription
      .add(this._store.select(fromRoot.getCurrentProjectFull).subscribe(project => {
        this.project = project;
      }))

    block.projectId = this.projectId;
    block.blockId = blockId;

    let scale: number = Number.parseInt(document.querySelector('.page-size span').innerHTML)
    let left, top;

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

    const theme = this.project.article.contents.theme;
    block.theme = theme

    // 更新缓存数据
    localStorage.setItem('block', JSON.stringify({
      target: {
        blockId: blockId,
        pageId: this.pageId,
        type: block.type
      },
      block: block,
      projectId: this.projectId
    }))

    // 更新数据
    let newData: UpdateProjectContent = {
      target: {
        blockId: blockId,
        pageId: this.pageId,
        type: block.type
      },
      method: 'add',
      block: block
    }
    this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData));

    // 让当前新插入的图表选中
    this.curBlockSelected(block);
  }

  // 插入单图
  insertSingleChartHandle(blockId, templateId) {
    // 获取当前需要插入图表
    let block = _.cloneDeep(_.find(this.chartList, function (o) {
      return o.templateId === templateId;
    }));

    this.insertSingleChartSubscription
      .add(this._store.select(fromRoot.getCurrentChartProjectFull).subscribe(project => {
        this.project = project;
      }))

    block.projectId = this.projectId;
    block.blockId = blockId;

    block.position = {
      top: 0,
      left: 0
    }

    if (this.project.article.contents.pages[0].blocks.length === 0) {
      const theme = this.project.article.contents.theme;
      this.uploadDesign(this.project.article.contents.design, 'redo')
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
      this._store.dispatch(new ProjectActions.UpdateCurrentChartProjectArticleAction(this.projectId, addData));
    } else {
      this.modalService.show(InsertSingleChartTipComponent, {
        initialState: {
          projectId: this.projectId,
          pageId: this.pageId,
          newBlock: block,
          curBlock: this.project.article.contents.pages[0].blocks[0],
          project: this.project
        }
      });
    }

    // 让当前新插入的图表选中
    this.curBlockSelected(block);
  }

  // 切换图表
  toggleChartHandle(blockId, templateId) {
    // 保存滚动距离
    const scrollTop = $('.toggle-chart-template').scrollTop();

    // 删除之前的图表
    let delBlock = _.cloneDeep(this.curBlock);
    let delData: any = {
      target: {
        blockId: delBlock.blockId,
        pageId: this.curPageId,
        type: delBlock.type,
        flag: 'toggle'
      },
      method: 'delete',
      block: delBlock
    }
    if (this.projectType === 'infographic') {
      this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, delData));
    } else if (this.projectType === 'chart') {
      this._store.dispatch(new UpdateCurrentChartProjectArticleAction(this.projectId, delData));
    }

    // 获取项目信息
    if (this.projectType === 'infographic') {
      this.toggleChartSubscription
        .add(this._store.select(fromRoot.getCurrentProjectFull).subscribe(project => {
          this.project = project;
        }))
    } else if (this.projectType === 'chart') {
      this.toggleChartSubscription
        .add(this._store.select(fromRoot.getCurrentChartProjectFull).subscribe(project => {
          this.project = project;
        }))
    }

    // curBlock - 当前选中的图（原图）
    // newBlock - 新图
    let newBlock = _.cloneDeep(_.find(this.chartList, function (o) {
      return o.templateId === templateId;
    }));

    // map 映射
    const newBlockType = newBlock.templateSwitch;

    newBlock.blockId = this.curBlock.blockId
    newBlock.position = this.curBlock.position
    newBlock.dataSrc.data = this.curBlock.dataSrc.data

    // 其他图表还是之前的逻辑
    newBlock.props.tooltip = this.curBlock.props.tooltip
    newBlock.props.legend = this.curBlock.props.legend
    newBlock.props.backgroundColor = this.curBlock.props.backgroundColor
    newBlock.props.size = this.curBlock.props.size
    if (newBlock.props.font && this.curBlock.props.font) {
      newBlock.props.font = this.curBlock.props.font
    }
    let copyNewBlock;
    // 表格切其他图表
    if (this.curBlock.templateId == '7955555555502346001') {
      copyNewBlock = this.chartList.filter(item => item.templateId == newBlock.templateId)[0];
      this.curBlock.props.colors = _.cloneDeep(copyNewBlock['props'].colors);
    }
    // 表格不用
    // if (newBlock.templateId !== '7955555555502346001' && newBlock.props.colors.list && this.curBlock.props.colors.list) {
    //   newBlock.props.colors.list = this.curBlock.props.colors.list
    // }
    if (newBlock.templateSwitch !== 'cross' || newBlock.props.colors.type !== 'single') {
      if (this.curBlock.props.colors && newBlock.props.colors && newBlock.props.colors.list && this.curBlock.props.colors.list) {
        let colorList = [];
        this.curBlock.props.colors.list.forEach((item, index) => {
          colorList[index] = item;
        });
        newBlock.props.colors.list = colorList;
      }
    }
    // console.log(newBlock);
    newBlock.props.logoDisplay = this.curBlock.props.logoDisplay;
    newBlock.props.publishDisplay = this.curBlock.props.publishDisplay;
    newBlock.props.watermarkDisplay = this.curBlock.props.watermarkDisplay;
    newBlock.props.unitDisplay = this.curBlock.props.unitDisplay;
    newBlock.props.sourceDisplay = this.curBlock.props.sourceDisplay;
    newBlock.props.titleDisplay = this.curBlock.props.titleDisplay;

    // 主题
    const theme = _.cloneDeep(this.project.article.contents.theme);
    newBlock.theme = theme;
    if (newBlock.props.axis) {
      newBlock.props.axis.color = theme.axis.color;
      if (newBlock.props.axis.grid) {
        newBlock.props.axis.grid.color = theme.grid.color;
      }
    }

    // map处理，如果数据列表长度小于两列，不做切换处理 表格不处理map
    if (this.curBlock.dataSrc.data[0][0].length >= 2 && this.curBlock.templateId !== '7955555555502346001') {
      if (newBlockType === 'key-value') {

        const curBlockMapVcolList = this.formatCurDataToNumberList();
        if (curBlockMapVcolList.length === 0) {
          curBlockMapVcolList.push(1)
        }

        // 将选中图表的 objCol 的 index 赋予新表对应的 objCol 的 index（key-value 类型的表 vCol 取对应的第一个）
        const newBlockMapList = newBlock.props.map[0];
        for (let i = 0; i < newBlockMapList.length; i++) {
          if (newBlockMapList[i].function === 'objCol') {
            newBlockMapList[i].index = this.getCurBlockMapObjColIndex();
          } else if (newBlockMapList[i].function === 'vCol') {
            newBlockMapList[i].index = this.formatCurDataToNumberList()[0];
          }
        }
      } else if (newBlockType === 'cross') {
        // 如果当前选中的图表类型是 cross
        if (this.curBlock.templateSwitch === 'cross') {
          // 得到当前选中图表的 vCol
          const curBlockMapList = this.curBlock.props.map[0].slice(1);
          // 新表保留 objCol，用当前选中图表的 vCol 进行替换
          const newBlockMapList = _.dropRight(newBlock.props.map[0], (newBlock.props.map[0].length - 1))
          newBlockMapList.push(...curBlockMapList)
          newBlock.props.map[0] = newBlockMapList;

        } else if (this.curBlock.templateSwitch === 'cross-time') {
          const newBlockMapList = _.cloneDeep(newBlock.props.map[0])
          newBlockMapList[0] = { name: "X轴对象", index: 0, allowType: ["string"], isLegend: false, function: "objCol", configurable: false }
          newBlock.props.map[0] = newBlockMapList
        } else {
          // 获取当前选中图表的数据长度（取 data 第一行的长度）
          const curBlockDataSrc = this.curBlock.dataSrc.data[0][0]
          // 获取选中图表 map 的 vCol 的 index 列表
          const curBlockMapVcolIndex = this.formatCurDataToNumberList()
          // 新的图表的 vCol 列表
          const newDataMapVcolList = []
          let index = 1;
          // 循环比对，生成新的 vCol
          for (let i = 1; i < curBlockDataSrc.length; i++) {
            let configurable = false;
            for (let j = 0; j < curBlockMapVcolIndex.length; j++) {
              if (i === curBlockMapVcolIndex[j]) {
                configurable = true;
              }
            }
            newDataMapVcolList.push({ "name": "数值列", "index": index++, "allowType": ["number"], "isLegend": false, "function": "vCol", "configurable": configurable })
          }
          // 新表的 map 列表保留 objCol，其余删除
          const newBlockMapList = _.dropRight(newBlock.props.map[0], (newBlock.props.map[0].length - 1))
          newBlockMapList.push(...newDataMapVcolList)

        }
      } else if (newBlockType === 'cross-time') {
        if (this.curBlock.templateSwitch === 'cross-time') {
          newBlock.props.map[0] = this.curBlock.props.map[0]
        } else if (this.curBlock.templateSwitch === 'cross') {
          const newBlockMapList = _.cloneDeep(newBlock.props.map[0])
          newBlockMapList[0] = { name: "时间", index: 0, allowType: ["date"], isLegend: false, function: "timeColUni", configurable: true }
          newBlock.props.map[0] = newBlockMapList
        }
      } else if (newBlockType === 'obj-n-value') {

        const curBlockMapVcolList = this.formatCurDataToNumberList();
        if (curBlockMapVcolList.length === 0) {
          curBlockMapVcolList.push(1)
        }

        // 如果当前选中的图表类型是 cross
        if (this.curBlock.templateSwitch === 'cross') {

          // 获取当前选中图表的 vCol 的 index
          const curBlockMapVcolList = this.formatCurDataToNumberList(this.curBlock.templateSwitch);
          if (curBlockMapVcolList.length === 0) {
            curBlockMapVcolList.push(1)
          }

          // 获取当前选中图表的 objCol（cross 图表的 objCol 默认为第一个）
          const crossObjCol = this.curBlock.props.map[0][0];

          // 赋值给新增的图表（objCol）
          const newBlockMapList = newBlock.props.map[0];
          const newBlockMapVcolList = [];
          for (let i = 0; i < newBlockMapList.length; i++) {
            if (newBlockMapList[i].function === 'typeCol') {
              newBlockMapList[i].index = crossObjCol.index;
            }
            if (newBlockMapList[i].function === 'objCol') {
              newBlockMapList[i].index = crossObjCol.index;
            }
            if (newBlockMapList[i].function === 'vCol') {
              newBlockMapVcolList.push(newBlockMapList[i])
            }
          }

          // 参数为当前选中图表的 vCol 的 index 列表和新的图表的 vCol 列表
          this.setObjValueMapColList(curBlockMapVcolList, newBlockMapVcolList);

        } else if (this.curBlock.templateSwitch === 'obj-n-value') {

          // 获取当前选中图表的 vCol 的 index
          const curBlockMapVcolList = this.formatCurDataToNumberList();
          const curBlockMapList = this.curBlock.props.map[0]

          // 获取当前选中图表的 typeCol
          const curBlockTypeCol = _.find(curBlockMapList, o => {
            return o.function === 'typeCol';
          });
          // 获取当前选中图表的 objCol
          const curBlockObjCol = _.find(curBlockMapList, o => {
            return o.function === 'objCol';
          });

          // 赋值给新增的图表（objCol）
          const newBlockMapList = newBlock.props.map[0];
          const newBlockMapVcolList = [];
          for (let i = 0; i < newBlockMapList.length; i++) {
            if (newBlockMapList[i].function === 'typeCol' && curBlockTypeCol) {
              newBlockMapList[i].index = curBlockTypeCol.index;
            }
            if (newBlockMapList[i].function === 'objCol') {
              if (curBlockObjCol) {
                newBlockMapList[i].index = curBlockObjCol.index;
              } else if (curBlockTypeCol) {
                newBlockMapList[i].index = curBlockTypeCol.index;
              }
            }
            if (newBlockMapList[i].function === 'vCol') {
              newBlockMapVcolList.push(newBlockMapList[i])
            }
          }

          // 参数为当前选中图表的 vCol 的 index 列表和新的图表的 vCol 列表
          this.setObjValueMapColList(curBlockMapVcolList, newBlockMapVcolList);

        } else {

          // 获取当前选中图表的 vCol 的 index
          const curBlockMapVcolList = this.formatCurDataToNumberList();
          const curBlockMapList = this.curBlock.props.map[0]

          // 获取当前选中图表的 objCol
          const curBlockObjCol = _.find(curBlockMapList, o => {
            return o.function === 'objCol';
          });

          // 赋值给新增的图表（objCol）
          const newBlockMapList = newBlock.props.map[0];
          const newBlockMapVcolList = [];
          for (let i = 0; i < newBlockMapList.length; i++) {
            if (newBlockMapList[i].function === 'typeCol') {
              newBlockMapList[i].index = curBlockObjCol.index;
            }
            if (newBlockMapList[i].function === 'objCol') {
              newBlockMapList[i].index = curBlockObjCol.index;
            }
            if (newBlockMapList[i].function === 'vCol') {
              newBlockMapVcolList.push(newBlockMapList[i])
            }
          }

          // 参数为当前选中图表的 vCol 的 index 列表和新的图表的 vCol 列表
          this.setObjValueMapColList(curBlockMapVcolList, newBlockMapVcolList);

        }

      } else if (newBlockType === 'tree-value' || newBlockType === 'obj-type-value') {

        if (this.curBlock.templateSwitch === 'tree-value' || this.curBlock.templateSwitch === 'obj-type-value') {

          // 获取图表的 map 列表
          const curBlockMapList = this.curBlock.props.map[0]
          const newBlockMapList = newBlock.props.map[0]

          // 获取当前选中图表的 typeCol
          const curBlockTypeCol = _.find(curBlockMapList, o => {
            return o.function === 'typeCol';
          });

          // 获取当前选中图表的 objCol
          const curBlockObjCol = _.find(curBlockMapList, o => {
            return o.function === 'objCol';
          });

          // 获取当前选中图表的 objCol
          const curBlockVcol = _.find(curBlockMapList, o => {
            return o.function === 'vCol';
          });

          for (let i = 0; i < newBlockMapList.length; i++) {
            if (newBlockMapList[i].function === 'typeCol') {
              newBlockMapList[i].index = curBlockTypeCol.index;
            }
            if (newBlockMapList[i].function === 'objCol') {
              newBlockMapList[i].index = curBlockObjCol.index;
            }
            if (newBlockMapList[i].function === 'vCol') {
              newBlockMapList[i].index = curBlockVcol.index;
            }
          }

        } else {

          // 获取当前选中图表的 mapList
          const curBlockMapList = this.curBlock.props.map[0]

          // 获取当前选中图表的 typeCol
          const curBlockTypeCol = _.find(curBlockMapList, o => {
            return o.function === 'typeCol';
          });

          // 获取当前选中图表的 objCol
          const curBlockObjCol = _.find(curBlockMapList, o => {
            return o.function === 'objCol';
          });

          // 获取当前选中图表的 vCol
          const curBlockVcol = _.find(curBlockMapList, o => {
            return o.function === 'vCol';
          });

          // 获取当前选中图表的 targetCol
          const curBlockTargetcol = _.find(curBlockMapList, o => {
            return o.function === 'targetCol';
          });

          // 赋值给新增的图表（objCol）
          const newBlockMapList = newBlock.props.map[0];

          for (let i = 0; i < newBlockMapList.length; i++) {
            if (newBlockMapList[i].function === 'objCol') {
              if (curBlockObjCol) {
                newBlockMapList[i].index = curBlockObjCol.index;
              } else {
                if (curBlockTypeCol) {
                  newBlockMapList[i].index = curBlockTypeCol.index;
                } else {
                  return false;
                }
              }
            }
            if (newBlockMapList[i].function === 'typeCol') {
              if (curBlockTypeCol) {
                newBlockMapList[i].index = curBlockTypeCol.index;
              } else if (curBlockTargetcol) {
                newBlockMapList[i].index = curBlockTargetcol.index;
              } else {

                let trueArr, falseArr;
                [trueArr, falseArr] = this.formatNewDataNumberList()

                if (falseArr.length > 0) {
                  newBlockMapList[i].index = falseArr[0];
                } else {
                  newBlockMapList[i].index = curBlockObjCol.index;
                }
              }
            }
            if (newBlockMapList[i].function === 'vCol') {
              if (curBlockVcol) {
                newBlockMapList[i].index = curBlockVcol.index;
              } else {
                newBlockMapList[i].index = 1;
              }
            }
          }
        }

      } else if (newBlockType === 'sankey') {

        if (this.curBlock.templateSwitch === 'sankey') {

          // 获取图表的 map 列表
          const curBlockMapList = this.curBlock.props.map[0]
          const newBlockMapList = newBlock.props.map[0]

          // 获取当前选中图表的 objCol
          const curBlockObjCol = _.find(curBlockMapList, o => {
            return o.function === 'objCol';
          });

          // 获取当前选中图表的 typeCol
          const curBlockTargetCol = _.find(curBlockMapList, o => {
            return o.function === 'targetCol';
          });

          // 获取当前选中图表的 objCol
          const curBlockVcol = _.find(curBlockMapList, o => {
            return o.function === 'vCol';
          });

          for (let i = 0; i < newBlockMapList.length; i++) {
            if (newBlockMapList[i].function === 'objCol') {
              newBlockMapList[i].index = curBlockObjCol.index;
            }
            if (newBlockMapList[i].function === 'targetCol') {
              newBlockMapList[i].index = curBlockTargetCol.index;
            }
            if (newBlockMapList[i].function === 'vCol') {
              newBlockMapList[i].index = curBlockVcol.index;
            }
          }

        } else {

          // 获取目标图表的 map 列表
          const newBlockMapList = newBlock.props.map[0]

          for (let i = 0; i < newBlockMapList.length; i++) {
            if (newBlockMapList[i].function === 'objCol') {
              newBlockMapList[i].index = 0;
            }
            if (newBlockMapList[i].function === 'targetCol') {
              newBlockMapList[i].index = 0;
            }
            if (newBlockMapList[i].function === 'vCol') {
              newBlockMapList[i].index = 2;
            }
          }

          // 如果当前选中的图表的数据不足三列，返回
          const curBlockData = this.curBlock.dataSrc.data[0];
          if (curBlockData[0].length < 3) {
            newBlockMapList[2].index = 1;
          }

        }

      } else if (newBlockType === 'tree') {

        if (this.curBlock.templateSwitch === 'tree') {

          // 获取图表的 map 列表
          const curBlockMapList = this.curBlock.props.map[0]
          const newBlockMapList = newBlock.props.map[0]

          // 获取当前选中图表的 objCol
          const curBlockSourceCol = _.find(curBlockMapList, o => {
            return o.function === 'sourceCol';
          });

          // 获取当前选中图表的 typeCol
          const curBlockTargetCol = _.find(curBlockMapList, o => {
            return o.function === 'targetCol';
          });

          for (let i = 0; i < newBlockMapList.length; i++) {
            if (newBlockMapList[i].function === 'sourceCol') {
              newBlockMapList[i].index = curBlockSourceCol.index;
            }
            if (newBlockMapList[i].function === 'targetCol') {
              newBlockMapList[i].index = curBlockTargetCol.index;
            }
          }
        } else {
          // 获取目标图表的 map 列表
          const newBlockMapList = newBlock.props.map[0]

          for (let i = 0; i < newBlockMapList.length; i++) {
            if (newBlockMapList[i].function === 'sourceCol') {
              newBlockMapList[i].index = 0;
            }
            if (newBlockMapList[i].function === 'targetCol') {
              newBlockMapList[i].index = 1;
            }
          }
        }

      } else if (newBlockType === 'sunburst') { }
    }

    // 表格不用切换color 与legend
    if (newBlock.templateId !== '7955555555502346001') {

      // 解析赋值后新图表的 legend
      // this.parseLegendList(newBlock);
      this.legendList = handleAllChartsData(newBlock);

      // 获取新图表所需的颜色个数
      const newBlockNeedColorList = this.legendList;

      // 获取新图表当前的颜色列表个数
      let newBlockCurColoList = newBlock.props.colors.list;

      // 处理新图表的颜色列表
      if (newBlock.props.colors.type === 'multiple') {

        if (newBlockCurColoList.length >= newBlockNeedColorList.length) {
          // 当前颜色列表个数大于如果所需个数（删减）
          // newBlock.props.colors.list = _.take(newBlockCurColoList, newBlockNeedColorList.length)
        } else {
          let colors = []
          // 补齐颜色
          newBlockNeedColorList.map((item, index) => {
            let num = index
            if (num > 14) {
              num = this.down14(num)
            }
            colors.push(num)
          })
          newBlock.props.colors.list = colors;
          // 小于的话就补齐
          // const diffLength = newBlockNeedColorList.length - newBlockCurColoList.length;
          // for (let i = 0; i < diffLength; i++) {
          //   let index = newBlockCurColoList.length;
          //   newBlock.props.colors.list.push(index++)
          // }
        }
      }

      // 单独处理折柱混合图的 Map 列表（默认指定第二列为折线列）
      if (newBlock.templateId === '5544734748594536332') {
        newBlock.props.map[0][1].name = '折线列';
      }
    }

    if (this.curBlock.templateId === '7955555555502346001') {
      newBlock.props.map = copyNewBlock.props.map;
      newBlock.props.legend = copyNewBlock.props.legend;
      newBlock.props.axis = copyNewBlock.props.axis;
    }

    // 添加图表数据
    let addData: any = {
      target: {
        blockId: newBlock.blockId,
        pageId: this.curPageId,
        type: newBlock.type,
        flag: 'toggle'
      },
      method: 'add',
      block: newBlock
    }

    if (this.projectType === 'infographic') {
      this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, addData));
    } else if (this.projectType === 'chart') {
      this._store.dispatch(new UpdateCurrentChartProjectArticleAction(this.projectId, addData));
    }

    // 让当前替换图表选中
    // this.curBlockSelected(newBlock);
    // 避免单图因失去焦点引起的菜单收缩
    setTimeout(() => {
      $('.right-content').css('width', '280px')
      // $('.header-container').css('padding-right', '280px')
      $('.change-page').css('right', '295px')
      // 修复滚动条位置
      $('.toggle-chart-template').scrollTop(scrollTop)
      // 让当前新插入的图表选中
      this.curBlockSelected(newBlock);
    }, 300);
  }

  // 处理大于 14 的数字转成 0- 14
  down14(num) {
    if (num % 15 === 0) {
      num = 0;
    } else {
      num = Math.abs(num - Math.floor(num / 15) * 15);
    }
    return num;
  }

  formatLinearColor(block) {
    const colorList = block.props.colors.list;
    if (colorList.length >= 2) {
      return [colorList[0], colorList[1]]
    } else if (colorList.length < 2) {
      return [colorList[0], '#fff']
    }
  }

  formatColor(block, type) {
    switch (type) {
      case 'single':
        return [block.props.colors.list[0]]
      case 'linear':
        return this.formatLinearColor(block);
      case 'multiple':
        return block.props.colors.list
      default:
        break;
    }
  }

  // 处理新图表，生成一个映射数组，提取出 dataSrc 中纯数字项，返回两个数组 [true, false]
  formatNewDataNumberList() {
    let dataSrcNumberMapTrueList = [];
    let dataSrcNumberMapFalseList = [];
    let data = _.unzip(_.cloneDeep(this.curBlock.dataSrc.data[0]).slice(1));
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        if (!isNaN(data[i][j] as any)) {
          data[i][j] = true;
        } else {
          data[i][j] = false;
        }
      }
    }
    for (let i = 0; i < data.length; i++) {
      if (!data[i].includes(false)) {
        dataSrcNumberMapTrueList.push(i)
      } else {
        dataSrcNumberMapFalseList.push(i)
      }
    }
    return [dataSrcNumberMapTrueList, dataSrcNumberMapFalseList]
  }

  // 处理选中的图表，生成一个由 vCol 对应的 index 生成的数组
  formatCurDataToNumberList(type?) {
    const dataMapList = _.cloneDeep(this.curBlock.props.map[0]);
    let curDataMapResultArr = [];
    if (type && type === 'cross') {
      for (let i = 0; i < dataMapList.length; i++) {
        if (dataMapList[i].function === 'vCol' && dataMapList[i].configurable === true) {
          curDataMapResultArr.push(dataMapList[i].index)
        }
      }
    } else {
      for (let i = 0; i < dataMapList.length; i++) {
        if (dataMapList[i].function === 'vCol') {
          curDataMapResultArr.push(dataMapList[i].index)
        }
      }
    }
    return curDataMapResultArr;
  }

  // 根据当前选中的图表的 map，提取出 objCol 或者 typeCol 对应的 index
  getCurBlockMapObjColIndex() {
    let curBlockMapObjColIndex;
    const curBlockMapList = this.curBlock.props.map[0];
    for (let i = 0; i < curBlockMapList.length; i++) {
      if (curBlockMapList[i].function === 'objCol' || curBlockMapList[i].function === 'typeCol') {
        curBlockMapObjColIndex = curBlockMapList[i].index;
      }
    }
    return curBlockMapObjColIndex;
  }

  // 赋值给新增的图表（vCol）
  setObjValueMapColList(curBlockMapVcolList, newBlockMapVcolList) {
    // 如果选中图表的 vCol 可用列表大于目标图表的 vCol 长度，循环赋值
    if (curBlockMapVcolList.length >= newBlockMapVcolList.length) {
      for (let i = 0; i < newBlockMapVcolList.length; i++) {
        newBlockMapVcolList[i].index = curBlockMapVcolList[i]
      }
    } else {
      // 否则就将选中图表的 vCol 可用列表补全
      const diffLength = newBlockMapVcolList.length - curBlockMapVcolList.length;
      for (let i = 0; i < diffLength; i++) {
        curBlockMapVcolList.push(curBlockMapVcolList[0])
      }
      for (let i = 0; i < newBlockMapVcolList.length; i++) {
        newBlockMapVcolList[i].index = curBlockMapVcolList[i]
      }
    }
  }

  // 格式化 legend
  // parseLegendList(block) {
  //   // 表格兼容
  //   if (!block.props.colors) {
  //     this.legendList = [];
  //   } else if (block.props.colors.type === 'multiple') {
  //     const templateSwitch = block.templateSwitch;

  //     if (templateSwitch === 'cross') {

  //       let index = _.findIndex(block.props.map[0], (o: any) => {
  //         return o.isLegend === true;
  //       })

  //       if (index === -1) {
  //         this.legendList = block.dataSrc.data[0][0].slice(1);
  //       } else {
  //         this.legendIndex = block.props.map[0][index].index;

  //         let list = [];
  //         _.forEach(block.dataSrc.data[0], (o, i) => {
  //           if (Number(i) > 0) {
  //             list.push(o[this.legendIndex]);
  //           }
  //         });
  //         this.legendList = _.uniq(list);
  //         this.legendList = list;
  //         this.legendList = list;
  //       }

  //     } else if (templateSwitch === 'cross-time') {
  //       this.legendList = (block.dataSrc.data[0])[0].slice(1)
  //     } else if (templateSwitch === 'obj-n-value-time') {
  //       let legendIndex = block.props.map[0][_.findIndex(block.props.map[0], (o: any) => {
  //         return o.isLegend === true;
  //       })].index;
  //       legendIndex = legendIndex ? legendIndex : 1
  //       this.legendList = _.uniq(_.unzip(block.dataSrc.data[0])[legendIndex].slice(1))
  //     } else if (_.includes(['key-value', 'obj-n-value'], templateSwitch)) {

  //       let list = [];

  //       // 区间面积图单独处理
  //       if (block.templateId === '7612096176663355103') {
  //         this.legendList = (block.dataSrc.data[0])[0]
  //       } else {
          
  //         this.legendIndex = block.props.map[0][_.findIndex(block.props.map[0], (o: any) => {
  //           return o.isLegend === true;
  //         })].index;

  //         if (block.templateId === '5544734748594536503') {
  //           _.forEach(block.dataSrc.data[0].sort((a, b) => { return b[1] - a[1] }), (o, i) => {
  //             if (Number(i) > 0) {
  //               list.push(o[this.legendIndex]);
  //             }
  //           });
  //           this.legendList = list;
  //         } else {
  //           _.forEach(block.dataSrc.data[0], (o, i) => {
  //             if (Number(i) > 0) {
  //               list.push(o[this.legendIndex]);
  //             }
  //           });

  //           if (block.templateId === '4612096174443311107') {
  //             this.legendList = _.uniq(list);
  //           } else {
  //             this.legendList = list;
  //           }
  //         }
  //       }

  //     } else if (_.includes(['obj-type-value'], templateSwitch)) {

  //       this.legendIndex = block.props.map[0][_.findIndex(block.props.map[0], (o: any) => {
  //         return o.isLegend === true;
  //       })].index;

  //       let list = [];
  //       _.forEach(block.dataSrc.data[0], (o, i) => {
  //         if (Number(i) > 0) {
  //           list.push(o[this.legendIndex]);
  //         }
  //       });

  //       this.legendList = _.uniq(list);

  //     } else if (_.includes(['tree-value'], templateSwitch)) {

  //       if (block.templateId === '4612096174443311115') {
  //         let indexList = [];
  //         let list1 = [];
  //         let list2 = [];

  //         _.forEach(block.props.map[0], (o, i) => {
  //           if (o.isLegend) {
  //             indexList.push(i);
  //           }
  //         })

  //         _.forEach(block.dataSrc.data[0], (o, i) => {
  //           if (Number(i) > 0) {
  //             list1.push(o[indexList[0]]);
  //             list2.push(o[indexList[1]]);
  //           }
  //         })
  //         this.legendList = _.uniq(list1.concat(list2))
  //       } else {
  //         this.legendIndex = block.props.map[0][_.findIndex(block.props.map[0], (o: any) => {
  //           return o.isLegend === true;
  //         })].index;

  //         let list = [];

  //         _.forEach(block.dataSrc.data[0], (o, i) => {
  //           if (Number(i) > 0) {
  //             list.push(o[this.legendIndex]);
  //           }
  //         });

  //         this.legendList = _.uniq(list);
  //       }

  //     } else if (templateSwitch === 'sankey') {

  //       let indexList = [];
  //       let list1 = [];
  //       let list2 = [];

  //       _.forEach(block.props.map[0], (o, i) => {
  //         if (o.isLegend) {
  //           indexList.push(i);
  //         }
  //       })

  //       _.forEach(block.dataSrc.data[0], (o, i) => {
  //         if (Number(i) > 0) {
  //           // 之所以两列，是需要先去重在拼接
  //           list1.push(o[indexList[0]]);
  //           list2.push(o[indexList[1]]);
  //         }
  //       })
  //       this.legendList = _.uniq(_.flatten(_.zip(list1, list2)))

  //     } else if (_.includes(['sunburst', 'tree'], templateSwitch)) {
  //       if (block.templateId === '5543734748594537504') {
  //         const sunData = block.dataSrc.data[0];
  //         const sunMap = block.props.map[0];
  //         const { root } = this.solveDataHierarchyWithoutValue(sunData, sunMap)
  //         const sunLegendList = []

  //         if (root.name !== '') {
  //           sunLegendList.push(root.name)
  //         }

  //         _.forEach(root.children, (v) => {
  //           sunLegendList.push(v.name)
  //         })

  //         this.legendList = sunLegendList;
  //       } else {
  //         this.legendList = [];
  //       }
  //     }
  //   }
  // }

  // 旭日图提取 legend
  // solveDataHierarchyWithoutValue(dataset, map) {
  //   let sourceCol = 0, // 父节点列
  //     targetCol = 0;  // 子节点列

  //   map.forEach(function (d) {
  //     if (d.function === "sourceCol") {
  //       sourceCol = d.index;
  //     } else if (d.function === "targetCol") {
  //       targetCol = d.index;
  //     };
  //   });

  //   const nodesArr = [];
  //   const nodesObj = {};
  //   let nodeIndex = 0;

  //   const dataLength = dataset.length;
  //   for (let i = 1; i < dataLength; i++) {
  //     const row = dataset[i];
  //     const source = row[sourceCol],
  //       target = row[targetCol];

  //     // 如果source与target为空，忽略; 如果两者相同，忽略
  //     if (!source || !target || source === target) {
  //       continue;
  //     }

  //     // 有未声明的source节点，新增
  //     if (!nodesObj[source]) {
  //       const sourceNode = {
  //         name: source,
  //         index: nodeIndex
  //       };

  //       nodesObj[source] = sourceNode;
  //       nodesArr.push(sourceNode);
  //       nodeIndex++;
  //     };

  //     // 有未声明的target节点，新增
  //     if (!nodesObj[target]) {
  //       const targetNode = {
  //         name: target,
  //         index: nodeIndex
  //       };

  //       nodesObj[target] = targetNode;
  //       nodesArr.push(targetNode);
  //       nodeIndex++;
  //     };

  //     // 将source节点赋值给变量s
  //     const s = nodesObj[source];

  //     // 将target节点赋值给变量t
  //     const t = nodesObj[target];

  //     //若target对象的parent已经存在，则不再进行操作
  //     if (!t.parent) {
  //       t.parent = s;
  //       // 若source对象children为null，创建数组
  //       if (!s.children) {
  //         s.children = [t];
  //       } else {
  //         s.children.push(t);
  //       };
  //     };
  //   } // end for loop

  //   // 根节点
  //   let root = null;

  //   // 没有父节点的节点数组
  //   const nodesWithoutParent = nodesArr.filter(d => !d.parent);

  //   if (nodesWithoutParent.length === 1) {
  //     // 只有一个节点没有父节点，那么这个节点就是根节点
  //     root = nodesWithoutParent[0];
  //   } else if (nodesWithoutParent.length > 1) {
  //     // 有多个节点没有父节点，那么新建一个对象作为根节点
  //     root = {
  //       name: "",
  //       children: nodesWithoutParent
  //     };
  //   } else {
  //     // 如果找不到没有父节点的节点，说明数据陷入循环，抛出错误
  //     //勉强将相关值设为空
  //     root = {
  //       name: "",
  //       children: []
  //     };
  //     // throw new Error("数据有错误，节点关系陷入循环，找不到根节点！");
  //   }

  //   this.noteNodesDepth(root);

  //   return {
  //     nodesObj: nodesObj,
  //     nodesArr: nodesArr,
  //     root: root
  //   };
  // }

  // // 节点循环
  // noteNodesDepth(node) {
  //   // 从上而下计算，下层直接从上层获取值，不需要返回值
  //   const depth = node.depth ? node.depth : (node.depth = 0);
  //   const that = this;
  //   if (node.children) {
  //     node.children.forEach(function (d) {
  //       d.depth = depth + 1;
  //       that.noteNodesDepth(d);
  //     });
  //   }
  // }

  // 选中当前图表
  curBlockSelected(newBlock) {
    let blockList = []
    let blockBoxList = $('.page').find('.block-container');
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

  // 更新design
  uploadDesign(design, flag) {
    let newDesign = _.cloneDeep(design)
    let newData: UpdateProjectContent = {
      target: {
        pageId: this.curPageId,
        type: 'article',
        target: flag ? 'redo' : null
      },
      method: 'put',
      design: newDesign
    }
    this._store.dispatch(new UpdateCurrentChartProjectArticleAction(this.projectId, newData));
  }

}
