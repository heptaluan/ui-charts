import { Component, OnInit, ViewChild } from '@angular/core';
import { TabsetConfig } from 'ngx-bootstrap/tabs';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { take } from 'rxjs/operators';
import * as _ from 'lodash';
import { DeleteUploadComponent } from '../../../components/modals/delete-upload/delete-upload.component';
import { API } from '../../../states/api.service';
import { FormSearchComponent } from '../../../share/form-search/form-search.component';

@Component({
  selector: 'lx-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})

export class FavoriteComponent implements OnInit {

  @ViewChild('searchWord') searchWord: FormSearchComponent;

  initSearch;
  mySubscription = new Subscription();
  myPdfSubscription = new Subscription();

  isCheckedAll: boolean = false;
  listIds = [];
  bsModalRef: BsModalRef;

  listTemplates = [];
  dataTemplates = [];
  dataReportTemplates = [];

  templateTotal: number;                  // 用户可以使用的模版数量
  deleteArr = [];                         // 存删除的数组
  isVpl: string;
  searchResult: boolean = false;
  dataType: string = 'xlsx';
  deadline: string;
  currentPage: number = 1;                // 当前页
  totalPage: number;                      // 总共页
  pageSize: 20;                           // 每页长度

  showSearchLoading: boolean = false;     // 拿到数据前

  excelNum: number = 0;
  pdfNum: number = 0;
  titleSearch: string = '';
  timer;

  private httpOptions = { withCredentials: true };

  constructor(
    private _http: HttpClient,
    private _modalService: BsModalService,
    private _api: API
  ) { }

  ngOnInit() {
    // 百度统计
    // window['_hmt'].push(['_trackPageview', '/appv2/#/pages/home/favorite']);
    this.getFavoriteData("xlsx");
  }

  search(title, page: number = 1) {
    this.titleSearch = title;
    this._http.get(`${this._api.getFavoriteCaseList(this.dataType)}&page=${page}&title=${title}`, this.httpOptions)
      .subscribe(data => {
        this.listTemplates = data['data']['results'];
        this.searchResult = data['data']['count'] === 0;
        if (this.dataType === 'xlsx') {
          this.dataTemplates = data['data']['results'];
        } else {
          this.dataReportTemplates = data['data']['results'];
        }
      })
  }

  onTabSelect(e) {
    this.showSearchLoading = false;
    this.dataType = e.id;
    this.listTemplates = [];
    this.listIds = [];
    this.searchWord.resetSearch();
    this.listTemplates = this.dataType === 'xlsx' ? this.dataTemplates : this.dataReportTemplates;
    if (this.dataType === 'xlsx') {
      if (this.dataTemplates.length === 0) {
        this.getFavoriteData('xlsx');
      } else {
        this.showSearchLoading = true;
      }
    } else {
      if (this.dataReportTemplates.length === 0) {
        this.getFavoriteData('pdf');
      } else {
        this.showSearchLoading = true;
      }
    }
  }

  // 获取喜欢数据
  getFavoriteData(type, page: number = 1) {
    this.titleSearch = '';
    this._http.get(`${this._api.getFavoriteCaseList(type)}&page=${page}`, this.httpOptions)
      .subscribe(data => {
        this.listTemplates = data['data']['results'];
        if (this.dataType === 'xlsx') {
          this.dataTemplates = data['data']['results'];
        } else {
          this.dataReportTemplates = data['data']['results'];
        }
        this.timer = setTimeout(() => {
          this.showSearchLoading = true;
        }, 300)
      })
  }

  // 全选
  checkedAll(e) {
    this.isCheckedAll = e.target.checked;
    if (this.isCheckedAll) {
      this.listIds = [];
      this.selectTemplates();
    } else {
      this.listIds = [];
    }
  }

  // 全选将对应的 id 放进 ids
  selectTemplates() {
    const list = this.dataType === 'xlsx' ? this.dataTemplates : this.dataReportTemplates;
    list.map(item => {
      this.listIds.push(item.dataId);
    })
  }

  // 全删
  allDelete() {
    let list = this.dataType === 'xlsx' ? this.dataTemplates : this.dataReportTemplates;
    let tip = this.listIds.length === list.length ? '全部的' : this.listIds.length + '条';

    let text = this.dataType === 'xlsx' ? '数据' : '数据报告';
    this.bsModalRef = this._modalService.show(DeleteUploadComponent, {
      initialState: {
        content: '删除后将无法恢复，是否要进行删除操作？',
        deleteTitle: {
          position: 'left',
          content: `确认删除${tip}${text}吗?`
        }
      }
    });
    this._modalService.onHidden.pipe(take(1)).subscribe((r: string) => {
      if (this.bsModalRef.content.confirmFlag) {
        const formData = new FormData();
        formData.append('data_list', JSON.stringify(this.listIds))
        formData.append('action', 'DELETE')
        this._http.post(`${this._api.getFavoriteList()}`, formData, this.httpOptions)
          .subscribe(data => {
            this.getFavoriteData(this.dataType);
          });
        this.listIds = [];
      }
    })
  }

  // 分页事件
  onPageChanged(e) {
    this.showSearchLoading = false;
    this.currentPage = e.page;
    window.scrollTo(0, 0);
    this.listIds = [];
    if (this.titleSearch) {
      this.search(this.titleSearch, this.currentPage)
    } else {
      this.getFavoriteData(this.dataType, this.currentPage);
    }
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
  }

}
