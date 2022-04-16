import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'lx-beginner',
  templateUrl: './beginner.component.html',
  styleUrls: ['./beginner.component.scss'],
})
export class BeginnerComponent implements OnInit {
  listTop = [
    { project: '项目', status: { title: '状态', flag: false }, award: '奖励时长' },
    { project: '验证邮箱', status: { title: '', flag: false }, award: '5天' },
    { project: '验证微信', status: { title: '', flag: false }, award: '3天' },
    { project: '关注镝数微信号', status: { title: '', flag: false }, award: '7天' },
  ]

  constructor() {}

  ngOnInit() {}
}
