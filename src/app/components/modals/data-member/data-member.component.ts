import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionPosition } from '../../../share/modal/modal.component';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'lx-data-member',
  templateUrl: './data-member.component.html',
  styleUrls: ['./data-member.component.scss']
})
export class DataMemberComponent implements OnInit {

  actionPosition: ActionPosition = 'center';
  curIndex = 0;
  btnColors = ['#0287ef', '#220274', '#251a97', '#3ac6ed', '#ed447b'];
  contents = [
    {title: '图表模板全部开放', content: '线形图、柱状图、散点图、雷达图、关系图等所有类型图表模板自由使用。'},
    {title: '项目私密设置', content: '您可以选择私密保存项目，对他人不可见。'},
    {title: '更大的存储空间', content: '享有50个以上的项目的存储空间，给您的创作提供更多想象力。'},
    {title: '项目加密分享', content: '您可以将数据报告加密分享给上司、同事或客户。'},
    {title: '页面logo不显示', content: '会员用户享有不显示logo的权益，使自己的创意展现自如。'},
  ]

  constructor(public bsModalRef: BsModalRef,
    private router: Router,) { }

  ngOnInit() {
  }
  
  onUpgradeClicked() {
    this.bsModalRef.hide();
    this.router.navigate(['pages', 'configuration', 'member']);
  }

  onSlideChange(event) {
    this.curIndex = event;
  }

}
