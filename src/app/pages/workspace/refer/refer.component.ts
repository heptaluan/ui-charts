import { Component, OnInit, Input, SimpleChanges, HostListener, EventEmitter, Output } from '@angular/core';
import { UtilsService } from '../../../share/services';
import { DataTransmissionService } from '../../../share/services/data-transmission.service';
import { Store } from '@ngrx/store';
import * as ProjectActions from '../../../states/actions/project.action';
import * as fromRoot from '../../../states/reducers';
declare var $: any;
import * as _ from 'lodash';

@Component({
  selector: 'lx-refer',
  templateUrl: './refer.component.html',
  styleUrls: ['./refer.component.scss']
})
export class ReferComponent implements OnInit {

  constructor(
    private _dataTransmissionService: DataTransmissionService,
    private _utilsService: UtilsService,
    private _store: Store<fromRoot.State>,
  ) { }

  @Input('project') project;

  referLines = [];
  curReferLines = []; // 这个对象用于操作表现层，因为数据层的referLines内不含有页面缩放所改变的值
  projectWidth;
  projectHeight;

  heightY = '0';
  widthX = '0';
  leftX = 0;

  article;

  clickedId: number;

  ngOnInit() {
    this._store.select(fromRoot.getCurrentProjectArticle).subscribe(res => {
      if (res) {
        this.article = res;
        if (res.contents.pages[0].referLines) {
          this.referLines = _.cloneDeep(res.contents.pages[0].referLines);
          if (this.curReferLines.length === 0) {
            this.curReferLines = _.cloneDeep(res.contents.pages[0].referLines);
          }
        }
      }
    })
    // 监听变化
    $('.edit-container').resize(() => {
      this.fixReferLine('row');
      this.fixReferLine('col');
    })
    // console.log(this.project);
    
    // 存储项目宽高
    const design = this.project.article.contents.design;
    this.projectWidth = Number(design.width);
    this.projectHeight = Number(design.height);

    // 监听添加参考线
    this._dataTransmissionService.getReferLine()
      .subscribe(res => {
        if (res === 'deleteAll') {
          this.referLines.length = 0;
          this.curReferLines.length = 0;
          this.update();
        } else if (res === 'col' || res === 'row') {
          // 添加参考线线
          this.addLine(res);
        }
      })
    
    // 监听顶部栏删除参考线 id
    this._dataTransmissionService.getDeleteReferLineId()
      .subscribe(data => {
        if (data.type === 'delete') {
          // 删除选中 id
          this.changeReferTip({
            type: "deleteReferLine",
            id: this.clickedId
          });
          this._dataTransmissionService.sendDeleteReferLineId({type: 'save', id: undefined});
        } else if (data.type === 'save') {
          this.clickedId = data.id
        }
      })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.project && !changes.project.firstChange && changes.project.currentValue) {
      const design = changes.project.currentValue.article.contents.design;
      this.projectHeight = design.height;
      this.projectWidth = design.width;
    }
  }

  // Delete / Backspace 删除参考线
  @HostListener('document:keydown', ['$event']) 
  onKeydown(event: KeyboardEvent) { 
    const keyNum = event.keyCode || event.which || event.charCode || event.code;
    if (keyNum === 46 || keyNum === 8) {
      if (this.clickedId) {
        // 删除选中 id
        this.changeReferTip({
          type: "deleteReferLine",
          id: this.clickedId
        });
      }
    }
  }

  // 点击参考线，保存点击参考线状态，并且重置删除参考线状态
  clickReferLine(id) {
    this.clickedId = id;
    this._dataTransmissionService.sendDeleteReferLineId({type: 'save', id});
  }

  // 创建横向参考线
  addLine(direction = 'row') {
    const id = this._utilsService.generate_uuid();
    const { top: T, left: L, bottom: B, right: R, height: H, width: W } = (document.querySelector('#focal') as HTMLElement).getBoundingClientRect();
    const CH = document.documentElement.clientHeight;
    const CW = document.documentElement.clientWidth - (document.querySelector('.right-content') as HTMLElement).getBoundingClientRect().width;
    const extraHeight = 50;      // 正常情况下顶部不动部分
    const extraWidth = 50 + document.querySelector('.left-content').getBoundingClientRect().width;      // 正常情况下左边不动部分
   
    let lineData;
    if (direction === 'row') {
      let top;
      if (T < extraHeight) {
        if (B < CH) {
          // 第一种 可视距离 (H - (extraHeight - T))
          top = B - (H - (extraHeight - T)) / 2 - T;
          if (top > H) {
            return;
          }
        } else {
          // 第二种 可视距离 (H - (extraHeight - T) - (Bottom - CH))
          top = CH - (H - (extraHeight - T) - (B - CH)) / 2 - T;
        }
      } else {
        if (B < CH) {
          // 第三种
          top = H / 2;
        } else {
          // 第四种 可视距离 CH - Y
          top = (CH - T) / 2;
        }
      }
      lineData = {
        direction: 'row',
        left: '0',
        top: top + 'px',
        color: 'red',
        id
      };
    } else {
      let left;
      if (L < extraWidth) {
        if (R < CW) {
          // 第一种
          left = W - (W - (extraWidth - L)) / 2;
        } else {
          // 第二种
          left = CW - (W - (extraWidth - L) - (R - CW)) / 2 - L;
        }
      } else {
        if (R < CW) {
          // 第三种
          left = W / 2;
        } else {
          // 第四种
          left = (CW - L) / 2;
        }
      }
      lineData = {
        direction: 'col',
        left: left + 'px',
        top: '0',
        color: 'red',
        id
      };
    }
    // 添加参考线
    this.referLines.push(lineData);
    this.curReferLines.push(lineData);
    // 修复横纵参考线位置
    this.fixReferLine(direction);
    // 更新数据
    this.update();
  }

  // 参考线数据
  changeReferTip(data) {
    switch (data.type) {
      case 'deleteReferLine':
        this.referLines = this.referLines.filter(item => item.id !== data.id);
        this.curReferLines = this.curReferLines.filter(item => item.id !== data.id);
        break;
      case 'updateReferLine':
        const dataL = data['data'];
        this.referLines = this.referLines.map(item => {
          if(item.id === dataL.id) {
            if (dataL.direction === 'row') {
              item.left = 0;
              item.top = dataL.top;
            } else {
              item.top = 0;
              item.left = dataL.left;
            }
          }
          return item;
        });
        break;
      default:
        break;
    }
    this.update();
  }

  // 修复左边与辅助线宽
  fixReferLine(direction = 'row') {
    if (window.location.href.indexOf('download') > -1) {
      return;
    }
    if (direction === 'row') {
      this.leftX = this.getLeftX();
      this.widthX = this.getWidthX();
    } else {
      this.heightY = this.getHeightY();
    }
  }

  // 获取 height
  getHeightY() {
    if (!document.querySelector('.edit-container')) return;
    return (document.querySelector('.edit-container') as HTMLElement).offsetHeight + 'px';
  }

  // 获取 left
  getLeftX() {
    if (!document.querySelector('#focal')) return;
    return (document.querySelector('#focal').getBoundingClientRect() as any).x - (document.querySelector('.left-content').getBoundingClientRect() as any).width - (document.querySelector('.scrollable').getBoundingClientRect() as any).width;
  }

  // 获取 width
  getWidthX() {
    if (!document.querySelector('.edit-container')) return;
    return (document.querySelector('.edit-container') as HTMLElement).offsetWidth + 'px';
  }

  // 更新
  update() {
    this._store.dispatch(new ProjectActions.SetProjectReferLineAction({
      referLines: this.referLines
    }));
  }


  // 获取画布中心距离
  // getViewCenter(t) {

  // }
}
