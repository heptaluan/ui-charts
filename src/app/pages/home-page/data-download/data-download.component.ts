import { Component, OnInit, ViewChild } from '@angular/core'
import { TabsetConfig } from 'ngx-bootstrap/tabs'
import { BsModalService } from 'ngx-bootstrap/modal'
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service'
import { HttpClient } from '@angular/common/http'
import { DeleteUploadComponent } from '../../../components/modals/delete-upload/delete-upload.component'
import { VipService } from '../../../share/services/vip.service'
import { API } from '../../../states/api.service'
import { Router } from '@angular/router'

import * as _ from 'lodash'
import { take, catchError } from 'rxjs/operators'
import { FormSearchComponent } from '../../../share/form-search/form-search.component'
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'lx-data-download',
  templateUrl: './data-download.component.html',
  styleUrls: ['./data-download.component.scss'],
})
export class DataDownloadComponent implements OnInit {
  @ViewChild('searchWord') searchWord: FormSearchComponent

  initSearch
  progressbarValue = 0
  isCheckedAll: boolean = false
  listIds = []
  bsModalRef: BsModalRef
  listTemplates = []
  dataTemplates = []
  dataReportTemplates = []
  copyArr = []
  templateTotal: number = 30 // 用户可以使用的模版数量
  deleteArr = [] // 存删除的数组
  isVpl: string
  searchResult: boolean = false
  dataType: string = 'xlsx'
  currentPage: number = 1 // 当前页
  pageSize: 10 // 每页长度

  excelNum: number = 0
  pdfNum: number = 0

  excelCurrentNum = 0 // 当前页显示的数量，分页依据
  pdfCurrentNum = 0
  currentTotalNum = 0

  excelTotal: number = 30
  pdfTotal: number = 30

  titleSearch: string = ''
  showSearchLoading: boolean = false
  timer

  private downloadUrl = `${this._api.getOldUrl()}/datastore/user_download_log/`
  private httpOptions = { withCredentials: true }

  constructor(
    private _modalService: BsModalService,
    private _http: HttpClient,
    private _vipService: VipService,
    private _api: API,
    private _router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.isVpl = this._vipService.getVipLevel()
    this.getDownLoadData('xlsx')
    this.getDownLoadData('pdf')
    this.listTemplates = this.dataTemplates
    this.progressbarValue = this.excelNum
  }

  search(title, page: number = 1) {
    this.titleSearch = title
    this._http
      .get(`${this._api.getDownloadList()}?type=${this.dataType}&title=${title}&page=${page}`, this.httpOptions)
      .subscribe((data) => {
        this.listTemplates = data['data']['results']
        this.searchResult = data['data']['count'] === 0
        if (this.dataType === 'xlsx') {
          this.dataTemplates = data['data']['results']
          this.copyArr = this.dataTemplates
        } else {
          this.dataReportTemplates = data['data']['results']
          this.copyArr = this.dataReportTemplates
        }
      })
  }

  onTabSelect(e) {
    this.showSearchLoading = false
    this.dataType = e.id
    this.listIds = []
    this.progressbarValue = this.dataType === 'xlsx' ? this.excelNum : this.pdfNum
    this.currentTotalNum = this.dataType === 'xlsx' ? this.excelCurrentNum : this.pdfCurrentNum
    this.templateTotal = this.dataType === 'xlsx' ? this.excelTotal : this.pdfTotal
    this.copyArr = this.dataType === 'xlsx' ? this.dataTemplates : this.dataReportTemplates
    if (this.dataType === 'xlsx') {
      if (this.dataTemplates.length === 0) {
        this.getDownLoadData('xlsx')
      } else {
        this.showSearchLoading = true
      }
    } else {
      if (this.dataReportTemplates.length === 0) {
        this.getDownLoadData('pdf')
      } else {
        this.showSearchLoading = true
      }
    }
  }

  getDownLoadData(type, page: number = 1) {
    this.titleSearch = ''
    if (type === 'xlsx') {
      this._http.get(`${this.downloadUrl}?page=${page}&type=xlsx`, this.httpOptions).subscribe((data) => {
        this.excelNum = data['data']['downloaded_num']
        this.excelCurrentNum = data['data']['count']
        this.progressbarValue = this.excelNum
        this.currentTotalNum = this.excelCurrentNum
        this.templateTotal = data['data']['max_download_num']
        this.excelTotal = this.templateTotal
        this.dataTemplates = data['data']['results']
        this.copyArr = this.dataTemplates
        this.timer = setTimeout(() => {
          this.showSearchLoading = true
        }, 300)
      })
    } else if (type === 'pdf') {
      this._http.get(`${this.downloadUrl}?page=${page}&type=pdf`, this.httpOptions).subscribe((data) => {
        this.dataReportTemplates = data['data']['results']
        this.pdfNum = data['data']['downloaded_num']
        this.pdfCurrentNum = data['data']['count']
        this.pdfTotal = data['data']['max_download_num']
        this.copyArr = this.dataReportTemplates
        this.timer = setTimeout(() => {
          this.showSearchLoading = true
        }, 300)
      })
    }
  }

  onPageChanged(e) {
    this.showSearchLoading = false
    this.currentPage = e.page
    window.scrollTo(0, 0)
    this.listIds = []
    if (this.titleSearch) {
      this.search(this.titleSearch, this.currentPage)
    } else {
      this.getDownLoadData(this.dataType, this.currentPage)
    }
  }

  checkedAll(e) {
    this.isCheckedAll = e.target.checked
    if (this.isCheckedAll) {
      this.listIds = []
      this.selectTemplates()
    } else {
      this.listIds = []
    }
  }

  selectTemplates() {
    const list = this.dataType === 'xlsx' ? this.dataTemplates : this.dataReportTemplates
    list.map((item) => {
      this.listIds.push(item.Id)
    })
  }

  allDelete() {
    let tip = this.listIds.length === this.copyArr.length ? '全部的' : this.listIds.length + '条'
    let text = this.dataType === 'xlsx' ? '数据' : '数据报告'
    this.bsModalRef = this._modalService.show(DeleteUploadComponent, {
      initialState: {
        content: '删除后将无法恢复，是否要进行删除操作？',
        deleteTitle: {
          position: 'left',
          content: `确认删除${tip}${text}吗?`,
        },
      },
    })
    this._modalService.onHidden.pipe(take(1)).subscribe((r: string) => {
      if (this.bsModalRef.content.confirmFlag) {
        this._http
          .post(`${this.downloadUrl}`, { action: 'DELETE', data: this.listIds }, this.httpOptions)
          .pipe(
            catchError((err) => {
              this.toastr.error(null, '删除失败')
              return err
            })
          )
          .subscribe(() => {
            this.getDownLoadData(this.dataType)
            this.toastr.success(null, '删除成功')
          })

        this.listIds = []
      }
    })
  }

  // 会员提示
  upgrade() {
    this._router.navigate(['pages', 'price', 'index'])
  }
}
