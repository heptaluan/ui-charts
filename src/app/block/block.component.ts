import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ChartDirective } from './chart.directive';
import { ChartMapService } from './chart-map.service';
import { UpdateCurrentProjectArticleAction } from '../states/actions/project.action';
import { UpdateProjectContent } from '../states/models/project.model';
import { Store } from '@ngrx/store';
import * as fromRoot from '../states/reducers';
import { ActivatedRoute, Router } from '@angular/router';
import { ContextMenuComponent } from 'ngx-contextmenu';
import 'jquery-ui/ui/widgets/draggable';
import { DataTransmissionService } from '../share/services/data-transmission.service';
import { HttpService } from '../states/services';
import { API } from '../states/api.service';
import { NotifyChartRenderService } from '../share/services/notify-chart-render.service';

import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  selector: 'lx-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss'],
  providers: [ChartMapService]
})

export class BlockComponent implements OnInit {
  _data;
  set data(val) {
    this._data = val;
    if (this.componentRef) {
      this.componentRef.instance.data = this.data;
      this.buildBlockSettings();
      setTimeout(() => {
        this.onInteractBlock()
      }, 100);
    }
  }
  get data() {
    if (this._data) {
      return this._data;
    }
  }

  blockId;
  selectItems;
  pageId;

  @ViewChild(ChartDirective) chartHost: ChartDirective;
  @Output('selected') selected = new EventEmitter();
  @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;

  isSelected = false;
  isDownload = true;
  isUseHover = true;
  selectSubscription = new Subscription();

  blockStyles;
  lockedBoxStyles;
  boxStyles;
  toolbarStyles;
  componentRef: ComponentRef<any>;
  pageZoom;

  left;
  top;
  mySubscription = new Subscription();
  themeList;
  projectType: string;
  projectId;

  currentProjectArticle;
  currentProjectArticle$;
  getCurrentProjectArticleScription = new Subscription();
  blockLists;
  blockIndex;

  // 锁定状态
  isLocked: boolean = false;

  // 动画配置
  showAnimationButton: boolean = false
  showDynamicAnimationButton: boolean = false
  istext: boolean = false;
  textDom;

  // 提高 bgm 的 z-index
  // isUpZIndex = false;
  originWidth;
  originHeight;
  originTop;
  originLeft;
  scale: number = 100;

  selectTimer = null;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private _chartMapService: ChartMapService,
    private _store: Store<fromRoot.State>,
    private el: ElementRef,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _dataTransmissionService: DataTransmissionService,
    private _httpService: HttpService,
    private _api: API,
    private _notifyChartRenderService: NotifyChartRenderService,
  ) { }

  ngOnInit() {
    this.projectType = this._activatedRoute.snapshot.queryParams.type;
    this.projectId = this._activatedRoute.snapshot.queryParams.project;
    this.buildBlockSettings();
    this.loadChart();

    if (this.projectType === 'chart' || this._router.url.indexOf('download') > 0) {
      $('.animation-button').css('bottom', '-20px')
    }

    // 判断当前路由是否是 download
    if (this._activatedRoute['url']['value'].length) {
      this.isDownload = false;
    }

    // 监听 selectItems 数据流，处理 block 选中逻辑
    if (this.selectItems) {
      this.selectSubscription = this.selectItems.subscribe(objects => {
        if (objects[0].blockId !== this.blockId) {
          this.isSelected = false;
          this.showAnimationButton = false
          if (this.data.setting.type === 'text') {
            this.componentRef.instance.isSelected = this.isSelected;
          }
        } else {
          this.showAnimationButton = true
        }
      })
    }

    this.mySubscription
      .add(this._store.select(fromRoot.getCurrentProjectTheme).subscribe(themeList => {
        if (themeList) {
          this.themeList = themeList;
          if (this.data.setting.type === 'chart') {
            const newBlock = _.cloneDeep(this.data.setting);
            const newThemeList = _.cloneDeep(this.themeList);
            newBlock.theme = (newThemeList.themes)[0];
          }
        }
      }))

    this._notifyChartRenderService.getChartRender().subscribe(res => {
      if (this.componentRef.instance.echart && this.projectType === 'infographic' && this.isSelected || this.projectType === 'chart') {
        if (this.data.setting.templateSwitch === 'cross-time' || this.data.setting.templateSwitch === 'obj-n-value-time') {
          if (typeof res === 'boolean') {
            this.componentRef.instance.echart.dynamicChartStopAnimation(res)
          } else if (res === null) {
            this.componentRef.instance.echart.clearDynamicChartTimer(undefined)
          } else if (res === 1) {
            this.componentRef.instance.echart.resizeByChartAnimationSetting()
          } else {
            this.componentRef.instance.echart.dynamicChartRenderAnimation(res)
          }
        } else {
          if (res === 'chartResize') {
            this.componentRef.instance.echart.resize()
          } else {
            if (res && this.componentRef.instance.echart) {
              this.componentRef.instance.echart.resizeByChartAnimationSetting();
            }
            if (!res && this.componentRef.instance.echart) {
              this.componentRef.instance.echart.resizeByChartAnimationSetting(false);
            }
          }
        }
      } else if (typeof res === 'boolean' && this.componentRef.instance.echart && this.isSelected) {
        this.componentRef.instance.echart.dynamicChartStopAnimation(res)
      }
    })

    // 放慢速度播放 便于导出MP4 mov
    this._notifyChartRenderService.getChartSpeed().subscribe(res => {
      if (this.projectType === 'chart') {
        this.componentRef.instance.echart.playChartBySpeed(res)
      }
    })

    if (this.projectType === 'infographic') {
      this._dataTransmissionService.getIsShowBorder()
        .subscribe(res => {
          this.isUseHover = res;
        })
    }

    // 只有动态图表才显示动画按钮
    if (this.data.setting.templateId === '8000000011111111001' ||
      this.data.setting.templateId === '8000000011111111002' ||
      this.data.setting.templateId === '8000000011111111003' ||
      this.data.setting.templateId === '8000000011111111004'
    ) {
      this.showDynamicAnimationButton = true
    }
  }

  ngAfterViewInit() {
    if (this.projectType === 'chart') {
      setTimeout(() => {
        $('.block-inner-box').click();
      }, 10);
    }

    // 初始化插入时 根据缩放比例进行调整
    if (this.data.setting.type === 'chart' || this.data.setting.type === 'text' || this.data.setting.type === 'shape' || this.data.setting.type === 'audio' || this.data.setting.type === 'video') {
      this.fixedAddNewBlockStyle()
    }
  }

  fixedAddNewBlockStyle() {
    const w = this.originWidth
    const h = this.originHeight
    if (this.data.setting.type !== 'video') {
      const el = this.el.nativeElement.querySelector('.block-inner-box')

      if (el && this.scale !== 100) {
        el.style.width = w + 'px'
        el.style.height = h + 'px'
        el.style.zoom = this.scale / 100
      } else {
        if (el) {
          el.style.width = w + 'px'
          el.style.height = h + 'px'
        }
      }
    } else {
      if (this.el.nativeElement.querySelector('.video-inner-wrapper')) {
        const el = this.el.nativeElement.querySelector('.video-inner-wrapper')
        el.style.width = w + 'px'
        el.style.height = h + 'px'
        el.style.transform = `scale(${this.scale / 100})`
        el.style.transformOrigin = `0 0`
      }
    }
  }

  buildBlockSettings() {
    // 用户在别处退出登录，更新 block 就让其强制登录
    if (this._httpService.code === 2007) {
      location.href = `${this._api.getHost()}/auth/signin.html?redirect=` +
        encodeURIComponent(window.location.href.split('#')[0] + window.location.hash);
    }
    if (this.data.setting) {
      if (document.querySelector('.page-size span')) {
        this.scale = Number.parseInt(document.querySelector('.page-size span').innerHTML)
      } else {
        this.scale = 100;
      }

      // 设置原始属性
      this.originWidth = Number(this.data.setting.props.size.width)
      this.originHeight = Number(this.data.setting.props.size.height)
      this.originTop = this.data.setting.position.top
      this.originLeft = this.data.setting.position.left

      this.fixedAddNewBlockStyle()

      this.blockStyles = {
        'top': (this.data.setting.position.top * (this.scale / 100)).toFixed() + 'px',
        'left': (this.data.setting.position.left * (this.scale / 100)).toFixed() + 'px',
        'height': Number((this.data.setting.props.size.height * (this.scale / 100)).toFixed()) + 'px',
        'width': Number((this.data.setting.props.size.width * (this.scale / 100)).toFixed()) + 'px',
        'transform': this.data.setting.props.size.rotate ? `rotate(${Number(this.data.setting.props.size.rotate).toFixed()}deg)` : `rotate(0deg)`
      };

      this.lockedBoxStyles = {
        'height': this.data.setting.props.size.height * (this.scale / 100) + 'px',
        'width': this.data.setting.props.size.width * (this.scale / 100) + 'px',
        'transform': `rotate(${this.data.setting.props.size.rotate}deg)`
      }

      this.boxStyles = {
        height: Number(this.data.setting.props.size.height) + 2,
        width: Number(this.data.setting.props.size.width) + 2,
        'transform': `rotate(${this.data.setting.props.size.rotate}deg)`
      }

      // 图表变动的同时修正拖拽框
      this.fixedMagicBoxPosition(this.data.setting)

      let newBlock = _.cloneDeep(this.data.setting)
      newBlock.props.size.width = this.data.setting.props.size.width
      newBlock.props.size.height = this.data.setting.props.size.height
      newBlock.props.size.rotate = this.data.setting.props.size.rotate ? this.data.setting.props.size.rotate : 0

      this.setBlockLockedStyle(newBlock)

      setTimeout(() => {
        this.setBlockOrigin();
      }, 0);
    }
  }

  mouseDownHandle(e) {
    this.fixedMagicBoxPosition(this.data.setting)
    this.setLocalStorageBlock()
    this.setBlockLockedStyle(this.data.setting)
    if (this.data.setting.locked) {
      localStorage.setItem('idList', JSON.stringify([]))
      Array.from(document.querySelectorAll('.block-container')).map(item => item.classList.remove('is-selceted'));
      return
    }
    if (e.ctrlKey || e.metaKey) {
      let idList = JSON.parse(localStorage.getItem('idList'))
      idList.push(this.data.setting.blockId)
      let newIdList = _.uniq(idList)
      localStorage.setItem('idList', JSON.stringify(newIdList))
      if (newIdList.length > 1) {
        this._dataTransmissionService.sendContextMenuData(newIdList)
      }
    } else {
      localStorage.removeItem('idList')
      localStorage.setItem('idList', JSON.stringify([this.data.setting.blockId]))
    }
  }

  setLocalStorageBlock(block?) {
    const newBlock = _.cloneDeep(this.data.setting)
    newBlock.props.size.rotate = this.data.setting.props.size.rotate ? this.data.setting.props.size.rotate : 0
    localStorage.setItem('block', JSON.stringify({
      target: {
        blockId: this.data.setting.blockId,
        pageId: this.pageId,
        type: this.data.setting.type
      },
      block: block ? block : newBlock,
      projectId: this.projectId
    }))
  }

  fixedMagicBoxPosition(data, show?: boolean): void {
    if (document.querySelector('.page-size span')) {
      this.scale = Number.parseInt(document.querySelector('.page-size span').innerHTML)
    }
    let box = (document.querySelector('.magic-box') as HTMLElement)
    if (box) {
      const boxStyle = box.style
      boxStyle.width = (data.props.size.width * (this.scale / 100)).toFixed() + 'px'
      boxStyle.height = (data.props.size.height * (this.scale / 100)).toFixed() + 'px'
      boxStyle.transform = `rotate(${data.props.size.rotate}deg)`
      boxStyle.left = data.position.left * (this.scale / 100) + 'px'
      boxStyle.top = data.position.top * (this.scale / 100) + 'px'
      if (show) {
        boxStyle.display = 'block'
      }
    }
  }

  setBlockLockedStyle(block) {
    const magicBox = document.querySelector('.magic-box') as HTMLElement
    const rotate = document.querySelector('.magic-box .rotate') as HTMLElement
    const resizeHandlers = document.querySelector('.magic-box .resizable') as HTMLElement
    const box = this.el.nativeElement.querySelector('.block-container')
    // 解决外部错误
    if (!box || !magicBox) return;
    if (block.locked) {
      this.isLocked = true
      magicBox.classList.remove('is-selected')
      magicBox.classList.add('is-locked')
      rotate.style.display = 'none'
      resizeHandlers.style.display = 'none'
    } else {
      this.isLocked = false
      magicBox.classList.remove('is-locked')
      magicBox.classList.add('is-selected')
      rotate.style.display = 'flex'
      resizeHandlers.style.display = 'block'
    }
  }

  // block 选中触发 selected 事件
  onBlockSelected() {
    this.fixedMagicBoxPosition(this.data.setting)
    this.setBlockLockedStyle(this.data.setting)
    if (this.projectType === 'infographic') {
      this.selectTimer = setTimeout(() => {
        this.isSelected = true;
      }, 0);

      if (this.data.setting.type === 'text') {
        this.istext = true;
        if (this.data.setting.props && this.data.setting.props.fontFamily === 'Noto Sans') {

          let newBlock = _.cloneDeep(this.data.setting);
          newBlock.props.fontFamily = '方正黑体'
          let newData: UpdateProjectContent = {
            target: {
              blockId: newBlock.blockId,
              pageId: this.pageId,
              type: newBlock.type
            },
            method: 'put',
            block: newBlock
          }
          this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData));
        }
        this.componentRef.instance.isSelected = this.isSelected;
      }
    } else if (this.projectType === 'chart') {
      this.selected.emit({
        type: this.data.setting.type,
        blockId: this.blockId,
        newData: {
          blockId: this.data.setting.blockId,
          pageId: this.pageId,
          type: this.data.setting.type,
          block: this.data.setting,
          projectId: this.projectId
        }
      });
      this.isSelected = true;
    }
    this.setBlockOrigin();
  }

  updateBlock(left, top, width?, height?) {
    let newBlock = _.cloneDeep(this.data.setting);
    if (left) {
      newBlock.position.left = left;
    }
    if (top) {
      newBlock.position.top = top;
    }
    if (width) {
      newBlock.props.size.width = width;
    }
    if (height) {
      newBlock.props.size.height = height;
    }
    let newData: UpdateProjectContent = {
      target: {
        blockId: newBlock.blockId,
        pageId: this.pageId,
        type: newBlock.type
      },
      method: 'put',
      block: newBlock
    }
    this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData));
  }

  loadChart() {
    const viewContainerRef = this.chartHost.viewContainerRef;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory
      (this._chartMapService.componentFactorys[this.data.setting.templateId]);
    this.componentRef = viewContainerRef.createComponent(componentFactory);
    this.componentRef.instance.data = this.data;
    if (this.data.setting.type === 'text') {
      this.componentRef.instance.pageId = this.pageId;
      this.componentRef.instance.isSelected = this.isSelected;
    }
  }

  onInteractBlock() {
    if (this.data.setting.type === 'chart') {
      this.componentRef.instance.echart.resize();
    }
  }

  ngOnDestroy() {
    this.selectSubscription.unsubscribe();
    this.getCurrentProjectArticleScription.unsubscribe();
    this.selectTimer = null;
  }

  setBlockOrigin() {
    const block = this.el.nativeElement.querySelector('.block-container')
    let top = parseInt(block.style.height) / 2, left = parseInt(block.style.width) / 2;
    this.pageZoom = parseInt($('.page-size span').html(), 10) / 100;
    top = top * this.pageZoom;
    left = left * this.pageZoom
  }

  handleBlockMouseEnter() {
    if (this.isSelected) {
      $(this.el.nativeElement).find('.animation-button').removeClass('hide-button')
    }
  }

  handleBlockMouseLeave() {
    if (this.isSelected) {
      const animationButton = $(this.el.nativeElement).find('.animation-button')
      if (animationButton.hasClass('active')) {
        animationButton.addClass('hide-button')
      } else {
        animationButton.removeClass('hide-button')
      }
    }
  }

}
