/*
 * @Description: page 页面，负责加载页面组件
 */
import {
  Component,
  OnInit,
  ViewChild,
  ComponentFactoryResolver,
  Output,
  EventEmitter,
  ComponentFactory,
  ComponentRef,
  ElementRef,
  Renderer2,
  OnDestroy
} from '@angular/core';
import * as ProjectModels from '../../../states/models/project.model';
import * as fromRoot from '../../../states/reducers';
import * as ProjectActions from '../../../states/actions/project.action';
import { ChartDirective } from '../../../block/chart.directive';
import { BlockComponent } from '../../../block/block.component';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { withLatestFrom, skip } from 'rxjs/operators';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { ActivatedRoute } from '@angular/router';
import { UpdateCurrentProjectArticleAction } from '../../../states/actions/project.action';
import { UpdateProjectContent } from '../../../states/models/project.model';
import { DataTransmissionService, SetBlockZIndexService } from '../../../share/services';
import { API } from '../../../states/api.service';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../share/services/utils.service';
import { NotifyChartRenderService } from '../../../share/services/notify-chart-render.service';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import * as _ from 'lodash';
import * as $ from 'jquery'
import { GroupMapService } from '../../../block/group-map.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { RenameTitleComponent } from '../../../components/modals';

interface OptsType {
  left: number;
  top: number;
  width: number;
  height: number;
  rotate?: number;
  scale?: number;
}

interface TransformRectType {
  point: any[];
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
}


export interface ComponentRefItem {
  id: any;
  componentRef: ComponentRef<BlockComponent>;
}

@Component({
  selector: 'lx-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit, OnDestroy {

  @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;
  @ViewChild('workspace') private workspace: ElementRef;

  contents;
  article;
  setting: any;
  id: any;
  blockComponentRef: ComponentRefItem[] = [];
  selectItems: Observable<ProjectModels.ProjectContentObject[]>;
  mysubscription = new Subscription();
  mysubscription2 = new Subscription();
  @ViewChild(ChartDirective) chartHost: ChartDirective;
  @Output() selected = new EventEmitter();
  project;
  themeList;
  originWidth;
  originHeight;

  pageId: string;
  projectId: string;


  showBottomTouchBar: boolean = false;
  showRightTouchBar: boolean = false;
  isShowBottomTooltip: boolean = false;
  isShowRightTooltip: boolean = false;
  toolTipLeft: number = 0;
  toolTipTop: number = 0;

  blockLogoSrc: string = '/dyassets/images/block-logo.svg'
  logoUrl: string = `${this._api.getOldUrl()}/partner/logo_info`

  // 右键菜单统一梳理
  selectedBlock: any
  selectedDom: any
  selectedBlockList: any[]
  selectedDomList: any[]
  timerList: any[] = [];

  multipleSelected: boolean = false
  singleSelected: boolean = false

  showGroupDelete: boolean = false
  showGroupCopy: boolean = false
  showEditData: boolean = false
  showSingleCopy: boolean = false
  showSingleDelete: boolean = false
  showSingleFork: boolean = false
  showAlignButton: boolean = false
  showLocked: boolean = false
  showUnLocked: boolean = false
  showCoverage: boolean = false

  // 层级调整
  currentProjectArticle;
  currentProjectArticle$;
  getCurrentProjectArticleScription = new Subscription();
  // blockIndex;
  blockLists: any[];
  idList;

  ctrl = "Ctrl";
  shift = "Shift";
  alt = "Alt";

  bsModalRef: BsModalRef;

  constructor(
    private _store: Store<fromRoot.State>,
    private componentFactoryResolver: ComponentFactoryResolver,
    private _el: ElementRef,
    private _activatedRoute: ActivatedRoute,
    private _dataTransmissionService: DataTransmissionService,
    private _renderer: Renderer2,
    private _api: API,
    private _http: HttpClient,
    private _utilsService: UtilsService,
    private _groupService: GroupMapService,
    private _notifyChartRenderService: NotifyChartRenderService,
    private toastr: ToastrService,
    private _blockService: SetBlockZIndexService,
    private _modalService: BsModalService,
  ) { }

  ngOnInit() {
    if (/macintosh|mac os x/i.test(navigator.userAgent)) {
      this.ctrl = "⌘"
      this.shift = "⇧"
      this.alt = "⌥"
    }
    // 设置右上角 page logo
    this._http.get(this.logoUrl, { withCredentials: true }).subscribe(res => {
      if (res['resultCode'] === 1000 && res['data'].miniwatermark) {
        this.blockLogoSrc = res['data'].miniwatermark
      } else {
        this.blockLogoSrc = '/dyassets/images/block-logo.svg'
      }
    })

    // 添加快捷键
    this.addKeyboardEvent();

    const newContents = _.cloneDeep(this.contents);
    this.mysubscription2
      .add(this._store.select(fromRoot.getCurrentProjectFull).subscribe(project => {
        this.project = project;
      }))
      .add(this._store.select(fromRoot.getCurrentProjectTheme).subscribe(themeList => {
        if (themeList) {
          this.themeList = themeList;
          const newProject = _.cloneDeep(this.project);
          const newThemeList = _.cloneDeep(this.themeList);
          if (!this.project.article.contents.theme) {
            newProject.article.contents.theme = newThemeList.themes[0];
            this._store.dispatch(new ProjectActions.UpdateAndExitCurrentProjectAction(newProject.id, {
              action: 'save_project',
              article: newProject.article,
            }));
          }
        }
      }))
      .add(this._dataTransmissionService.getGroupData().subscribe(isGroup => {
        if (isGroup) {
          // 打散
          this.disperseGroup();
        } else {
          // 组合
          this.generateGroup();
        }
      }))

    this.setPageStyle();
    _.each(newContents, (content) => {
      this.loadBlock(content);
    });

    const stream1 = this._store.select(fromRoot.getCurrentProjectArticle);
    const stream2 = this._store.select(fromRoot.getRecentModifiedObject);
    this.mysubscription.add(stream2.pipe(skip(1), withLatestFrom(stream1, (modifyBlock, newArticle) => {
      this.blockLists = newArticle.contents.pages[0].blocks;
      this.pageId = newArticle.contents.pages[0].pageId
      this.projectId = this._activatedRoute.snapshot.queryParams.project
      let diffBlock: ProjectModels.Block;
      switch (modifyBlock.type) {
        case 'article':
          this.setting = newArticle.contents.design;
          this.setPageStyle();
          break;
        case 'template':
          const blocks = newArticle.contents.pages[0].blocks;
          this.goToPageSettings();
          // 清空画布
          this.chartHost.viewContainerRef.clear()
          this.blockComponentRef = [];
          // 设置页面
          this.setting = newArticle.contents.design;
          this.setPageStyle();

          // 更新 block
          _.each(blocks, (content) => {
            this.loadBlock(content);
          });
          break;

        case 'chart':
          diffBlock = _.find((<ProjectModels.InfographicProjectContents>newArticle.contents).pages[0].blocks,
            { blockId: modifyBlock.blockId });
          // 被删除
          if (!diffBlock) {
            this.deleteBlock(modifyBlock.blockId);
          } else {
            this.reloadBlock(modifyBlock.blockId, diffBlock);
            this.updateCacheData(diffBlock)
          }
          break;
        case 'text':
          diffBlock = _.find((<ProjectModels.InfographicProjectContents>newArticle.contents).pages[0].blocks,
            { blockId: modifyBlock.blockId });
          if (!diffBlock) {
            this.deleteBlock(modifyBlock.blockId);
          } else {
            this.reloadBlock(modifyBlock.blockId, diffBlock);
            this.updateCacheData(diffBlock)
          }
          break;
        case 'shape':
          diffBlock = _.find((<ProjectModels.InfographicProjectContents>newArticle.contents).pages[0].blocks,
            { blockId: modifyBlock.blockId });
          if (!diffBlock) {
            this.deleteBlock(modifyBlock.blockId);
          } else {
            this.reloadBlock(modifyBlock.blockId, diffBlock);
            this.updateCacheData(diffBlock)
          }
          break;
        case 'image':
          diffBlock = _.find((<ProjectModels.InfographicProjectContents>newArticle.contents).pages[0].blocks,
            { blockId: modifyBlock.blockId });
          if (!diffBlock) {
            this.deleteBlock(modifyBlock.blockId);
          } else {
            this.reloadBlock(modifyBlock.blockId, diffBlock);
            this.updateCacheData(diffBlock)
          }
          break;
        case 'audio':
          diffBlock = _.find((<ProjectModels.InfographicProjectContents>newArticle.contents).pages[0].blocks,
            { blockId: modifyBlock.blockId });
          if (!diffBlock) {
            this.deleteBlock(modifyBlock.blockId);
          } else {
            this.reloadBlock(modifyBlock.blockId, diffBlock);
            this.updateCacheData(diffBlock)
          }
          break;
        case 'video':
          diffBlock = _.find((<ProjectModels.InfographicProjectContents>newArticle.contents).pages[0].blocks,
            { blockId: modifyBlock.blockId });
          if (!diffBlock) {
            this.deleteBlock(modifyBlock.blockId);
          } else {
            this.reloadBlock(modifyBlock.blockId, diffBlock);
            this.updateCacheData(diffBlock)
          }
          break;
        case 'group':
          diffBlock = _.find((<ProjectModels.InfographicProjectContents>newArticle.contents).pages[0].blocks,
            { blockId: modifyBlock.blockId });
          if (!diffBlock) {
            this.deleteBlock(modifyBlock.blockId);
          } else {
            this.reloadBlock(modifyBlock.blockId, diffBlock);
            this.updateCacheData(diffBlock)
          }
          break;
        default:
          break;
      }
    })).subscribe());
  }

  updateCacheData(block) {
    localStorage.setItem('block', JSON.stringify({
      target: {
        blockId: block.blockId,
        pageId: this.pageId,
        type: block.type
      },
      block: block,
      projectId: this.projectId
    }))
  }

  ngOnDestroy() {
    this.mysubscription.unsubscribe();
    this.mysubscription2.unsubscribe();
    $(document).unbind("keydown");
  }

  setPageStyle() {
    let scale: number = Number.parseInt(document.querySelector('.page-size span').innerHTML)
    // let scale: number = 100;
    this._renderer.setStyle(this._el.nativeElement.getElementsByClassName('page')[0], 'height', this.setting.height * (scale / 100) + 'px');
    this._renderer.setStyle(this._el.nativeElement.getElementsByClassName('page')[0], 'width', this.setting.width * (scale / 100) + 'px');
    this._renderer.setStyle(this._el.nativeElement.getElementsByClassName('page')[0], 'background', this.setting.backgroundColor);
    this.originWidth = this.setting.width
    this.originHeight = this.setting.height
  }

  onSelected(e) {
    // 获取当前 block 在 blockLists 里面的为 index
    this.getArticleAndCurrentBlockIndex(e);
    // page 当作中转，往上传递到 workspace，在向下传至 settings 组件
    this.selected.emit(e)
    if (e.type === 'multiple') {
      this.selectedBlockList = e.data.selectedBlockList
      this.selectedDomList = e.data.selectedDomList
      this.selectedBlock = null
      this.selectedDom = null
    } else {
      this.selectedBlock = e.data
      this.selectedDom = e.dom
      this.selectedBlockList = []
      this.selectedDomList = []
    }

    if (this.selectedDomList) {
      this.timerList.length = this.selectedDomList.length
    }

    // 右键菜单配置
    // 框选删除 ==> 0
    // 框选复用 ==> 1
    // 编辑数据 ==> 2
    // 复用     ==> 3
    // 删除     ==> 4
    // 另存     ==> 5
    // 对齐     ==> 6
    // 锁定     ==> 7
    // 解锁     ==> 8
    // 图层     ==> 9
    switch (e.type) {
      case 'chart':
        this.showContextMenu([2, 3, 4, 5, 6, 7, 8, 9])
        break;
      case 'text':
        this.showContextMenu([3, 4, 6, 7, 8, 9])
        break;
      case 'shape':
        this.showContextMenu([3, 4, 6, 7, 8, 9])
        break;
      case 'image':
        this.showContextMenu([3, 4, 6, 7, 8, 9])
        break;
      case 'audio':
        if (e.data.block.props.type === 'bgm') {
          this.showContextMenu([4, 6, 7, 8, 9])
        } else {
          this.showContextMenu([3, 4, 6, 7, 8, 9])
        }
        break;
      case 'video':
        this.showContextMenu([3, 4, 6, 7, 8, 9])
        break;
      case 'group':
        this.showContextMenu([3, 4, 6, 9])
        break;
      case 'multiple':
        this.showContextMenu([0, 1, 6, 7, 8, 9])
        break;
      default:
        break;
    }
  }

  deleteBlock(blockId: string) {
    try {
      const delIndex = _.findIndex(this.blockComponentRef, { id: blockId } as any);
      if (this.blockComponentRef[delIndex]) {
        this.blockComponentRef[delIndex].componentRef.destroy();
        this.blockComponentRef.splice(delIndex, 1);
      }
    } catch (error) {
      console.log(error);
    }
  }

  reloadBlock(blockId: String, block: ProjectModels.Block) {
    try {
      if (!_.find(this.blockComponentRef, { id: blockId as any })) {
        this.loadBlock(block);
        return;
      }
      const componentInstance = _.find(this.blockComponentRef, { id: blockId } as any).componentRef.instance;
      const newData = Object.assign({}, componentInstance.data);
      _.assign(newData, {
        setting: block
      });
      componentInstance.data = newData;
    } catch (error) {
      console.log(error);
    }
  }

  loadBlock(block) {
    try {
      const componentFactory: ComponentFactory<BlockComponent> = this.componentFactoryResolver.resolveComponentFactory(BlockComponent);
      const viewContainerRef = this.chartHost.viewContainerRef;
      const componentRef = viewContainerRef.createComponent(componentFactory);
      componentRef.instance.blockId = block.blockId;
      componentRef.instance.data = {
        setting: block,
      };
      componentRef.instance.selectItems = this.selectItems;
      componentRef.instance.pageId = this.id;
      componentRef.instance.selected.subscribe(evt => {
        this.selected.emit(evt);
      });
      this.blockComponentRef.push({
        id: block.blockId,
        componentRef: componentRef
      });
    } catch (error) {
      console.log(error);
    }
  }

  // 获取页面缩放比例
  getScale() {
    return Number($('.page-size span').html()) / 100;
  }

  // 拖拽把手
  onLineMouseDown(e, pos = 'bottom') {
    const scale: number = Number.parseInt(document.querySelector('.page-size span').innerHTML) / 100;
    const { x, top } = this.workspace.nativeElement.getBoundingClientRect();

    let isOnMouseDown = true;
    let oldClientY = e.clientY;
    let oldClientX = e.clientX;
    this._dataTransmissionService.sendBorder(false);
    if (pos === 'bottom') {
      this.isShowBottomTooltip = true;
      this.toolTipLeft = Math.floor(e.clientX - Math.floor(x));
    } else {
      this.isShowRightTooltip = true;
      this.toolTipTop = Math.floor(e.clientY - Math.floor(top));
    }
    document.onmousemove = (ev) => {
      if (isOnMouseDown) {
        if (pos === 'bottom') {
          this.showBottomTouchBar = true;
          const newClientY = ev.clientY;
          this.toolTipLeft = Math.floor(ev.clientX - Math.floor(x));
          const newHeight = Math.floor(Number(this.originHeight) + (Number(newClientY) - Number(oldClientY)) / scale);
          if (newHeight <= 300) {
            this.originHeight = 300;
          } else if (newHeight >= 15000) {
            this.originHeight = 15000;
          } else {
            this.originHeight = newHeight;
          }

          oldClientY = newClientY;
        } else {
          this.showRightTouchBar = true;
          const newClientX = ev.clientX;
          this.toolTipTop = Math.floor(ev.clientY - Math.floor(top));
          // 左右两边同时变化，移动位置 * 2
          const newWidth = Math.floor(Number(this.originWidth) + (Number(newClientX) - Number(oldClientX)) / scale * 2);
          if (newWidth <= 300) {
            this.originWidth = 300;
          } else if (newWidth >= 6000) {
            this.originWidth = 6000;
          } else {
            this.originWidth = newWidth;
          }

          oldClientX = newClientX;
        }
      }

    }
    document.onmouseup = () => {
      document.onmousedown = null;
      document.onmousemove = null;
      // $('.center-content').css('padding-bottom', '100px');
      this._dataTransmissionService.sendBorder(true);
      isOnMouseDown = false;
      this.isShowBottomTooltip = false;
      this.isShowRightTooltip = false;
      let newSetting = _.cloneDeep(this.setting);
      if (pos === 'bottom') {
        // 百度统计
        window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-info-pageResize-bottom']);
        this.showBottomTouchBar = false;
        newSetting.height = this.originHeight;
      } else {
        // 百度统计
        window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-info-pageResize-right']);
        this.showRightTouchBar = false;
        newSetting.width = this.originWidth;
      }

      newSetting.sizeType = '自定义';

      this.uploadDesign(newSetting);
      document.onmouseup = null;
    }
  }

  uploadDesign(design) {
    let newDesign = _.cloneDeep(design)
    let newData: UpdateProjectContent = {
      target: {
        pageId: this.pageId,
        type: 'article'
      },
      method: 'put',
      design: newDesign
    }
    this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData));
  }

  // 切换至页面设置
  goToPageSettings() {
    (document.querySelector('.magic-box') as HTMLElement).style.display = 'none';
    (document.querySelector('.drag-box') as HTMLElement).style.display = 'none';
    localStorage.setItem('idList', JSON.stringify([]))
    Array.from(document.querySelectorAll('.block-container')).map(item => item.classList.remove('is-selceted'))
    this.selected.emit({
      type: 'article',
    })
    this._dataTransmissionService.sendToggleThememData(true)
  }

  // ===================================
  // 
  // 右键菜单统一梳理
  // 
  // ===================================
  showContextMenu(list) {
    this.showGroupDelete = false
    this.showGroupCopy = false
    this.showEditData = false
    this.showSingleCopy = false
    this.showSingleDelete = false
    this.showSingleFork = false
    this.showAlignButton = false
    this.showCoverage = false
    for (let index of list) {
      if (this.selectedBlock && this.selectedBlock.block.locked) {
        switch (index) {
          case 0:
            this.showGroupDelete = false
            break;
          case 1:
            this.showGroupCopy = false
            break;
          case 2:
            this.showEditData = false
            break;
          case 3:
            this.showSingleCopy = true
            break;
          case 4:
            this.showSingleDelete = false
            break;
          case 5:
            this.showSingleFork = false
            break;
          case 6:
            this.showAlignButton = false
            break;
          case 7:
            this.showLocked = false
            break;
          case 8:
            this.showUnLocked = true
            break;
          case 9:
            this.showCoverage = false
            break
          default:
            break;
        }
      } else {
        switch (index) {
          case 0:
            this.showGroupDelete = true
            break;
          case 1:
            this.showGroupCopy = true
            break;
          case 2:
            this.showEditData = true
            break;
          case 3:
            this.showSingleCopy = true
            break;
          case 4:
            this.showSingleDelete = true
            break;
          case 5:
            this.showSingleFork = true
            break;
          case 6:
            this.showAlignButton = true
            break;
          case 7:
            this.showLocked = true
            break;
          case 8:
            this.showUnLocked = false
            break;
          case 9:
            this.showCoverage = true
            break
          default:
            break;
        }
      }
    }
  }

  copy() {
    if (this.selectedBlock.type === 'chart') {
      window['_hmt'].push(['_trackEvent', 'editpage', 'right-menu', 'right-menu-chartobject-clone']);
    }
    const newBlock = _.cloneDeep(this.blockLists.find(x => x.blockId === (this.selectedDom as HTMLElement).getAttribute('chartid')))
    newBlock.blockId = this._utilsService.generate_uuid()
    newBlock.position.top = ~~(newBlock.position.top) + 20
    newBlock.position.left = ~~(newBlock.position.left) + 20
    let newData: any = {
      target: {
        blockId: newBlock.blockId,
        pageId: this.pageId,
        type: newBlock.type
      },
      method: 'add',
      block: newBlock
    }
    this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData));
    this.curBlockSelected(newBlock.blockId)
    setTimeout(() => {
      this._dataTransmissionService.sendContextMenuData(newBlock)
    }, 0);
  }

  delete() {
    if (this.selectedBlock.type === 'chart') {
      window['_hmt'].push(['_trackEvent', 'editpage', 'right-menu', 'right-menu-chartobject-delete']);
    }
    this._notifyChartRenderService.sendChartRender(undefined)
    const newBlock = _.cloneDeep(this.selectedBlock)
    let newData: any = {
      target: {
        blockId: newBlock.blockId,
        pageId: this.pageId,
        type: newBlock.type
      },
      method: 'delete',
      block: newBlock
    }
    this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData));
    this.goToPageSettings()
  }

  edit() {
    setTimeout(() => {
      let pageSize = Number($('.page-size span').html());
      this._dataTransmissionService.sendPageZoom(pageSize / 100);
      this._dataTransmissionService.sendData(true);
      window['_hmt'].push(['_trackEvent', 'editpage', 'right-menu', 'right-menu-chartobject-editdata']);
    }, 300);
  }

  fork() {
    const url = `${this._api.getOldUrl()}/vis/dychart/save_as_chart`;
    const forkChart = _.cloneDeep(this.selectedBlock.block)

    this.bsModalRef = this._modalService.show(RenameTitleComponent, {
      initialState: {
        titleText: forkChart.title,
        type: 'upload'
      }
    })

    this._modalService.onHidden.pipe(take(1)).subscribe((r: string) => {
      if (this.bsModalRef.content.confirmFlag) {
        const title = this.bsModalRef.content.title.content
        if (title) {
          forkChart.title = title
          this._http.post(url, forkChart, { withCredentials: true })
            .subscribe(res => {
              console.log(res)
              if (res['resultCode'] === 1000) {
                this.toastr.success(null, '保存成功！请在「项目管理」中查看')
                this._dataTransmissionService.sendForkChartState(true)
              } else if (res['resultCode'] === 3003) {
                this.toastr.warning(null, '项目超限!')
              } else {
                this.toastr.error(null, '保存失败！请刷新后重新尝试')
              }
            })
        }
      }

    });
  }

  locked() {
    if (this.selectedBlockList.length > 1) {
      this._dataTransmissionService.sendLockedData(true)
      this.goToPageSettings()
    } else {
      const newBlock = _.cloneDeep(this.selectedBlock.block)
      newBlock.locked = true
      let newData: any = {
        target: {
          blockId: newBlock.blockId,
          pageId: this.pageId,
          type: newBlock.type
        },
        method: 'put',
        block: newBlock
      }
      this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData))
    }
  }

  unLocked() {
    if (this.selectedBlockList.length > 1) {
      this._dataTransmissionService.sendLockedData(true)
      this.goToPageSettings()
    } else {
      const newBlock = _.cloneDeep(this.selectedBlock.block)
      newBlock.locked = false
      let newData: any = {
        target: {
          blockId: newBlock.blockId,
          pageId: this.pageId,
          type: newBlock.type
        },
        method: 'put',
        block: newBlock
      }
      this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData))
    }
  }

  groupDelete() {
    const projectBlockList = _.cloneDeep(this.project.article.contents.pages[0].blocks)
    const groupList = []
    this.selectedBlockList.map(item => {
      let newData: any = {
        target: {
          blockId: item.blockId,
          pageId: this.pageId,
          type: item.type,
          target: 'redo'
        },
        method: 'delete',
        block: item
      }
      groupList.push(item)
      this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData));
    });
    this._store.dispatch(new ProjectActions.UpdateCurrentProjectGroupDeleteAction({
      groupList: groupList,
      projectBlockList: projectBlockList
    }));
    this.goToPageSettings()
  }

  groupCopy() {
    const that = this
    const newBlockIdList = []
    this.selectedDomList.map(item => {
      const newBlock = _.cloneDeep(that.blockLists.find(x => x.blockId === (item as HTMLElement).getAttribute('chartid')))
      newBlock.blockId = this._utilsService.generate_uuid()
      newBlockIdList.push(newBlock.blockId)
      newBlock.position.top = parseInt(newBlock.position.top) + 20
      newBlock.position.left = parseInt(newBlock.position.left) + 20
      let newData: any = {
        target: {
          blockId: newBlock.blockId,
          pageId: this.pageId,
          type: newBlock.type
        },
        method: 'add',
        block: newBlock
      }
      this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData));
    });
    this.goToPageSettings()
    setTimeout(() => {
      this._dataTransmissionService.sendContextMenuData(newBlockIdList)
    }, 0);
  }

  handleGroupAlign(type, e) {
    e.preventDefault();
    const multipleBox = document.querySelector('.right-content') as HTMLElement
    if (multipleBox) {
      (multipleBox.querySelector('.align-' + type) as HTMLElement).click()
    }

    if ([...$('.cdk-overlay-pane .ngx-contextmenu')].length > 0) {
      $('.cdk-overlay-container').children().remove();
    }
    return false
  }

  // 选中当前图表
  curBlockSelected(blockId) {
    let blockList = []
    let blockBoxList = $('.page').find('.block-container');
    setTimeout(() => {
      blockBoxList.each((k, v) => {
        blockList.push($(v).attr('chartid'))
      })
      const index = blockList.findIndex(x => x === blockId);
      if (index !== -1) {
        $(blockBoxList[index]).click()
      }
    }, 300);
  }

  addKeyboardEvent() {
    const that = this;
    $(document).keydown(function (event) {
      const keyNum = event.keyCode || event.which || event.charCode;
      let ctrlKey;
      if (/macintosh|mac os x/i.test(navigator.userAgent)) {
        ctrlKey = event.metaKey;
      } else {
        ctrlKey = event.ctrlKey
      }
      const shiftKey = event.shiftKey;
      if ($('.edit-data-tab .nav-item:first-child').hasClass('active')) {
        return;
      } else {
        switch (keyNum) {
          case 37:
            if (shiftKey && !$('.drag-box').is(':hidden')) {
              that.selectedDomList.map((item, index) => {
                item.style.left = (parseInt(item.style.left) - 10) + 'px'
                that.debounceUploadBlock(item, index)
              });
              that.setDragBoxStyle()
            } else if (!$('.drag-box').is(':hidden')) {
              that.selectedDomList.map((item, index) => {
                item.style.left = (parseInt(item.style.left) - 1) + 'px'
                that.debounceUploadBlock(item, index)
              });
              that.setDragBoxStyle()
            }
            break;
          case 38:
            if (shiftKey && !$('.drag-box').is(':hidden')) {
              that.selectedDomList.map((item, index) => {
                item.style.top = (parseInt(item.style.top) - 10) + 'px'
                that.debounceUploadBlock(item, index)
              });
              that.setDragBoxStyle()
            } else if (!$('.drag-box').is(':hidden')) {
              that.selectedDomList.map((item, index) => {
                item.style.top = (parseInt(item.style.top) - 1) + 'px'
                that.debounceUploadBlock(item, index)
              });
              that.setDragBoxStyle()
            }
            break;
          case 39:
            if (shiftKey && !$('.drag-box').is(':hidden')) {
              that.selectedDomList.map((item, index) => {
                item.style.left = (parseInt(item.style.left) + 10) + 'px'
                that.debounceUploadBlock(item, index)
              });
              that.setDragBoxStyle()
            } else if (!$('.drag-box').is(':hidden')) {
              that.selectedDomList.map((item, index) => {
                item.style.left = (parseInt(item.style.left) + 1) + 'px'
                that.debounceUploadBlock(item, index)
              });
              that.setDragBoxStyle()
            }
            break;
          case 40:
            if (shiftKey && !$('.drag-box').is(':hidden')) {
              that.selectedDomList.map((item, index) => {
                item.style.top = (parseInt(item.style.top) + 10) + 'px'
                that.debounceUploadBlock(item, index)
              });
              that.setDragBoxStyle()
            } else if (!$('.drag-box').is(':hidden')) {
              that.selectedDomList.map((item, index) => {
                item.style.top = (parseInt(item.style.top) + 1) + 'px'
                that.debounceUploadBlock(item, index)
              });
              that.setDragBoxStyle()
            }
            break;
          case 46:
            // 屏蔽选色板的渐变色模块有相同的键盘监听
            if (!$('.drag-box').is(':hidden') && $(".color-picker-wrapper-show").length === 0) {
              event.preventDefault();
              that._notifyChartRenderService.sendChartRender(undefined)
              that.groupDelete();
            }
            break;
          // 键盘backspace 具有相同的删除功能
          case 8:
            // 判断具有focuse对象
            if (!$('.drag-box').is(':hidden') && $(".color-picker-wrapper-show").length === 0 && document.activeElement.localName !== 'input' && document.activeElement["type"] !== 'text' && document.activeElement.localName !== 'textarea') {
              event.preventDefault();
              // 清空图表状态
              that._notifyChartRenderService.sendChartRender(undefined)
              that.groupDelete();
            }
            break;
          case 68:
            if (ctrlKey && !$('.drag-box').is(':hidden')) {
              event.preventDefault();
              that.groupCopy()
            }
          default:
            break;
        }
      }
    })
  }

  debounceUploadBlock(item, index) {
    if (this.timerList[index]) {
      clearTimeout(this.timerList[index]);
    }

    this.timerList[index] = setTimeout(() => {
      this.updateBlock(item);
    }, 1000)
  }

  updateBlock(item) {
    const newBlock = _.cloneDeep(this.getSelectedBlock(item.getAttribute('chartid')))
    const scale: number = Number.parseInt(document.querySelector('.page-size span').innerHTML)
    newBlock.position.left = (parseInt(item.style.left) / (scale / 100)).toFixed()
    newBlock.position.top = (parseInt(item.style.top) / (scale / 100)).toFixed()
    let newData: any = {
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

  // 设置新的拖拽框位置
  setDragBoxStyle() {
    const dragBox = (document.querySelector('.drag-box') as HTMLElement)
    const wrapBoxRect = document.querySelector('.workspace-wrap').getBoundingClientRect()
    const offectDiffValue = {
      top: wrapBoxRect.top,
      left: wrapBoxRect.left
    }
    let leftArr = [], topArr = [], rightArr = [], bottomArr = []
    this.selectedDomList.map(item => {
      let itemClientRect = item.getBoundingClientRect()
      leftArr.push(itemClientRect.left - offectDiffValue.left)
      topArr.push(itemClientRect.top - offectDiffValue.top)
      rightArr.push(itemClientRect.right - offectDiffValue.left)
      bottomArr.push(itemClientRect.bottom - offectDiffValue.top)
    })

    let minLeft = Reflect.apply(Math.min, null, leftArr).toFixed()
    let minTop = Reflect.apply(Math.min, null, topArr).toFixed()

    dragBox.style.left = minLeft + 'px'
    dragBox.style.top = minTop + 'px'
  }

  // 获取当前更新 block
  getSelectedBlock(id) {
    let newBlock = null
    this.selectedBlockList.map(element => {
      if (element.blockId === id) {
        newBlock = element
      }
    })
    return newBlock
  }

  // ---------------------------- 层级调整 ----------------------------------------

  getArticleAndCurrentBlockIndex(e) {
    this.currentProjectArticle$ = this._store.select(fromRoot.getCurrentProjectArticle)
    this.getCurrentProjectArticleScription = this.currentProjectArticle$.subscribe(data => {
      if (data) {
        this.blockLists = data.contents.pages[0].blocks;
        this.currentProjectArticle = data;
        if (e.type === 'multiple') {
          this.idList = e.data.idList.map(item => this.blockLists.findIndex(x => x.blockId === item));
        } else {
          this.idList = [this.blockLists.findIndex(x => x.blockId === e.blockId)];
        }
        // this.blockIndex = this.blockLists.findIndex(x => x.blockId === e.blockId);
      }
    })
  }

  // 移动层级
  setBlockMoveLevel(pos) {
    this._blockService.handleMultiLevel(this.idList, pos, this.currentProjectArticle);
    // 移动的 json lists, 当前要移动的 block 处于的 index,当前的 article
    // this._blockService.handleIndexChange(this.blockIndex, pos, this.currentProjectArticle)
    // magicBox 蓝框修正
    // this.curBlockSelected(this.blockLists[this.blockIndex].blockId);
    if ([...$('.cdk-overlay-pane .ngx-contextmenu')].length > 0) {
      $('.cdk-overlay-container').children().remove();
    }
  }

  open() {
    document.onmousemove = null
    document.onmouseup = null
    if ([...$('.cdk-overlay-pane .ngx-contextmenu')].length > 0) {
      $('.cdk-overlay-container').hide();

      setTimeout(() => {
        if ($(".icon-delete").parents("li")) {
          $(".icon-delete").parents("li").addClass("delete")
        }
        if ($(".split-line").parents("li")) {
          $(".split-line").parents("li").removeClass("passive")
          if (!(this.selectedBlock && this.selectedBlock.block.locked)) {
            $(".split-line").parents("li").addClass("split-line-wrapper")
          }
        }
        $('.cdk-overlay-container').show();
      }, 1);
    }
  }


  // ---------------------------- 组合打散 ----------------------------------------
  // 打散组合的元素
  disperseGroup() {
    const data = _.cloneDeep(this.blockLists[this.idList]);
    // 获取画布rect
    // 1.得到每个删除的元素 json 集合
    const { children, initGroupData } = _.cloneDeep(data.props);
    const { left: outerLeft, top: outerTop } = _.cloneDeep(data.position);
    const { width: outerWidth, height: outerHeight, rotate: diffRotate } = _.cloneDeep(data.props.size);
    // 获取最外层 div 的中心点
    const outerCenterPoint = this.getRectCenterPoint(outerWidth, outerHeight, Number(outerLeft), Number(outerTop));

    // 无角度时候 偏移部分
    const diffLeft = Number(outerLeft) - initGroupData.left;
    const diffTop = Number(outerTop) - initGroupData.top;

    // 2.重新加载每个删除的元素
    children.forEach((block, index) => {
      const { width: blockWidth, height: blockHeight } = block.props.size;
      const { top: blockTop, left: blockLeft } = block.position;

      // 加差值算法
      if (diffRotate === 0) {
        block.position.left = Number(blockLeft) + diffLeft;
        block.position.top = Number(blockTop) + diffTop;
      } else {
        // block 对应 page div 中心点, 旋转之后移动, 需要将 block 的中心点修正
        const blockCenterPoint = this.getRectCenterPoint(Number(blockWidth), Number(blockHeight), Number(blockLeft) + diffLeft, Number(blockTop) + diffTop);
        // 计算block 中心点 距离外层中心点偏差的角度
        const degree = Math.atan((blockCenterPoint.y - outerCenterPoint.y) / (blockCenterPoint.x - outerCenterPoint.x))/ Math.PI * 180;
        // 得到旋转后的元素中心点距离画布的 x,y
        const rotateBlockCenterPoint = this.getRotateCenterPos(blockCenterPoint, outerCenterPoint, degree + diffRotate);
        // console.log(rotateBlockCenterPoint);
        block.position.left = rotateBlockCenterPoint.x - blockWidth / 2;
        block.position.top = rotateBlockCenterPoint.y - blockHeight / 2;
        block.props.size.rotate = Number(block.props.size.rotate) + diffRotate;
      }
      // 加载 block
      this.loadBlock(block);
      const newData: UpdateProjectContent = {
        target: {
          blockId: block.blockId,
          pageId: this.pageId,
          type: 'image',
        },
        method: 'add',
        block: block as any,
      };
      this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData));
    });

    // 3.删除组合的元素
    this.deleteBlock(data.blockId);
    this.deleteBlockJson(data);
    // 4.点击画布
    this.goToPageSettings();
  }

  // 生成组合元素
  generateGroup() {
    // this.currentProjectArticle$ = this._store.select(fromRoot.getCurrentProjectArticle)
    // this.getCurrentProjectArticleScription = this.currentProjectArticle$.subscribe(data => {
    //   if (data) {
    //     this.blockLists = data.contents.pages[0].blocks;
    //     this.currentProjectArticle = data;
    //     if (e.type === 'multiple') {
    //       this.idList = e.data.idList.map(item => this.blockLists.findIndex(x => x.blockId === item));
    //     } else {
    //       this.idList = [this.blockLists.findIndex(x => x.blockId === e.blockId)];
    //     }
    //     // this.blockIndex = this.blockLists.findIndex(x => x.blockId === e.blockId);
    //   }
    // })
    console.log('组合');
    // const data = _.cloneDeep(this.selectedBlockList);
    // console.log(data);
    
    const selectedIds = _.cloneDeep(this.selectedBlockList).map(item => item.blockId);
    console.log(selectedIds, this.blockLists);
    const selectedList = _.cloneDeep(this.blockLists.filter(item => selectedIds.includes(item.blockId)));
    console.log(selectedList);
    
    

    // 未完成: 添加每个 元素 的位置以及旋转角度
    // 1.删除要组合元素的 id
    selectedList.forEach(block => {
      // 界面
      this.deleteBlock(block.blockId);
      this.deleteBlockJson(block);
    });
    // 2.获取每个组合的元素 json
    // 3.生成组合的 block
    const newBlock = _.cloneDeep(this._groupService.GroupBlockTemplate);
    newBlock.blockId = this._utilsService.generate_uuid();

    // 4.依据框选的虚线框计算组合的宽高, left, top
    // page 的 left top
    const { left: pageLeft, top: pageTop } = this.getPageRect();
    const { left: groupLeft, top: groupTop, width: actualWidth, height: actualHeight } = document.querySelector('.drag-box-wrap').getBoundingClientRect();
    const actualLeft = groupLeft - pageLeft;
    const actualTop = groupTop - pageTop;


    // 5.给元素加上定位
    selectedList.map(item => {
      item.groupLeft = Number(item.position.left) - actualLeft;
      item.groupTop = Number(item.position.top) - actualTop;
      return item;
    })

    // 6.赋值
    newBlock.props.children = selectedList;
    // 备份初始位置
    newBlock.props.initGroupData = {
      top: actualTop,
      left: actualLeft,
      rotate: 0
    }

    newBlock.position = {
      top: actualTop,
      left: actualLeft,
    };

    newBlock.props.size.width = actualWidth;
    newBlock.props.size.height = actualHeight;
    console.log(newBlock);
    const newData: UpdateProjectContent = {
      target: {
        blockId: newBlock.blockId,
        pageId: this.pageId,
        type: 'group',
      },
      method: 'add',
      block: newBlock as any,
    };
    this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData));
    this.curBlockSelected(newBlock.blockId)
  }

  // 获取旋转后的圆心
  getRotateCenterPos(oldPoint, centerPoint, degree) {
    const diffX = oldPoint.x - centerPoint.x;
    const diffY = oldPoint.y - centerPoint.y;
    // 长度
    const l = Math.sqrt(diffX ** 2 + diffY ** 2);
    const flag = diffX < 0 ? -1 : 1;
    const x = centerPoint.x + flag * l * Math.cos(degree * Math.PI / 180);
    const y = centerPoint.y + flag * l * Math.sin(degree * Math.PI / 180);
    return { x, y };
  }

  // 获取矩形中心点 相对于外层的中心点坐标
  getRectCenterPoint(width, height, left, top) {
    const x = width / 2 + left;
    const y = height / 2 + top;
    return { x, y };
  }

  // 获取指定 blockId 的长宽信息
  getBlockData(id) {
    return Array.from(document.querySelectorAll('.group-container-item')).filter(item => item.id === id)[0].getBoundingClientRect();
  }

  // 获取画布宽高
  getPageRect() {
    return document.querySelector('#focal').getBoundingClientRect();
  }

  deleteBlockJson(block) {
    const newBlock = _.cloneDeep(block);
    let newData: any = {
      target: {
        blockId: newBlock.blockId,
        pageId: this.pageId,
        type: newBlock.type
      },
      method: 'delete',
      block: newBlock
    }
    this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData));
  }

}
