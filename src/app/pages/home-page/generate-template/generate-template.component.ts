/*
 * @Description: 模板
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { ProjectTemplate } from '../../../states/models/template.model'
@Component({
  selector: 'lx-generate-template',
  templateUrl: './generate-template.component.html',
  styleUrls: ['./generate-template.component.scss'],
})
export class GenerateTemplateComponent implements OnInit {
  @Input('content') content: ProjectTemplate
  @Output('templateClick') templateClick: EventEmitter<any> = new EventEmitter()

  constructor() {}

  ngOnInit() {}

  onTemplateClick() {
    this.templateClick.emit(this.content.id)
  }
}
