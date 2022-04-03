import { Component, OnInit, Output, Input, ViewChild, AfterViewInit, OnDestroy, EventEmitter, ElementRef } from '@angular/core';
import * as Handsontable from 'handsontable';
import { HotTableRegisterer } from '@handsontable/angular';
import * as fromRoot from '../../../../states/reducers';
import { Store } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';
import * as _ from 'lodash';
import * as $ from 'jquery';
import NP from 'number-precision';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { DataTransmissionService } from '../../../../share/services';

@Component({
  selector: 'lx-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})

export class TableComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('tableDiv') tableDiv;
  @ViewChild('divFather') divFather;

  @Input() curData: Observable<any[]>;
  @Input() width: number;
  @Input() curBlock;

  @Output() tbAfterChange = new EventEmitter();
  @Output() removeColIndex = new EventEmitter();
  @Output() removeAllCol = new EventEmitter();
  @Output() removeAllRow = new EventEmitter();

  mySubscribe = new Subscription();
  chartTemplates;
  data: any[] = [];
  reversalData: any[] = [];
  radioModel = 0;
  tableMaxLength = 1;
  private clipboardCache = '';

  tbHeight: number;
  settings = {
    manualColumnResize: true,        // 手动更改列距
    colHeaders: true,                // 自定义列表头，可以传递 data 或者布尔值
    rowHeaders: true,                // 行表头，同上
    className: 'htMiddle',
    minCols: 8,                      // 最小行列
    minRows: 25,
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
    }
  };

  // 转置按钮
  showReversalButton: boolean = true;

  originWindowResize: (ev: UIEvent) => void;

  constructor(
    private hotRegisterer: HotTableRegisterer,
    private toastr: ToastrService,
    private _store: Store<fromRoot.State>,
    private _dataTransmissionService: DataTransmissionService
  ) { }

  ngOnInit() {

    this._dataTransmissionService.getData2Table().subscribe(res => {
      if (res) {
        this.tbAfterChange.emit({data: res.dataSrc.data})   
      }
    })

    this.originWindowResize = window.onresize;

    this._store.select(fromRoot.getChartTemplates).subscribe(data => {
      if (data) {
        this.chartTemplates = data;
      }
    })

    window.onresize = (event: UIEvent) => {
      if (this.originWindowResize) {
        this.originWindowResize(event);
      }
      if (this.tableDiv.nativeElement.clientHeight) {
        this.tbHeight = this.tableDiv.nativeElement.clientHeight;
      }
    };

    this.mySubscribe.add(this.curData.subscribe((list) => {
      // 避免重复修改 handsontable 数据源
      if (Array.isArray(list) && this.isListEquals(this.removeListNull(this.radioModel), list[this.radioModel])) {
        return;
      }
      this.data = Array.isArray(list) ? _.cloneDeep(list) : [null];
      // 如果是双表，或者部分特殊图表类型，隐藏转置按钮
      if (list.length > 1 ||
        this.curBlock.templateSwitch === 'sankey' ||
        this.curBlock.templateSwitch === 'sunburst' ||
        this.curBlock.templateSwitch === 'tree'
      ) {
        this.showReversalButton = false;
      }
      setTimeout(() => {
        this.configTable();
      }, 100);
    }));

    // 每次 afterChange 的时候保留一份数据留作转置
    this.reversalData = _.cloneDeep(this.data);
  }

  // 切换 table 的时候更改滚动条，使其强制刷新
  reloadTable() {
    $('.wtHolder').scrollLeft(1);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.tbHeight = this.tableDiv.nativeElement.clientHeight
    }, 0);
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

  setTableContextMenu(hotInstance) {
    var that = this;
    if (hotInstance) {
      hotInstance.updateSettings({
        contextMenu: {
          callback: (key, options) => {
            let pos = {
              row: null,
              col: null
            }
            let rowTmp = null;
            let colTmp = null;
            if (key === 'ascending' || key === 'descending') {
              const sortPlugin = hotInstance.getPlugin('columnSorting');
              if (options[0].start.col === options[0].end.col) {
                sortPlugin.hot.sort(options[0].start.col, key == 'ascending');
              }
              return;
            } else if (key === 'remove_row') {
              rowTmp = Math.min(options[0].start.row, options[0].end.row);
              colTmp = Math.min(options[0].start.col, options[0].end.col);
              // this.emitUpdate(this.radioModel, hotInstance);
            } else if (key === 'row_above' || key === 'col_left') {
              rowTmp = Math.min(options[0].start.row, options[0].end.row);
              colTmp = Math.min(options[0].start.col, options[0].end.col);
            } else if (key === 'row_below') {
              rowTmp = Math.max(options[0].start.row, options[0].end.row) + 1;
              colTmp = Math.max(options[0].start.col, options[0].end.col);
            } else if (key === 'col_right') {
              rowTmp = Math.max(options[0].start.row, options[0].end.row);
              colTmp = Math.max(options[0].start.col, options[0].end.col) + 1;
            }
            pos.row = rowTmp;
            pos.col = colTmp;

            this.emitUpdate(that.radioModel, hotInstance, {key, pos});
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
                // 修复粘贴后，滚动条置底
                $('.innerBorderLeft .wtHolder').scrollLeft(0)
                $('.innerBorderLeft .wtHolder').scrollTop(0)
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
            // '删除整行': {
            //   name: '删除整行',
            //   disabled: () => {
            //     const selectedColLength = hotInstance.getSelectedLast()[3]
            //     const allColLength = hotInstance.countCols() - 1
            //     const selectedRowLength = hotInstance.getSelectedLast()[2]
            //     const selectedCol = hotInstance.getSelected()[0];
            //     if (selectedRowLength === selectedCol[0] && selectedColLength === allColLength) {
            //       return false;
            //     } else {
            //       return true;
            //     }
            //   },
            //   callback() {
            //     const index = hotInstance.getSelectedLast()[0];
            //     hotInstance.alter('remove_row', index);
            //     that.emitUpdate(this.radioModel, hotInstance);
            //   }
            // },
            // '删除整列': {
            //   name: '删除整列',
            //   disabled: () => {
            //     const selectedRowLength = hotInstance.getSelectedLast()[2]
            //     const allRowLength = hotInstance.countRows() - 1
            //     // 选中超过两行，禁用（endCol - startCol）
            //     const selectedCol = hotInstance.getSelected()[0];
            //     const selectedColLength = selectedCol[3] - selectedCol[1];
            //     if (selectedRowLength === allRowLength && selectedColLength === 0) {
            //       return false;
            //     } else {
            //       return true;
            //     }
            //   },
            //   callback() {
            //     const index = hotInstance.getSelectedLast()[1];
            //     hotInstance.alter('remove_col', index);
            //     that.removeColIndex.emit(index);
            //     that.emitUpdate(this.radioModel, hotInstance);
            //   }
            // },
            'remove_row': {
              name: '删除所在行',
              hidden: function () { // `hidden` can be a boolean or a function
                //header被选中，应该返回true
                return false;
              },
              callback: function (key, selection, clickEvent) { // Callback for specific option

                var delRowsArry = new Array();
                var arr = this.getSelectedRange();
                arr.forEach(element => {
                  var from = element.from;
                  var to = element.to;

                  var devideN = to.row - from.row;
                  if (devideN > 0) {
                    for (var i = 0; i <= devideN; i++)//连续多行
                    {
                      var a = [from.row + i, 1];
                      delRowsArry.push(a);
                    }
                  }
                  else if (devideN == 0)//单行被选择
                  {
                    var a = [from.row, 1];
                    delRowsArry.push(a);
                  }

                });

                // console.log(delRowsArry);//delRowsArry是单行列举过的二维数组，每次删一行
                that.removeAllRow.emit(delRowsArry);
                this.alter('remove_row', delRowsArry);
              }
            },
            'remove_col': {
              name: '删除所在列',
              hidden: function () {
                return false;
              },
              callback: function (key, selection, clickEvent) {

                var delColsArry = new Array();
                var arr = this.getSelectedRange();

                arr.forEach(element => {
                  var from = element.from;
                  var to = element.to;
                  var devideN = to.col - from.col;

                  // 多列
                  if (devideN > 0) {
                    for (var i = 0; i <= devideN; i++) {
                      var a = [from.col + i, 1];
                      delColsArry.push(a);
                    }
                  }

                  // 多列 反向选择 需要devideN修正反向选择的列坐标
                  if (devideN < 0) {
                    devideN = -devideN;
                    for (var i = 0; i <= devideN; i++) {
                      var a = [from.col + (i - devideN), 1];
                      delColsArry.push(a);
                    }
                  }

                  // 单列被选择
                  else if (devideN == 0) {
                    var a = [from.col, 1];
                    delColsArry.push(a);
                  }

                });

                // delColsArry 是单列列举过的二维数组，每次删一列
                that.removeAllCol.emit(delColsArry);
                this.alter('remove_col', delColsArry); 
                // that.emitUpdate(that.radioModel, hotInstance);

                // 删除所在列 的时候保留一份数据留作转置
                that.reversalData = _.cloneDeep(that.data);
              }
            },
            'hr3': '---------',
            'row_above': {
              name: '在上方插入一行',
            },
            'row_below': {
              name: '在下方插入一行',
            },
            'col_left': {
              name: '在左侧插入一列',
            },
            'col_right': {
              name: '在右侧插入一列',
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
    if (event.hotInstance && event.params[0]) {
      this.emitUpdate(key, event.hotInstance);
    }
    // 每次 afterChange 的时候保留一份数据留作转置
    this.reversalData = _.cloneDeep(this.data);
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

  // 转置
  reversal() {
    // 判断数组去掉空值 null undefined 是否为空
    if (this.reversalData[0].filter(item => _.compact(item).length > 0).length === 0) return;

    // 二维数组转置
    this.reversalData[0] = this.reversalData[0][0].map((col, i) => {
      return this.reversalData[0].map(row => {
        return row[i]
      })
    })

    // 输出有数字的二维数组，中间空值不过滤（过滤多余的空值）
    let newData = _.cloneDeep(this.reversalData);
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

    if (colNumArr.length) {
      filterArr.length = Math.max(...colNumArr) + 1;
    } else {
      newData[0] = _.map(newData[0], item => { return _.compact(item) })
      this.reversalData[0]= newData[0].filter(d => d.length > 0)
    };

    if (rowNumArr.length) {
      this.reversalData[0] = filterArr.map(item => {
        item.length = Math.max(...rowNumArr) + 1;
        return item;
      })
    } else {
      newData[0] = _.map(newData[0], item => { return _.compact(item) });
      this.reversalData[0]= newData[0].filter(d => d.length > 0);
    }

    // 将处理后的数据更新
    this.tbAfterChange.emit({data: this.reversalData});
  }

  emitUpdate(key, instance, changeRowCol = {key: null, pos: {row: null,col: null}}) {
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
    // 去除多余空值
    newData.map((item,index) => {
      newData[index] = this.removeListNull(index)
    })
    
    newData.splice(key, 1, subData);
    // console.log(newData);
    
    this.tbAfterChange.emit({data: newData, changeRowCol});

    // 删除所在行 的时候保留一份数据留作转置
    this.reversalData = _.cloneDeep(this.data);
  }

  removeListNull(radioModel) {
    const instance = this.hotRegisterer.getInstance(`tb${radioModel}`);
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
    const hotInstance = this.hotRegisterer.getInstance(`tb${this.radioModel}`);
    setTimeout(() => {
      if (hotInstance && this.tableDiv.nativeElement.clientHeight) {
        this.tbHeight = this.tableDiv.nativeElement.clientHeight
        hotInstance.render();
      }
    }, 0);
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
  }

  // 处理粘贴内容
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

  // 上传数据按钮
  handleTableUploadData(ev) {
    const files = ev.target.files[0]
    // 判断文件格式
    if (!/\.(xlsx|xls|XLSX|XLS|csv|CSV)$/.test(files.name)) {
      alert(`上传文件格式不正确！`);
      return false;
    }

    // 判断文件大小
    if (files.size > 2 * 1024 * 1024) {
      alert(`上传文件不能大于2M！`);
      return false;
    }

    // 解析上传的 excel
    let isCSV = files.name.split(".").reverse()[0] == 'csv';
    // 读取完成的数据
    let wb
    let that = this
    let reader = new FileReader()
    let data
    let daraSrc
    
    try {
      if (isCSV) {
        reader.readAsText(files, 'gb2312')
        reader.onload = function () {
          data = reader.result
          daraSrc = _.map(_.dropRight(data.split(/\n/)) as any, item => item.split(','))      
          that.tbAfterChange.emit({data: [daraSrc]})
          that.toastr.success(null, '上传成功')
        }
      } else {
        reader.readAsBinaryString(files);
        reader.onload = function (e) {
          data = e.target['result']
          wb = XLSX.read(data, {
            type: 'binary'
          });
          // wb.SheetNames[0] 是获取 Sheets 中第一个 Sheet 的名字
          // wb.Sheets[Sheet名] 获取第一个 Sheet 的数据
          // 分割为数组，在去掉末尾自带的一个空行，数据最多为前两页（现在只读第一页）
          daraSrc = _.map(_.dropRight(XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]).split(/\n/)), item => item.split(','));
          let dataClone = _.cloneDeep(that.data)
          dataClone[Number(that.radioModel)] = daraSrc;
          that.tbAfterChange.emit({data: dataClone})
          that.toastr.success(null, '上传成功')
          document.getElementById('tableUploadData')["value"] = '';
        };
      }
    } catch (error) {
      this.toastr.error(null, '上传失败')
    }
    
  }

  updateInitialData() {
    let block =  _.cloneDeep(this.chartTemplates.filter(item => item.templateId === this.curBlock.templateId))
    this.tbAfterChange.emit({data: block[0].dataSrc.data})   
  }
}
