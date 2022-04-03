import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Router } from '@angular/router';
import { VipService } from '../../../share/services/vip.service';
import { BsModalService } from 'ngx-bootstrap';
import { PayDataModalComponent } from '../pay-data-modal/pay-data-modal.component';

@Component({
  selector: 'lx-contact-us-modal',
  templateUrl: './contact-us-modal.component.html',
  styleUrls: ['./contact-us-modal.component.scss']
})
export class ContactUsModalComponent implements OnInit {
  isNoRemind: boolean = false;
  vpl: string = 'None';

  // 不需要不再提醒
  isNoNeedRemind: boolean = false;

  // 不需要确认标识
  isNoNeedComfirm: boolean = false;

  // 不需要升级超链
  isUpgrade: boolean = false

  // 判断是否最大下载数与下载数是否相等
  isOverContain: boolean = false;

  content = '';
  title = {
    position: '',
    content: '',
    button: ''
  };

  downLoadData = {
    downloadNum: '',
    maxDownloadNum: '',
    deadline: '',
    isNoDiscount: true,     // true 表示会员跟普通会员
    discountNum: 10,       // 打折
    isFree: true,            // 价格
    type: 'xlsx',
    price: 0,
    title: '',
    thumb: '',
    source: '',
    time: '',
    geotype: '',
    id: '',
    isCurMonDownload: false
  };

  // 区分数据和数据报告
  fileContent = '';

  // 区分升级链接的数据和数据报告
  upFileContent = '';

  // 区分单独购买数据/报告
  typeContent = '';

  // 区分数据和数据报告 ‘或使用’
  useContent = '';

  // 区分数据和数据报告 高级会员个数
  maxNum;

  // 关闭 X 是否开启
  isCloseButton: boolean = false;

  confirmFlag: boolean = false;

  // 控制显示普通框还是下载详情过来的
  isShowDownload: boolean = false;

  constructor(
    public bsModalRef: BsModalRef,
    private _route: Router,
    private _vipService: VipService,
    private _modalService: BsModalService
  ) { }

  ngOnInit() {
    this.vpl = this._vipService.getVipLevel();

    // 下载过来的
    if (this.isShowDownload) {
      this.isOverContain = this.downLoadData.downloadNum >= this.downLoadData.maxDownloadNum;

      this.useContent = this.downLoadData.type === 'xlsx' ? '或使用' : '';
      this.maxNum = this.downLoadData.type === 'xlsx' ? 100 : 50;

      if (this.downLoadData.type === 'xlsx') {
        this.upFileContent = '免费/自营付费数据';
        this.typeContent = '数据';

        if (this.downLoadData.isNoDiscount) {
          this.fileContent = '免费数据';
        } else {
          this.fileContent = '免费/自营付费数据';
        }
      } else {
        this.upFileContent = '免费数据报告';
        this.typeContent = '数据报告';

        if (this.downLoadData.isNoDiscount) {
          this.fileContent = '免费数据报告';
        } else {
          this.fileContent = '数据报告';
        }
      }
    }
  }

  // 确定按钮
  buttonClick() {
    // 升级 / 确定
    if (this.isUpgrade) {
      this.goPrice();
    } else {
      if (!this.isNoNeedComfirm) {
        this.confirmFlag = true;
      } else {
        this.confirmFlag = false;
      }
      if (this.isNoRemind) {
        // 设置 cookie 30 天后过期
        this.setCookie('noRemind', true, 'd30');
      }
      this.bsModalRef.hide();
      // 原价不为 0，超限
      if (this.isOverContain && !this.downLoadData.isNoDiscount && !this.downLoadData.isFree) {
        this._modalService.show(PayDataModalComponent, {
          initialState: {
            price: this.downLoadData.price,
            isNoDiscount: false,
            dataItem: {
              title: this.downLoadData.title,
              thumb: this.downLoadData.thumb,
              source: this.downLoadData.source,
              time: this.downLoadData.time,
              geotype: this.downLoadData.geotype,
              type: this.downLoadData.type,
              id: this.downLoadData.id
            }
          }
        })
      }
    }
  }

  // 去价格
  goPrice() {
    const tempPage = window.open('', '_blank');
    tempPage.location.href = window.location.href.split('#')[0] + '#/pages/home/price';
  }

  // 去项目管理
  goProjectManage() {
    this._route.navigate(['pages', 'home', 'projectmanagement']);
    this.bsModalRef.hide();
  }

  // 关闭按钮
  close() {
    this.bsModalRef.hide();
    if (this.isNoRemind) {
      // 设置 cookie 30 天后过期
      this.setCookie('noRemind', true, 'd30');
    }
  }

  setCookie(name, value, time) {
    let strsec = this.getsec(time);
    let exp = new Date();
    exp.setTime(exp.getTime() + strsec * 1);
    document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + exp.toUTCString();
  }

  getsec(str) {
    //s20是代表20秒
    //h是指小时，如12小时则是：h12
    //d是天数，30天则：d30
    let str1 = str.substring(1, str.length) * 1;
    let str2 = str.substring(0, 1);
    if (str2 == "s") {
      return str1 * 1000;
    }
    else if (str2 == "h") {
      return str1 * 60 * 60 * 1000;
    }
    else if (str2 == "d") {
      return str1 * 24 * 60 * 60 * 1000;
    }
  }

}
