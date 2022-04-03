import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[lxChartHost]'
})
export class ChartDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
