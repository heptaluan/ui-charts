import { Component, OnInit, Output, Input, ViewChild, EventEmitter, ComponentFactory, ComponentFactoryResolver } from '@angular/core';
import * as Handsontable from 'handsontable';
import { HotTableRegisterer } from '@handsontable/angular';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import * as fromRoot from '../../../states/reducers';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import * as $ from 'jquery';
import * as ProjectActions from '../../../states/actions/project.action';
import NP from 'number-precision';
import * as _ from 'lodash';
import { Router } from '@angular/router';

import { VipService } from '../../../share/services/vip.service';
import * as XLSX from 'xlsx';
import { ChartDirective } from '../../../block/chart.directive';
import { BlockComponent } from '../../../block/block.component';

import { GetChartTemplateListAction } from '../../../states/actions/template.action';

import { UpgradeMemberComponent } from '../../../components/modals/upgrade-member/upgrade-member.component';
import { ToastrService } from 'ngx-toastr';
import { ContactUsModalComponent } from '../contact-us-modal/contact-us-modal.component';
import { API } from '../../../states/api.service';
import { CompleteBlockService } from '../../../share/services/complete-block.service';
import { catchError } from 'rxjs/operators';
import { NotifyChartRenderService } from '../../../share/services/notify-chart-render.service';

@Component({
  selector: 'lx-upload-data-modal',
  templateUrl: './upload-data-modal.component.html',
  styleUrls: ['./upload-data-modal.component.scss']
})

export class UploadDataModalComponent implements OnInit {

  leftTitle = '上传数据';

  @ViewChild('uploadBox') uploadBox;
  @ViewChild(ChartDirective) chartHost: ChartDirective;
  @ViewChild('divFather') divFather;
  @ViewChild('uploadDataContainerBox') uploadDataContainerBox;

  modalType: string;
  dataId;   // 接收传进来的 id
  option;   // 接收传进来的操作

  // 表格配置项
  uploadDataBoxStyle;
  data: any[] = [
    [
      []
    ]
  ];

  oneStep: boolean = true;
  twoStep: boolean = false;
  threeStep: boolean = false;
  fourStep: boolean = false;
  oneStepButtonGroup: boolean = false;
  twoStepButtonGroup: boolean = false;
  threeStepButtonGroup: boolean = false;
  fourStepButtonGroup: boolean = false;
  tbHeight: 460;
  isDisabled = false;
  @Input() width: number;

  @Output() tbAfterChange = new EventEmitter();
  @Output() removeColIndex = new EventEmitter();

  mySubscribe = new Subscription();

  radioModel = 0;
  tableMaxLength = 1;
  private clipboardCache = '';

  isDynamicChart: boolean = false
  playDynamicChart: boolean = false

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

  settings = {
    manualColumnResize: true,        // 手动更改列距
    colHeaders: true,                // 自定义列表头，可以传递 data 或者布尔值
    rowHeaders: true,                // 行表头，同上
    className: 'htMiddle',
    minCols: 20,                     // 最小行列
    minRows: 40,
    minSpareCols: 1,                 // 列留白
    minSpareRows: 1,                 // 行留白
    rowHeights: 28,
    colWidths: 100,
    copyable: true,
    sortIndicator: true,
    columnSorting: true,             // 允许排序
    allowEmpty: false,
    sortFunction: (sortOrder, columnMeta) => {
      return (a, b) => {
        const hotInstance = this.hotRegisterer.getInstance(`tb${this.radioModel}`);
        if (hotInstance) {
          var plugin = hotInstance.getPlugin('columnSorting');
          var sortfunction = plugin.defaultSort;;

          if (a[0] === 0) {          // 忽略第一行排序
            return -1;
          }

          const aValue = a[1];
          const bValue = b[1];

          if (isNaN(aValue) && isNaN(bValue) && sortOrder != null) {
            const re = /^(\d+\.?\d?)/
            const aPre = re.exec(aValue);
            const bPre = re.exec(bValue);
            if (aPre && bPre) {
              const result = NP.strip(parseFloat(aPre[0])) >= NP.strip(parseFloat(bPre[0]));
              return sortOrder ? result : !result;
            } else {
              return sortfunction(sortOrder, columnMeta)(a, b);
            }
          } else {
            switch (columnMeta.type) {
              case 'date':
                sortfunction = plugin.dateSort;
                break;
              case 'numeric':
              default:
                sortfunction = plugin.numericSort;
            }
            return sortfunction(sortOrder, columnMeta)(a, b);
          }
        }
        return -1;
      };
    },
    afterCopy: (changes) => {
      this.clipboardCache = this.stringify(changes);
    },
    afterCut: (changes) => {
      this.clipboardCache = this.stringify(changes);
    },
    afterPaste: (changes) => {
      this.clipboardCache = this.stringify(changes);
    },
  };

  originWindowResize: (ev: UIEvent) => void;
  // 是否上传文件
  isUploadFile: boolean = true;

  currentBlock: any;

  // 第三步
  initialState;

  chartClassifyTemplateList = [
    {
      cover: '/dyassets/images/chart-list/all.svg',
      title: '全部'
    },
    {
      cover: '/dyassets/images/chart-list/bingtu.svg',
      title: '饼图'
    },
    {
      cover: '/dyassets/images/chart-list/zhexiantu.svg',
      title: '线形图'
    },
    {
      cover: '/dyassets/images/chart-list/zhuzhuangtu.svg',
      title: '柱状图'
    },
    {
      cover: '/dyassets/images/chart-list/mianjitu.svg',
      title: '面积图'
    },
    {
      cover: '/dyassets/images/chart-list/sandiantu.svg',
      title: '散点图'
    },
    {
      cover: '/dyassets/images/chart-list/leidatu.svg',
      title: '极坐标图'
    },
    {
      cover: '/dyassets/images/chart-list/guanxitu.svg',
      title: '关系图'
    },
    {
      cover: '/dyassets/images/chart-list/yibiaopan.svg',
      title: '仪表盘'
    },
    {
      cover: '/dyassets/images/chart-list/shutu.svg',
      title: '树图'
    },
    {
      cover: '/dyassets/images/chart-list/sangjitu.svg',
      title: '桑基图'
    },
    {
      cover: '/dyassets/images/chart-list/loudoutu.svg',
      title: '漏斗图'
    },
    {
      cover: '/dyassets/images/chart-list/rilitu.svg',
      title: '热力图'
    },
    {
      cover: '/dyassets/images/chart-list/ciyuntu.svg',
      title: '其他'
    },
    {
      cover: '/dyassets/images/chart-list/dongtai.svg',
      title: '动态图表'
    },
  ];
  chartFunctionTemplateList = [
    {
      cover: '/dyassets/images/chart-list/all.svg',
      title: '全部'
    },
    {
      cover: '/dyassets/images/chart-list/bijiaolei.svg',
      title: '比较'
    },
    {
      cover: '/dyassets/images/chart-list/shijianlei.svg',
      title: '趋势'
    },
    {
      cover: '/dyassets/images/chart-list/zhanbilei.svg',
      title: '占比'
    },
    {
      cover: '/dyassets/images/chart-list/fenbulei.svg',
      title: '分布'
    },
    {
      cover: '/dyassets/images/chart-list/liuchenglei.svg',
      title: '流向'
    },
    {
      cover: '/dyassets/images/chart-list/guanxilei.svg',
      title: '层级'
    }
  ];
  chartClassifyIndex = 0;         // 图表类型
  chartPriceIndex = 0;            // 图表价格
  activeIndex: number = 0;        // 默认选中
  chartTitleTemplates = [];       // 顶部分类选择
  chartTemplates = [];            // 模版列表
  chartFilterTemplates = [];
  chartPriceTotalTemplates = [];  // 模版总数

  infoTemplates = [];             // 信息图列表
  infoFilterTemplates = [];       // 信息图筛选列表
  infoTypeIndex = 0;              // 信息图类型
  infoClassifyIndex = 0;          // 信息图分类目录
  infoSecondClassifyIndex = 0;    // 信息图二级分类
  infoFirstClassify = [];         // 信息图第一列分类列表
  infoSecondClassify = [];        // 信息图第二列分类列表

  priceValue = 'all';             // 下拉框
  orderValue = 'date';            // 下拉框

  // 存储按条件筛选参数
  infoScene_id = 0;
  infoParent_id = 0;
  infoOrder = 'date';
  infoLevel = 1;
  infoPrice = 'all';
  infoType = '';
  userName: string;               // 用户名字（判断登录）

  totalLength;                    // 信息图与单图总长度
  allProjects$;

  dataType: any[];
  isVpl: string = 'None';
  mySubscription = new Subscription();

  // 上传文件地址
  private uploadUrl = `${this._api.getOldUrl()}/datastore/user_upload_data/`;
  private uploadDataTitle = '未命名';

  // 跨域允许
  httpOptions = { withCredentials: true };

  getTemplateListSubscription = new Subscription();
  createEmptyTemplateSubscription = new Subscription();
  forkChartProject = new Subscription();
  forkInfoProject = new Subscription();
  allProjectScription = new Subscription();

  // 自适应宽度
  widthStyle: string = 'auto';


  constructor(
    private hotRegisterer: HotTableRegisterer,
    private _store: Store<fromRoot.State>,
    public bsModalRef: BsModalRef,
    private _router: Router,
    private _http: HttpClient,
    private _vipService: VipService,
    private modalService: BsModalService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private toastr: ToastrService,
    private _api: API,
    private _completeBlockService: CompleteBlockService,
    private _notifyChartRenderService: NotifyChartRenderService,
  ) {
    this.allProjects$ = this._store.select(fromRoot.getAllProjectList);
  }

  ngOnInit() {
    // 获取模版列表
    this._store.dispatch(new GetChartTemplateListAction());

    // 获取全部项目列表
    this._store.dispatch(new ProjectActions.GetAllProjectListAction());

    this.isVpl = this._vipService.getVipLevel();
    this.originWindowResize = window.onresize;
    window.onresize = (event: UIEvent) => {
      if (this.originWindowResize) {
        this.originWindowResize(event);
      }
    };

    // 弹窗大小
    this.uploadDataBoxStyle = {
      'width': innerWidth - 100 + 'px',
      'height': innerHeight - 100 + 'px'
    }

    // 调整弹框内部宽度
    this.resetWidth();

    // 判断弹窗类型，因为来源有两个位置，如果是空白表格点击来的直接显示第二个弹窗，隐藏第一步
    if (this.modalType === 'blank') {
      this.oneStep = false;
      this.twoStep = true;
      this.oneStepButtonGroup = true;
      this.twoStepButtonGroup = false;
      // 如果打开空白表格存在 id，则获取这条 id 的数据
      if (this.dataId) {
        this.getOneData();
        this.leftTitle = '一键可视化';
        if (this.option === 'edit') {
          this.leftTitle = '编辑数据';
        }
      }
    }

    // 第三步
    // 判断是否登录
    this.getUserInfo();

    // 默认按分类排序
    this.chartTitleTemplates = this.chartClassifyTemplateList;

    // 获取图表
    this.getChartList();
    this.chartPriceTotalTemplates = this.chartTemplates;

    // 获取项目长度
    this.allProjectScription.add(this.allProjects$.subscribe(list => {
      this.totalLength = list.length;
    }))

    // 设置右键菜单
    setTimeout(() => {
      this.configTable();
    }, 100);
  }

  // 初始化创建弹窗宽度
  resetWidth() {
    let nowWidth = document.documentElement.clientWidth; //  获取屏幕宽度
    if (nowWidth < 1520) {
      this.widthStyle = '1040px';
    } else if (nowWidth >= 1520 && nowWidth < 1760) {
      this.widthStyle = '1303px';
    } else if (nowWidth >= 1760 ) {
      this.widthStyle = '1566px';
    }
  }

  // 获取 id 对应的数据
  getOneData() {
    this._http.get(`${this.uploadUrl}${this.dataId}/`, this.httpOptions)
      .subscribe(res => {
        if (res) {
          this.data = res['data']['data'];
          this.uploadDataTitle = res['data']['title'];
        }
      })
  }

  inputChangHandle(ev) {
    var files = ev.target.files[0];
    this.uploadFileHandle(files)
  }

  uploadFileHandle(files) {
    // 判断文件格式
    if (!/\.(xlsx|xls|XLSX|XLS|csv|CSV)$/.test(files.name)) {
      alert(`上传文件格式不正确！`);
      return false;
    }

    // 获取文件标题（用于上传）
    this.uploadDataTitle = files.name.split('.')[0];

    // 判断文件大小
    if (files.size > 2 * 1024 * 1024) {
      alert(`上传文件不能大于2M！`);
      return false;
    }

    // 解析上传的 excel
    let isCSV = files.name.split(".").reverse()[0] == 'csv';
    // 读取完成的数据
    let wb;
    let that = this;
    let reader = new FileReader();
    let data;
    let daraSrc;
    if (isCSV) {
      reader.readAsText(files, 'gb2312');
      reader.onload = function () {
        data = reader.result;
        daraSrc = _.map(_.dropRight(data.split(/\n/)) as any, item => item.split(','));
        that.data = [daraSrc]
        that.oneStep = false;
        that.twoStep = true;
        that.oneStepButtonGroup = true;
        that.twoStepButtonGroup = false;
      };
    } else {
      reader.readAsBinaryString(files);
      reader.onload = function (e) {
        data = e.target['result'];
        wb = XLSX.read(data, {
          type: 'binary'
        });
        // wb.SheetNames[0] 是获取 Sheets 中第一个 Sheet 的名字
        // wb.Sheets[Sheet名] 获取第一个 Sheet 的数据
        // 分割为数组，在去掉末尾自带的一个空行，数据最多为前两页（现在只读第一页）
        daraSrc = _.map(_.dropRight(XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]).split(/\n/)), item => item.split(','));
        that.data = [daraSrc]
        that.oneStep = false;
        that.twoStep = true;
        that.oneStepButtonGroup = true;
        that.twoStepButtonGroup = false;
      };
    }

    // 设置右键菜单
    setTimeout(() => {
      this.configTable();
    }, 100);
  }

  // 切换 table 的时候更改滚动条，使其强制刷新
  reloadTable() {
    $('.wtHolder').scrollLeft(1);
  }

  ngAfterViewInit() {

    // 动态调整弹窗高度
    this.uploadDataContainerBox.nativeElement.style.height = innerHeight - 189 + 'px';

    const that = this;
    this.uploadBox.nativeElement.ondragover = function (ev) {
      ev.preventDefault();
    }
    this.uploadBox.nativeElement.ondragenter = function (ev) {
      ev.target.classList.add('over')
    }
    this.uploadBox.nativeElement.ondragleave = function (ev) {
      ev.target.classList.remove('over')
    }
    this.uploadBox.nativeElement.ondrop = function (ev) {
      ev.stopPropagation();
      ev.preventDefault();
      var files = ev.dataTransfer.files[0];
      that.uploadFileHandle(files);
    }
  }

  isListEquals(a, b) {
    const ajson = JSON.stringify(a);
    const bjson = JSON.stringify(b);
    return ajson == bjson;
  }

  configTable() {
    for (let i = 0; i <= this.tableMaxLength; i++) {
      this.setTableContextMenu(this.hotRegisterer.getInstance(`tb${i}`))
    }
  }

  // 右键菜单
  setTableContextMenu(hotInstance) {
    var that = this;
    if (hotInstance) {
      hotInstance.updateSettings({
        contextMenu: {
          callback: (key, options) => {
            if (key === 'ascending' || key === 'descending') {
              const sortPlugin = hotInstance.getPlugin('columnSorting');
              if (options[0].start.col === options[0].end.col) {
                sortPlugin.hot.sort(options[0].start.col, key == 'ascending');
              }
            } else if (key === 'remove_row') {
              console.log('remove_row');
              this.emitUpdate(this.radioModel, hotInstance);
            }
          },
          items: {
            'cut': {
              name: '剪切'
            },
            'copy': {
              name: '复制'
            },
            'hr1': '---------',
            'paste': {
              name: '粘贴（外部数据请用Ctrl+V）',
              disabled: function () {
                return that.clipboardCache.length === 0;
              },
              callback: function () {
                var plugin = this.getPlugin('copyPaste');
                this.listen();
                plugin.paste(that.clipboardCache);
              }
            },
            'hr2': '---------',
            'remove': {
              name: '清除',
              callback: function () {
                const index = hotInstance.getSelectedLast()[1];
                that.removeColIndex.emit(index);
                return hotInstance.emptySelectedCells()
              }
            },
            '删除整行': {
              name: '删除整行',
              disabled: () => {
                const selectedColLength = hotInstance.getSelectedLast()[3]
                const allColLength = hotInstance.countCols() - 1
                return selectedColLength !== allColLength;
              },
              callback() {
                const index = hotInstance.getSelectedLast()[0];
                hotInstance.alter('remove_row', index);
                that.emitUpdate(this.radioModel, hotInstance);
              }
            },
            '删除整列': {
              name: '删除整列',
              disabled: () => {
                const selectedRowLength = hotInstance.getSelectedLast()[2]
                const allRowLength = hotInstance.countRows() - 1
                // 选中超过两行，禁用（endCol - startCol）
                const selectedCol = hotInstance.getSelected()[0];
                const selectedColLength = selectedCol[3] - selectedCol[1];
                if (selectedRowLength === allRowLength && selectedColLength === 0) {
                  return false;
                } else {
                  return true;
                }
              },
              callback() {
                const index = hotInstance.getSelectedLast()[1];
                hotInstance.alter('remove_col', index);
                that.removeColIndex.emit(index);
                that.emitUpdate(this.radioModel, hotInstance);
              }
            },
            'hr3': '---------',
            'row_above': {
              name: '在上方插入一行'
            },
            'row_below': {
              name: '在下方插入一行',
            },
            'hr4': '---------',
            'ascending': {
              name: '升序',
              disabled: () => {
                const selectedColLength = hotInstance.getSelectedLast()[2]
                const allColLength = hotInstance.countRows() - 1
                return selectedColLength !== allColLength;
              }
            },
            'descending': {
              name: '降序',
              disabled: () => {
                const selectedColLength = hotInstance.getSelectedLast()[2]
                const allColLength = hotInstance.countRows() - 1
                return selectedColLength !== allColLength;
              }
            },
          }
        }
      }, false);
    }
  }

  afterRemoveCellMeta(event, key) {
    console.log(`afterRemoveCellMeta`);
    this.emitUpdate(key, event.hotInstance);
  }

  afterChange(event, key) {
    console.log(`afterChange`);
    // 不是 loadData
    if (event.hotInstance && event.params[0]) {
      this.emitUpdate(key, event.hotInstance);
    }
  }

  afterColumnMove(event, key) {
    console.log(`afterColumnMove`);
    this.emitUpdate(key, event.hotInstance);
  }

  afterColumnSort(event, key) {
    console.log(`afterColumnSort`);
    if (event.hotInstance) {
      this.emitUpdate(key, event.hotInstance);
    }
  }

  emitUpdate(key, instance) {
    const totalCol = instance.countCols();
    const totalRow = instance.countRows();

    let wideCol = totalCol;
    for (let i = totalCol - 1; i >= 0; i--) {
      if (!instance.isEmptyCol(i)) {
        wideCol = i;
        break;
      }
    }
    let wideRow = totalRow;
    for (let i = totalRow - 1; i >= 0; i--) {
      if (!instance.isEmptyRow(i)) {
        wideRow = i;
        break;
      }
    }

    const subData = instance.getData(0, 0, wideRow, wideCol);
    const newData = _.cloneDeep(this.data);
    newData.splice(key, 1, subData);
    this.tbAfterChange.emit(newData);
  }

  removeListNull() {
    const instance = this.hotRegisterer.getInstance(`tb${this.radioModel}`);
    if (instance) {
      const totalCol = instance.countCols();
      const totalRow = instance.countRows();

      let wideCol = totalCol;
      for (let i = totalCol - 1; i >= 0; i--) {
        if (!instance.isEmptyCol(i)) {
          wideCol = i;
          break;
        }
      }
      let wideRow = totalRow;
      for (let i = totalRow - 1; i >= 0; i--) {
        if (!instance.isEmptyRow(i)) {
          wideRow = i;
          break;
        }
      }

      const subData = instance.getData(0, 0, wideRow, wideCol);
      return subData;
    }
    return this.data;
  }

  onSelected() {
    console.log('left-selected');
  }

  rowRenderer(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    td.style.fontSize = '12px';
    td.style.color = '#000000';
    if (row == 0) {
      td.style.fontWeight = 'bold';
    }
  }

  ngOnDestroy() {
    window.onresize = this.originWindowResize;
    this.mySubscribe.unsubscribe();

    // 第三步
    this.getTemplateListSubscription.unsubscribe();
    this.createEmptyTemplateSubscription.unsubscribe();
    this.forkChartProject.unsubscribe();
    this.forkInfoProject.unsubscribe();
  }

  // 处理粘贴
  stringify(arr) {
    var r, rlen, c, clen, str = '', val;
    for (r = 0, rlen = arr.length; r < rlen; r += 1) {
      for (c = 0, clen = arr[r].length; c < clen; c += 1) {
        if (c > 0) { str += '\t'; }
        val = arr[r][c];
        if (typeof val === 'string') {
          if (val.indexOf('\n') > -1) {
            str += '"' + val.replace(/"/g, '""') + '"';
          } else {
            str += val;
          }
        } else if (val === null || val === void 0) {
          str += '';
        } else {
          str += val;
        }
      }
      str += '\n';
    }
    return str;
  }

  // 文件流转 BinaryString
  fixdata(data) {
    var o = '', l = 0, w = 10240;
    for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
    return o;
  }

  // 第三步
  // 获取用户信息（判断是否登录）
  getUserInfo() {
    this.mySubscription.add(this._store.select(fromRoot.getUserInfo).filter(user => !!user).subscribe(user => {
      this.userName = user.nickname || user.loginname;
    }))
  }

  // 获取图表
  getChartList() {
    // 获取 template 列表
    this.getTemplateListSubscription
      .add(this._store.select(fromRoot.getChartTemplates).subscribe(data => {
        if (data.length !== 0) {
          // 表格入口去掉权重树图与旭日图
          this.chartTemplates = data.filter(item => {
            return item.templateId !== '5543734748594537504' && item.templateId !== '5543734748594536502';
          });
          this.chartFilterTemplates = data.filter(item => {
            return item.templateId !== '5543734748594537504' && item.templateId !== '5543734748594536502';
          });;
        }
      }))
  }

  // 图标类型切换
  changeChartClassify(index) {
    this.chartFilterTemplates = [];
    this.chartFilterTemplates = this.chartTemplates;
    this.chartClassifyIndex = index;
    this.activeIndex = 0;
    this.chartPriceIndex = 0;
    if (index === 0) {
      this.chartTitleTemplates = this.chartClassifyTemplateList;
    } else if (index === 1) {
      this.chartTitleTemplates = this.chartFunctionTemplateList;
    }
  }

  // 类型详情选择
  chartTemplateListClickHandle(item, index) {
    this.activeIndex = index;
    this.chartPriceTotalTemplates = [];
    if (this.chartClassifyIndex === 0) {
      this.chartFilterTemplates = [];
      if (item.title === '全部') {
        this.chartFilterTemplates = this.chartTemplates;
      } else {
        _.forEach(this.chartTemplates, (data) => {
          if (data.chart_type === item.title) { this.chartFilterTemplates.push(data) }
        })
      }
    } else {
      this.chartFilterTemplates = [];
      if (item.title === '全部') {
        this.chartFilterTemplates = this.chartTemplates;
      } else {
        _.forEach(this.chartTemplates, (data) => {
          // 匹配的是 XX类，所以后面加类
          if (_.includes(data.function_type, item.title + '类')) { this.chartFilterTemplates.push(data) }
        });
      }
    }
    this.chartPriceTotalTemplates = this.chartFilterTemplates;
    this.changeChartPrice(this.chartPriceIndex);
  }

  // 价格筛选
  changeChartPrice(index) {
    this.chartPriceIndex = index;
    switch (index) {
      case 0:
        this.chartFilterTemplates = this.chartPriceTotalTemplates;
        break;
      case 1:
        var arr = this.chartPriceTotalTemplates;
        this.chartFilterTemplates = arr.filter(item => item.isFree === '1');
        break;
      case 2:
        var arr1 = this.chartPriceTotalTemplates;
        this.chartFilterTemplates = arr1.filter(item => item.isFree === '0');
        break;
      default:
        break;
    }
  }

  // 上传文件状态切换
  isUploadFileHandle() {
    // 如果没有勾选上传，则不上传文件
    this.isUploadFile = !this.isUploadFile;
  }

  // 利用数据生成图表
  uploadExcelAndCsv() {

    // 过滤掉 block 当中的 null
    // 输出有数字的二维数组，中间空值不过滤
    let newData = _.cloneDeep(this.data);
    let colNumArr = [];
    let rowNumArr = [];

    let filterArr = newData[0].map((item,index) => {
      // 找出有长度的数组, 将 index 存进 colNumArr, 找最大 index
      if (_.compact(item).length > 0) {
        colNumArr.push(index);
      }
      // 找出数组有值的最后一个index, 将 index 存进 rowNumArr
      item.map((i,ind) => {
        if (i) {
          rowNumArr.push(ind);
        }
        return i;
      })
      return item;
    });

    // 将二维数组的长度变小，去掉有值之外的空值
    // 长度加一，因为是下标
    // colNumArr,rowNumArr 一个长度为 0 就表示数组为空
    if (colNumArr.length) {
      filterArr.length = Math.max(...colNumArr) + 1;
    } else {
      newData[0] = _.map(newData[0], item => { return _.compact(item) })
      this.data[0]= newData[0].filter(d => d.length > 0)
    };

    if (rowNumArr.length) {
      this.data[0] = filterArr.map(item => {
        item.length = Math.max(...rowNumArr) + 1;
        return item;
      })
    } else {
      newData[0] = _.map(newData[0], item => { return _.compact(item) });
      this.data[0]= newData[0].filter(d => d.length > 0);
    }

    this.oneStep = false;
    this.twoStep = false;
    this.threeStep = true;
    this.oneStepButtonGroup = false;
    this.twoStepButtonGroup = true;

    // 提示渲染图表外框，避免 echarts 在初始化时找不到 div，将 echarts 设置为默认值的问题
    this.fourStep = true;

  }

  // 排序列表
  chartTemplatesSort() {
    // 根据 data 推荐图表，图表的总列数
    let allCols;
    if (this.data[0].length !== 0) {
      allCols = this.data[0][0].length;
    }

    // 如果是空表格，则默认使用空字符串来进行填充，避免报错
    else {
      for (let i = 0; i < 5; i++) {
        this.data[0].push(new Array(2).fill(''))
      }
    }

    // 获取数据的 数据列 和 字符列
    const [numCols, stringCols] = this.formatNewDataNumberList();
    const newChartFilterTemplates = _.cloneDeep(this.chartFilterTemplates);

    // cross
    if (numCols.length >= 2 && numCols.length >= allCols - 1) {
      this.dataType = ['cross'];
      const filterArr = newChartFilterTemplates.reduce((acc, item) => {
        if (item.templateSwitch === 'cross') {
          acc.unshift(item);
        } else {
          acc.push(item);
        }
        return acc;
      }, [])
      this.chartFilterTemplates = filterArr;
      this.chartTemplates = filterArr;
      this.chartPriceTotalTemplates = filterArr;
    }

    // key-value
    else if (numCols.length == 1 && allCols >= 2) {
      this.dataType = ['key-value'];
      const filterArr = newChartFilterTemplates.reduce((acc, item) => {
        if (item.templateSwitch === 'key-value') {
          acc.unshift(item);
        } else {
          acc.push(item);
        }
        return acc;
      }, [])
      this.chartFilterTemplates = filterArr;
      this.chartTemplates = filterArr;
      this.chartPriceTotalTemplates = filterArr;
    }

    // obj-n-value
    else if (numCols.length >= 3) {
      this.dataType = ['obj-n-value'];
      const filterArr = newChartFilterTemplates.reduce((acc, item) => {
        if (item.templateSwitch === 'obj-n-value') {
          acc.unshift(item);
        } else {
          acc.push(item);
        }
        return acc;
      }, [])
      this.chartFilterTemplates = filterArr;
      this.chartTemplates = filterArr;
      this.chartPriceTotalTemplates = filterArr;
    }

    // obj-type-value, tree-value, sankey
    else if (numCols.length == 1 && allCols == 3) {
      this.dataType = ['obj-type-value', 'tree-value', 'sankey'];
      const filterArr = newChartFilterTemplates.reduce((acc, item) => {
        if (item.templateSwitch === 'obj-type-value' || item.templateSwitch === 'tree-value' || item.templateSwitch === 'sankey') {
          acc.unshift(item);
        } else {
          acc.push(item);
        }
        return acc;
      }, [])
      this.chartFilterTemplates = filterArr;
      this.chartTemplates = filterArr;
      this.chartPriceTotalTemplates = filterArr;
    }

    else {
      this.dataType = []
    }
  }

  // 第一步按钮事件
  oneStepButtonGroupHandle(flag?) {
    this.isDisabled = true;
    // 显示推荐图表
    this.chartTemplatesSort()

    const data = {
      title: this.uploadDataTitle,
      data: this.data
    };

    // 如果勾选了上传数据，则上传数据
    if (this.isUploadFile) {
      if (this.dataId) {
        this._http.put(`${this.uploadUrl}${this.dataId}/`, { data: this.data }, { withCredentials: true })
          .pipe(
            catchError(err => {
              this.toastr.error(null, '保存失败');
              return err;
            })
          )
          .subscribe(res => {
            if (res['resultCode'] === 1000) {
              if (this.option === 'edit') {
                this.toastr.success(null, '保存成功');
              }
              this.uploadExcelAndCsv();
            }
          })
        // 如果是编辑窗口进来的，仅仅保存数据即可
        if (this.option === 'edit' || flag) {
          this.bsModalRef.hide();
        }
      } else {
        this._http.post(this.uploadUrl, data, { withCredentials: true })
          .pipe(
            catchError(err => {
              this.toastr.error(null, '数据保存失败');
              return err;
            })
          )
          .subscribe(res => {
            if (res['resultCode'] === 1000) {
              this.toastr.success(null, '数据保存成功');
              this.uploadExcelAndCsv();
              // 接受返回的 id，避免再次上传同一个文件
              this.dataId = res['data']['id'];
              this.leftTitle = '编辑图表';
              if (flag) {
                this.bsModalRef.hide();
              }
              // 超限 code 3006 普通用户超限 3007 会员用户超限
            } else if (res['resultCode'] === 3006 || res['resultCode'] === 3007) {
              // 不是高级会员(vip2) 弹窗升级个数
              if (this.isVpl === 'None') {
                // this.bsModalRef.hide();
                this.modalService.show(UpgradeMemberComponent, {
                  initialState: {
                    chaeckType: 0,
                    vipIds: ['5'],
                    svipIds: ['5']
                  }
                });
              this.toastr.warning(null, '上传超限');
              } else if (this.isVpl === 'vip1' || this.isVpl === 'vip2') {
                // this.bsModalRef.hide();
                this.modalService.show(ContactUsModalComponent, {
                  initialState: {
                    content: '会员最多可存储100个数据。请先在「我的-数据」中删除部分数据后再重新上传。',
                    title: {
                      position: 'center',
                      content: '提示',
                      button: '确定'
                    }
                  }
                });
              } else if (this.isVpl === 'eip1') {
                this.bsModalRef.hide();
                this.modalService.show(ContactUsModalComponent, {
                  initialState: {
                    content: '企业会员最多可存储5000个数据。请先在「我的-数据」中删除部分数据后再重新上传。',
                    title: {
                      position: 'center',
                      content: '提示',
                      button: '确定'
                    }
                  }
                });
              }
            }
          });
      }
    } else {
      // 不勾选也可以生成图表，但是不进行上传
      this.uploadExcelAndCsv();
      this.leftTitle = '编辑图表';
    }
  }

  // 第二步按钮事件
  twoStepButtonGroupBackHandle() {
    this.twoStep = true;
    this.threeStep = false;
    this.oneStepButtonGroup = true;
    this.twoStepButtonGroup = false;

    // 设置右键菜单
    setTimeout(() => {
      this.configTable();
    }, 100);
  }

  threeStepButtonGroupBackHandle() {
    this.threeStep = true;
    this.twoStepButtonGroup = true;
    this.threeStepButtonGroup = false;
    this.fourStepButtonGroup = false;
    this.leftTitle = ''
    this.playDynamicChart = false
  }

  // 选择图表生成预览
  selectChartTemplateHandle(item) {
    this.currentBlock = item;

    // 设置当前步数
    this.twoStepButtonGroup = false;
    this.threeStepButtonGroup = true;
    this.fourStepButtonGroup = true;
    this.threeStep = false;

    // 调整 block
    const block = _.cloneDeep(this.currentBlock);
    block.position = { top: 0, left: 0 }
    block.dataSrc.data = this.data

    // 动态图表相关配置
    if (block.templateSwitch === 'cross-time' || block.templateSwitch === 'obj-n-value-time') {
      this.isDynamicChart = true
    } else {
      this.isDynamicChart = false
    }

    // 为了避免修改接口当中的默认主题，在初始化图表之前手动进行覆写操作（仅仅针对单图进行处理）
    block.theme = {
      "_id": 18,
      "axis": { "color": "#a1a1a1 " },
      "backgroundColor": "#FFFFFF",
      "colors": ["#5AAEF3", "#62D9AD", "#5B6E96", "#a8dffa", "#ffdc4c", "#FF974C", "#E65A56", "#6D61E4", "#4A6FE2", "#6D9AE7", "#23C2DB", "#D4EC59", "#FFE88E", "#FEB64D", "#FB6E6C"],
      "fonts": {"accessoryColor": "#878787", "color": "#545454", "fontFamily": "阿里巴巴普惠体 常规", "fontSize": "14"},
      "grid": {"color": "#cccccc"},
      "titleFont": {"fontSize": "36", "color": "#4c4c4c", "fontFamily": "阿里巴巴普惠体 常规"},
      "name": "默认主题",
      "price": "0.0",
      "shapeColor": 1,
      "themeId": "18",
      "thumb": "https://ss1.dydata.io/v2/themes/17.png",
      "id": "17"
    };

    /**
     *  根据选择的图表补齐 Map
    */

    // 获取 数值列 和 字符列
    const [numCols, stringCols] = this.formatNewDataNumberList();

    // key-value
    if (block.templateSwitch === 'key-value') {
      block.props.map[0][0].index = 0;
      block.props.map[0][1].index = numCols[0];
    }

    // cross
    else if (block.templateSwitch === 'obj-n-value') {
      if (block.props.map[0].length <= 1) {
        block.props.map[0][0].index = numCols[0];
        block.props.map[0][1].index = numCols[1];
        block.props.map[0][2].index = stringCols[0];
        block.props.map[0][3].index = numCols[2];
        block.props.map[0][4].index = stringCols[1];
      }
    }

    // tree-value、obj-type-value、sankey
    else if (block.templateSwitch === 'tree-value' || block.templateSwitch === 'obj-type-value' || block.templateSwitch === 'sankey') {
      if (block.props.map[0].length <= 1) {
        block.props.map[0][0].index = stringCols[0];
        block.props.map[0][1].index = stringCols[1];
        block.props.map[0][2].index = numCols[0];
      }
    }

    // 针对 cross 类型图表，补齐 Map
    let dataMap = block.props.map[0];
    let dataSrc = block.dataSrc.data[0][0]
    if (block.templateSwitch === 'cross' && block.props.map[0].length <= 1) {
      let index: number = 1;
      dataMap[0].configurable = true;
      for (let i = 1; i < dataSrc.length; i++) {
        dataMap.push({ "name": "数值列", "index": index++, "allowType": ["number"], "isLegend": false, "function": "vCol", "configurable": true })
      }
      block.props.map[0] = dataMap
    } else if (block.templateSwitch === 'cross' && dataSrc.length > dataMap.length) {
      // 根据 dataSrc 长度补齐 Map
      const diffLength = dataSrc.length - dataMap.length;
      for (let i = 0; i < diffLength; i++) {
        dataMap.push({ "name": "数值列", "index": 0, "allowType": ["number"], "isLegend": false, "function": "vCol", "configurable": true })
      }
      // 重新排列 index
      let index: number = 0;
      for (let i = 0; i < dataMap.length; i++) {
        dataMap[i].index = index++
      }
    }

    // 补齐预览图颜色
    let colorDataSrc = _.cloneDeep(this._completeBlockService.handleAllChartsData(block))
    if (block.templateSwitch !== 'cross') {
      colorDataSrc.shift();
    }
    let colors = [];
    // 补齐颜色
    colorDataSrc.map((item, index) => {
      let num = index;
      if (num > 14) {
        num = this.down14(num);
      }
      colors.push(num);
    })

    block.props.colors.list = colors;

    // 调整 block 默认标题等参数
    block.props.titleDisplay.text = '请在右侧栏输入您的标题'
    block.props.unitDisplay.text = '单位：未输入'
    block.props.sourceDisplay.text = '数据来源：未输入'
    block.props.publishDisplay.text = '镝数出品'

    block.props.logoDisplay.show = true
    block.props.logoDisplay.imgUrl = 'https://ss1.dydata.io/newchartLogo.png'

    block.props.watermarkDisplay.show = true
    block.props.watermarkDisplay.imgUrl = 'https://ss1.dydata.io/newchartWatermark.png'

    // 渲染图表
    this.loadBlock(block)
    this.currentBlock = block;

  }

  handleChangeDynamicChart() {
    this.playDynamicChart = !this.playDynamicChart
    if (this.playDynamicChart) {
      this._notifyChartRenderService.sendChartRender(true)
    } else {
      this._notifyChartRenderService.sendChartRender(false)
    }
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

  loadBlock(block) {
    try {
      const componentFactory: ComponentFactory<BlockComponent> = this.componentFactoryResolver.resolveComponentFactory(BlockComponent);
      const viewContainerRef = this.chartHost.viewContainerRef;
      viewContainerRef.clear();
      const componentRef = viewContainerRef.createComponent(componentFactory);
      componentRef.instance.data = {
        setting: block,
      };
    } catch (err) {
      console.log(err);
    }
  }

  // 会员提示
  upgrade(tip?) {
    if (tip === 'overContain') {
      this.modalService.show(ContactUsModalComponent, {
        initialState: {
          content: '项目存储空间已满，无法继续创建新的项目。快升级到会员，体验更大存储空间吧！',
          title: {
            position: 'center',
            content: '提示',
            button: '升级'
          },
          isUpgrade: true,
          isCloseButton: true
        }
      });
    } else {
      this.modalService.show(UpgradeMemberComponent, {
        initialState: {
          chaeckType: 0,
          vipIds: ['5'],
          svipIds: ['5']
        }
      });
    }
  }

  // 生成图表
  fourStepButtonGroupBackHandle() {
    // 动态图表归位
    this.playDynamicChart = false
    // 非会员提示超限
    if (this.isVpl === 'None' && this.totalLength >= 10) {
      this.bsModalRef.hide();
      return this.upgrade('overContain');
    } else if ((this.isVpl === 'vip2' || this.isVpl === 'vip1') && this.totalLength >= 100) {
      this.bsModalRef.hide();
      this.modalService.show(ContactUsModalComponent, {
        initialState: {
          content: '会员最多可存储100个项目，请在「项目管理」中删除部分图表后再进行创建项目操作。',
          title: {
            position: 'center',
            content: '提示',
            button: '确定'
          }
        }
      });
    } else {
      const tempPage = window.open('', '_blank');
      this._http.post(`${this._api.getOldUrl()}/vis/dychart/fork/template/${this.currentBlock.templateId}`,this.currentBlock, { withCredentials: true })
        .subscribe(res => {
          if (res['resultCode'] === 1000) {
            // this._router.navigate(['pages', 'workspace'], { queryParams: { project: res['data'].id, type: 'chart' } });
            // this.bsModalRef.hide();
            // window.open(window.location.href.split('#')[0] + '#/pages/workspace?project=' + res['data'].id + '&type=chart', '_blank');

            // 清空描述
            this._store.dispatch(new ProjectActions.ConfigChartProjectAction(res['data']['id'], { action: 'set_description', description: '' }));

            tempPage.location.href = window.location.href.split('#')[0] + '#/pages/workspace?project=' + res['data'].id + '&type=chart';
            // 获取全部项目列表
            this._store.dispatch(new ProjectActions.GetAllProjectListAction());
          }
        })
    }
  }

  // 处理新图表，生成一个映射数组，提取出 dataSrc 中纯数字项，返回两个数组 [true, false]
  formatNewDataNumberList() {
    let dataSrcNumberMapTrueList = [];
    let dataSrcNumberMapFalseList = [];
    let data = _.unzip(_.cloneDeep(this.data[0]).slice(1));
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

}
