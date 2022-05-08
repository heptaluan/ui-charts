import { Component, OnInit, Input, HostBinding } from '@angular/core'
import { CaseType } from '../generate-case/generate-case.component'

@Component({
  selector: 'lx-project-type-collection',
  templateUrl: './project-type-collection.component.html',
  styleUrls: ['./project-type-collection.component.scss'],
})
export class ProjectTypeCollectionComponent implements OnInit {
  @Input('types') types: CaseType[]

  @HostBinding('class.d-flex') flex = true
  @HostBinding('class.justify-content-start') justifyCenter = true
  @HostBinding('class.align-items-center') align = true

  constructor() {}

  ngOnInit() {}
}
