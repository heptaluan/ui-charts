import { Component, OnInit, Input } from '@angular/core';
import * as ProjectModels from '../../../states/models/project.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'lx-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.scss']
})
export class ThumbnailComponent implements OnInit {

  @Input('contents') contents$: Observable<ProjectModels.InfographicProjectContents>;
  // @Input('logo') logo = true;
  @Input('watermark') showWatermark = true;

  constructor() { }

  ngOnInit() {}

}
