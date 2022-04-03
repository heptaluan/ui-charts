import { Component, OnInit, ViewChild } from '@angular/core';
import { D3ChartDirective } from '../d3-chart.directive';


@Component({
  selector: 'lx-d3-range-area-chart',
  templateUrl: './d3-range-area-chart.component.html',
  styleUrls: ['./d3-range-area-chart.component.scss']
})
export class D3RangeAreaChartComponent implements OnInit {
  _data;
  set data(val) {
    this._data = val;
    if (this.echart.chartInstance) {
      this.buildOption();
    }
  }
  get data() {
    if (this._data) {
      return this._data;
    }
  }

  @ViewChild(D3ChartDirective) echart: D3ChartDirective;

  chartOption;

  constructor() { }

  ngOnInit() {
    this.buildOption();
  }

  ngOnDestroy() {
  }

  buildOption() {
    this.chartOption = this.data.setting;
  }
}