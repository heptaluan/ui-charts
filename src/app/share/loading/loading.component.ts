import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'lx-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  public showLoading: boolean = false;
  loadingBoxStyles = {
    width: 'auto',
    height: 'auto'
  }

  constructor( ) { }

  ngOnInit() {
    this.setLoadingBoxStyles();
    const that = this;
    window.onresize = _.debounce((event) => (
      that.setLoadingBoxStyles()
    ), 0);
  }

  setLoadingBoxStyles() {
    this.loadingBoxStyles.width = innerWidth + 'px';
    this.loadingBoxStyles.height = innerHeight + 'px';
  }

}
