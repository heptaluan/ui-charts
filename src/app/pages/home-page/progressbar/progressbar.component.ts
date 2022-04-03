import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'lx-progressbar',
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.scss']
})
export class ProgressbarComponent implements OnInit {

  initSearch;
  value;
  striped;

  

  constructor() { }

  ngOnInit() {
  }

  search(e) {

  }

}
