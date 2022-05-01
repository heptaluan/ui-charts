/*
 * @Description: 新建项目
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'

export interface CaseType {
  title: string
  picture: string
  tag?: string
  url?: string
  hover?: string
}

@Component({
  selector: 'lx-generate-case',
  templateUrl: './generate-case.component.html',
  styleUrls: ['./generate-case.component.scss'],
})
export class GenerateCaseComponent implements OnInit {
  @Input('type') type: CaseType
  @Output('caseClick') caseClick: EventEmitter<any> = new EventEmitter()

  constructor(private router: Router, private activedRoute: ActivatedRoute) {}

  ngOnInit() {}

  onCaseClick() {
    if (this.type.url) {
      this.router.navigateByUrl(this.type.url)
    } else {
      this.caseClick.emit(0)
    }
  }
}
