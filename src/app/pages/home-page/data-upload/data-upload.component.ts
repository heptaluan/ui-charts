import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { HttpClient } from '@angular/common/http';
import { DeleteUploadComponent } from '../../../components/modals/delete-upload/delete-upload.component';
import { VipService } from '../../../share/services/vip.service';
import * as _ from 'lodash';
import { take, catchError } from 'rxjs/operators';
import { API } from '../../../states/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {  UploadDataModalComponent } from '../../../components/modals';
import { UpgradeMemberComponent } from '../../../components/modals/upgrade-member/upgrade-member.component';
import { ContactUsModalComponent } from '../../../components/modals/contact-us-modal/contact-us-modal.component';

@Component({
  selector: 'lx-data-upload',
  templateUrl: './data-upload.component.html',
  styleUrls: ['./data-upload.component.scss']
})

export class DataUploadComponent implements OnInit {
  initSearch;
  progressbarValue = 0;
  isCheckedAll: boolean = false;
  listIds = [];
  bsModalRef: BsModalRef;
  dataTemplates = [];
  dataReportTemplates = [];
  templateTotal;            // 用户可以使用的模版数量
  deleteArr = [];                   // 存删除的数组
  isVpl: string;                    // 会员等级
  searchResult: boolean = false;    // 搜索结果
  listTemplates = [];               // 列表
  currentPage: number = 1;          // 当前页
  totalPage: number = 0;                // 总共页
  pageSize: 10;                     // 每页长度

  titleSearch: string = '';
  showSearchLoading: boolean = false;
  timer;

  private httpOptions = { withCredentials: true };

  constructor(
    private _modalService: BsModalService,
    private _http: HttpClient,
    private _vipService: VipService,
    private _api: API,
    private _router: Router,
    private toastr: ToastrService,

  ) { }

  ngOnInit() {
    // 百度统计
    // window['_hmt'].push(['_trackPageview', '/appv2/#/pages/home/dataupload']);

    this.isVpl = this._vipService.getVipLevel();
    
    // 获取上传数据
    this.getUploadData();
  }

  // 搜索
  search(title, page: number = 1) {
    this.titleSearch = title;
    this._http.get(`${this._api.getUploadList()}?title=${title}&page=${page}`, this.httpOptions)
      .subscribe(data => {
        this.listTemplates = data['data']['results'];
        this.progressbarValue = data['data']['count'];
        this.templateTotal = data['data']['max_upload_num'];
        this.totalPage = this.progressbarValue;
        this.searchResult = this.progressbarValue === 0;
      });
  }

  // 获取上传数据
  getUploadData(page: number = 1) {
    this.currentPage = page;
    this._http.get(`${this._api.getUploadList()}?page=${page}`, this.httpOptions)
      .subscribe(data => {
        this.listTemplates = data['data']['results'];
        this.progressbarValue = data['data']['count'];
        this.templateTotal = data['data']['max_upload_num'] ? data['data']['max_upload_num'] : '∞';
        this.totalPage = this.progressbarValue;
        this.timer = setTimeout(() => {
          this.showSearchLoading = true;
        }, 300);
      });
  }

  // 删除数据成功
  deleteSucc() {
    // 删除且是当前页最后一条
    if (this.progressbarValue % 10 === 1 && this.currentPage !== 1) {
      this.currentPage--;
    }
    this.getUploadData(this.currentPage);
  }

  // 全选
  checkedAll(e) {
    this.isCheckedAll = e.target.checked;
    if (this.isCheckedAll) {
      this.listIds = [];
      this.listTemplates.map(item => {
        this.listIds.push(item.id_str);
      });

    } else {
      this.listIds = [];
    }
  }

  // 全删按钮
  allDelete() {
    // let tip = this.listIds.length === this.listTemplates.length ? '全部的' : this.listIds.length + '条';
    const tip = this.listIds.length + '条';
    this.bsModalRef = this._modalService.show(DeleteUploadComponent, {
      initialState: {
        content: '删除后将无法恢复，是否要进行删除操作？',
        deleteTitle: {
          position: 'left',
          content: `确认删除${tip}数据吗?`
        }
      }
    });
    this._modalService.onHidden.pipe(take(1)).subscribe((r: string) => {
      if (this.bsModalRef.content.confirmFlag) {
        this._http.post(`${this._api.getUploadList()}`, { 'action': 'DELETE', 'data': this.listIds }, this.httpOptions)
          .pipe(
            catchError(err => {
              this.toastr.error(null, '删除失败');
              return err;
            })
          )
          .subscribe(() => {
            this.getUploadData();
            this.toastr.success(null, '删除成功');
          });
        this.listIds = [];
      }
    });
  }

  // 会员提示
  upgrade() {
    this._router.navigate(['pages', 'home', 'price']);
  }

  // 分页事件
  onPageChanged(e) {
    this.showSearchLoading = false;
    this.currentPage = e.page;

    if (this.titleSearch === '') {
      this.getUploadData(this.currentPage);
    } else {
      this.search(this.titleSearch, this.currentPage);
    }

    window.scrollTo(0, 0);
    this.listIds = [];
  }

  dataUpload() {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'chart', 'data-management', 'data-manege-upload-click']);
    
    if(this.progressbarValue >= this.templateTotal) { //项目超限提醒
      if (this.isVpl === 'None') {
        // this.bsModalRef.hide();
        this._modalService.show(UpgradeMemberComponent, {
          initialState: {
            chaeckType: 0,
            vipIds: ['5'],
            svipIds: ['5']
          }
        });
      } else if (this.isVpl === 'vip1' || this.isVpl === 'vip2') {
        // this.bsModalRef.hide();
        this._modalService.show(ContactUsModalComponent, {
          initialState: {
            content: '会员最多可存储100个数据。请先在我的-数据中删除部分数据后再重新上传。',
            title: {
              position: 'center',
              content: '提示',
              button: '确定'
            }
          }
        });
      } else if (this.isVpl === 'eip1') {
        // this.bsModalRef.hide();
        this._modalService.show(ContactUsModalComponent, {
          initialState: {
            content: '企业会员最多可存储5000个数据。请先在「数据管理-我的上传」中删除部分数据，再勾选“自动保存”选项。',
            title: {
              position: 'center',
              content: '提示',
              button: '确定'
            }
          }
        });
      }
    } else {
      this._modalService.show(UploadDataModalComponent, {
      });
      this._modalService.onHidden.pipe(take(1)).subscribe((r: string) => {
        this.getUploadData()
      });
   
    }
  }

  // 计算进度条颜色
  getProgressColor(usedTotalNum, totalNum) {
    let progressColorType = '';
    // 用户使用空间与总空间
    const rate = usedTotalNum / totalNum;
    // 占比 0 - 50% 默认
    if (rate < 0.5) {
      progressColorType = '';
    } else if (rate >= 0.5 && rate < 0.9) {  // 占比 50% - 90% warning
      progressColorType = 'warning';
    } else {  // 占比 90% + danger
      progressColorType = 'danger';
    }
    return progressColorType;
  }

}
