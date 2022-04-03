import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../../../../states/api.service';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { DataDemandFeedbackComponent } from '../../../../components/modals/data-demand-feedback/data-demand-feedback.component';
import { BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'lx-scene-sidebar',
  templateUrl: './scene-sidebar.component.html',
  styleUrls: ['./scene-sidebar.component.scss']
})
export class SceneSidebarComponent implements OnInit {
  // 本页面带 fav 的都是我的喜欢相关的
  @Input() pageId: string;
  @Output() closeSidebarEvent = new EventEmitter();
  @ViewChild('personScroll') personScroll: ElementRef;
  @ViewChild('sysScroll') sysScroll: ElementRef;

  categories = [];
  partCategories = [];
  tabActive: boolean = true;  // 控制切换模板中心与我的喜欢
  text: string = '加载更多...';
  textTop;                  // 全部模板提示
  textFavTop;               // 西湖那模板提示
  sysTimer;
  personTimer;
  templates = [];          // 全部模板
  copyTemplates = [];      // 处理全部模板
  favTemplates = [];       // 喜欢模板
  copyFavTemplates = [];   // 处理喜欢模板
  styles;
  hArr = [];               // 存放全部模板高度
  hFavArr = [];            // 存放喜欢模板高度
  pageNum: number = 1;
  favPageNum: number = 1;
  searchPageNum: number = 1;
  searchFavPageNum: number = 1;
  templateTotal: number;
  favTemplateTotal: number;
  changeCate = 'all';  // 改变的分类
  scene_id = 0;
  searchTag: string = '';
  searchFavTag: string = '';
  isFavTemplateHidden: boolean = false;
  isTemplateHidden: boolean = false;
  favTip = '没有找到你喜欢的模板';

  // 分类
  private categoriesUrl = `${this._api.getOldUrl()}/vis/dychart/scene/get_scene_list`;
  // 模板列表
  private infoConditionUrl = `${this._api.getOldUrl()}/vis/dychart/scene/get_scene_templates`;
  // 喜欢模板列表
  private favTemplateUrl = `${this._api.getOldUrl()}/vis/dychart/favorite/cases?type=infographic&step=10`;
  // 跨域允许
  httpOptions = { withCredentials: true };

  constructor(
    private _http: HttpClient,
    private _api: API,
    private toastr: ToastrService,
    private _modalService: BsModalService
  ) { }

  ngOnInit() {
    // 获取模板分类
    this.initGetTemplateCate();

    // 获取全部模板
    this.initGetTemplateList();

    // 组件高度
    this.styles = {
      height: innerHeight - 50 + 'px',
      width: '280px'
    };

  }

  ngAfterViewInit(): void {
    // 绑定滚动事件
    this.sysScroll.nativeElement.addEventListener('scroll', this.handleScroll.bind(this));
  }

  // 关闭
  clickCloseBtn() {
    this.closeSidebarEvent.emit();
  }

  // 切换标签方法
  onTabSelect(e) {
    this.searchTag = '';
    this.text = '加载更多';
    if (e.id === 'tab2') {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-left-myscene']);
    }
    this.tabActive = !this.tabActive;
    if (!this.tabActive) {
      // 获取喜欢的模板
      this.initGetFavTemplateList();
      setTimeout(() => {
        this.personScroll.nativeElement.addEventListener('scroll', this.handlePersonScroll.bind(this));
      }, 100);
    } else {
      setTimeout(() => {
        this.sysScroll.nativeElement.addEventListener('scroll', this.handleScroll.bind(this));
      }, 100);
      // 获取全部模板
      this.initGetTemplateList();
    }
  }

  // 获取模板分类
  initGetTemplateCate() {
    const deleteArr = ['头条号首图', '工作报告', '营销长图'];
    this._http.get(this.categoriesUrl, this.httpOptions)
      .subscribe(data => {
        data['data']['list'].map(item => {
          if (item.level === 1 && deleteArr.indexOf(item.name) === -1) {
            this.categories.push({
              'category': item.id,
              'category_cn': item.name
            });
          }
        });
        this.categories.unshift({ 'category': 'all', 'category_cn': '全部' });
        this.partCategories = this.categories.slice(0, 3);
      });
  }

  // 分类
  classify(category) {
    // 如果点击分类跟之前一样就不做任何操作
    if (this.changeCate !== category) {
      this.templates = [];
      this.scene_id = 0;
      this.text = '加载更多...';
      // category 不是 all 就是其他分类
      if (category !== 'all') {
        this.scene_id = category;
      }
      this.initGetTemplateList(1, true, this.scene_id, this.searchTag);
      this.changeCate = category;
    }
  }

  // 获取全部列表
  initGetTemplateList(pageNum = 1, flag = true, scene_id = 0, tag = '') {
    // 用一个数组来存放未处理的数据
    if (flag) {
      this.copyTemplates = [];
      this.hArr = [];
      this.pageNum = pageNum;
    }
    this._http.get(`${this.infoConditionUrl}?scene_id=${scene_id}&pagenum=${pageNum}&tag=${tag}`, this.httpOptions)
      .subscribe(data => {
        this.scene_id = scene_id;
        this.copyTemplates = data['data']['list'];
        this.templateTotal = Math.ceil(data['data']['total'] / 10);
        const dataLength = data['data']['list'].length;
        if (dataLength === 0) {
          // 更新按钮位置
          this.textTop = 15;
          if (tag !== '') {
            this.isTemplateHidden = true;
          }
          return;
        }
        const arr = [];
        this.copyTemplates.map((item, index) => {
          const imgUrl = item.thumb;
          const img = new Image();
          img.src = imgUrl;
          const that = this;
          img.onload = function () {
            arr.push(index);
            // 处理每个 img 的高，因为每个都是 120 宽
            that.copyTemplates[index]['height'] = Math.round(img.height * 120 / img.width);
            // arr 长度等于接收数据长度时表明图片全部加载完成
            if (arr.length === dataLength) {
              for (let i = 0; i < dataLength; i++) {
                // 将第一页的前两个数据存进 hArr
                if (i < 2 && that.pageNum === 1) {
                  that.hArr.push(that.copyTemplates[i].height);
                  that.copyTemplates[i].top = 0;
                  if (i === 0) {
                    that.copyTemplates[0].left = 15;
                  } else {
                    that.copyTemplates[1].left = 145;
                  }
                } else {
                  // 找出最短的高度
                  const minH = Math.min.apply(null, that.hArr);
                  // 0 表示左边 1表示右边（里面只有两个数据）
                  if (that.hArr.indexOf(minH) === 0) {
                    that.copyTemplates[i].left = 15;
                  } else {
                    that.copyTemplates[i].left = 145;
                  }
                  // 将每个元素的 top = 数组里面最小高度 + 间距
                  that.copyTemplates[i].top = minH + 15;
                  // top 赋值完成后，将新的高度替换原来最短的
                  that.hArr[that.hArr.indexOf(minH)] = that.copyTemplates[i].top + that.copyTemplates[i].height;
                }
                // i 等于数据最大长度，将处理好的数据赋值给原数组或者新增
                if (i === dataLength - 1) {
                  that.pageNum++;
                  if (flag) {
                    that.templates = [...that.copyTemplates];
                  } else {
                    that.templates = [...that.templates, ...that.copyTemplates];
                  }
                  // 更新按钮位置
                  that.textTop = Math.max.apply(null, that.hArr) + 15;
                }
              }
            }
          };

        });
      });
  }

  // 获取喜欢的全部列表
  initGetFavTemplateList(pageNum = 1, flag = true, title = '') {
    // 用一个数组来存放未处理的数据
    if (flag) {
      this.copyFavTemplates = [];
      this.hFavArr = [];
      this.favPageNum = pageNum;
    }
    this._http.get(`${this.favTemplateUrl}&pagenum=${pageNum}&title=${title}`, this.httpOptions)
      .subscribe(data => {
        // 用一个数组来存放未处理的数据
        this.copyFavTemplates = data['data']['list'].map(item => {
          item['id'] = item.caseid;
          return item;
        });
        const dataLength = data['data']['list'].length;
        this.favTemplateTotal = Math.ceil(data['data']['total'] / 10);
        const arr = [];
        if (dataLength === 0) {
          // 更新按钮位置
          this.textFavTop = 15;
          // 这里判断一下搜索词 判断是本身没有数据（title === ''）还是没有搜索到数据（title !== ''）
          if (title !== '') {
            this.favTip = '没有找到你喜欢的模板';
          } else {
            this.favTip = '还没有收藏过任何模板';
          }
          this.isFavTemplateHidden = true;
          return;
        }

        this.copyFavTemplates.map((item, index) => {
          const imgUrl = item.thumb;
          const img = new Image();
          img.src = imgUrl;
          const that = this;
          img.onload = function () {
            arr.push(index);
            // 处理每个 img 的高，因为每个都是 120 宽
            that.copyFavTemplates[index]['height'] = Math.round(img.height * 120 / img.width);
            // arr 长度等于接收数据长度时表明图片全部加载完成
            if (arr.length === dataLength) {
              for (let i = 0; i < dataLength; i++) {
                // 将第一页的前两个数据存进 hFavArr
                if (i < 2 && that.favPageNum === 1) {
                  that.hFavArr.push(that.copyFavTemplates[i].height);
                  that.copyFavTemplates[i].top = 0;
                  if (i === 0) {
                    that.copyFavTemplates[0].left = 15;
                  } else {
                    that.copyFavTemplates[1].left = 145;
                  }
                } else {
                  // 找出最短的高度
                  const minH = Math.min.apply(null, that.hFavArr);
                  // 0 表示左边 1表示右边（里面只有两个数据）
                  if (that.hFavArr.indexOf(minH) === 0) {
                    that.copyFavTemplates[i].left = 15;
                  } else {
                    that.copyFavTemplates[i].left = 145;
                  }
                  // 将每个元素的 top = 数组里面最小高度 + 间距
                  that.copyFavTemplates[i].top = minH + 15;
                  // top 赋值完成后，将新的高度替换原来最短的
                  that.hFavArr[that.hFavArr.indexOf(minH)] = that.copyFavTemplates[i].top + that.copyFavTemplates[i].height;
                }
                // i 等于数据最大长度，将处理好的数据赋值给原数组或者新增
                if (i === dataLength - 1) {
                  that.favPageNum++;
                  if (flag) {
                    that.favTemplates = [...that.copyFavTemplates];
                  } else {
                    that.favTemplates = [...that.favTemplates, ...that.copyFavTemplates];
                  }
                  // 更新按钮位置
                  that.textFavTop = Math.max.apply(null, that.hFavArr) + 15;
                }
              }
            }
          };
            if (this.copyFavTemplates.length < 10) {
              this.text = '- 没有更多了 -';
            }
        });
      });
  }

  // 滚动底部加载我的喜欢
  handlePersonScroll() {
    var e = e || window.event;
    // 节流
    if (this.personTimer) {
      clearTimeout(this.personTimer);
    }

    this.personTimer = setTimeout(() => {
      const top = Math.round(e.target.scrollTop);
      // 最大滚动距离
      const maxHeight = e.target.scrollHeight - e.target.clientHeight - 10;
      if (top >= maxHeight && this.favPageNum <= this.favTemplateTotal) {
        this.initGetFavTemplateList(this.favPageNum, false);
      } else if (this.favPageNum > this.favTemplateTotal) {
        this.text = '- 没有更多了 -';
      }
    }, 50);

  }

  // 滚动到底部加载
  handleScroll() {
    var e = e || window.event;
    if (this.sysTimer) {
      clearTimeout(this.sysTimer);
    }

    this.sysTimer = setTimeout(() => {
      const top = Math.round(e.target.scrollTop);
      // 最大滚动距离
      const maxHeight = e.target.scrollHeight - e.target.clientHeight - 10;
      if (top >= maxHeight && this.pageNum <= this.templateTotal) {
        this.initGetTemplateList(this.pageNum, false, this.scene_id, this.searchTag);
      } else if (this.pageNum > this.templateTotal) {
        this.text = '- 没有更多了 -';
      }
    }, 50);

  }

  // 全部搜索
  search(title) {
    this.isTemplateHidden = false;
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-search-scene']);
    if (title === '') {
      if (this.searchTag === '') {
        return;
      } else {
        this.searchTag = title;
        this.templates = [];
        this.initGetTemplateList(1, true, this.scene_id, title);
      }
    } else {
      this.templates = [];
      this.searchTag = title;
      this.initGetTemplateList(1, true, this.scene_id, title);
    }
  }

  // 喜欢模板搜索
  searchFav(title) {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-search-myscene']);
    this.isFavTemplateHidden = false;
    if (title === '') {
      if (this.searchTag === '') {
        return;
      } else {
        this.searchTag = title;
        this.favTemplates = [];
        this.initGetFavTemplateList(1, true, title);
      }
    } else {
      this.favTemplates = [];
      this.searchTag = title;
      this.initGetFavTemplateList(1, true, title);
    }
  }

  disLike() {
    // this.favTemplates = this.favTemplates.filter(d => d.caseid !== item.caseid);
    this.toastr.success(null, '已从「我的喜欢」移除');
    this.initGetFavTemplateList();
  }

  // 加载更多
  loadMore() {
    // 判断是不是在搜索
    if (this.pageNum > this.templateTotal) {
      this.text = '- 没有更多了 -';
    } else {
      this.initGetTemplateList(this.pageNum, false, this.scene_id, this.searchTag);
    }
  }

  // 加载更多
  loadFavMore() {
    // 判断是不是在搜索
    if (this.favPageNum > this.favTemplateTotal) {
      this.text = '- 没有更多了 -';
    } else {
      this.initGetFavTemplateList(this.pageNum, false, this.searchFavTag);
    }
  }

  // 模板需求弹窗
  showTemplateDemandFeedback() {
    this._modalService.show(DataDemandFeedbackComponent, {
      initialState: {
        title: '模板需求反馈',
        type: 'template',
        yourRequest: '请描述你的需求'
      }
    });
  }

}
