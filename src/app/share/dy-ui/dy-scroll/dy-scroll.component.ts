import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';
// import BScroll from '@better-scroll/core';
// import ScrollBar from '@better-scroll/scroll-bar';
// import MouseWheel from '@better-scroll/mouse-wheel';

import { timer } from 'rxjs/observable/timer';
// BScroll.use(ScrollBar);
// BScroll.use(MouseWheel);

@Component({
  selector: 'app-dy-scroll',
  template: `
    <div class="dy-scroll" #wrap>
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      .dy-scroll {
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
    `
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DyScrollComponent implements OnInit, AfterViewInit {
  private bs;

  @Input() data: any[];
  @Input() refreshDelay = 50;

  @Output() onScrollEnd = new EventEmitter<number>();

  @ViewChild('wrap') private wrapRef: ElementRef;

  constructor(readonly el: ElementRef) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.bs = window['BetterScroll'].createBScroll(this.wrapRef.nativeElement, {
      scrollbar: {
        interactive: true,
        fade: false,
      },
      mouseWheel: {}
    });
    this.bs.on('scrollEnd', ({ y }) => {
      this.onScrollEnd.emit(y);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.refreshScroll();
    }
  }

  private refresh() {
    this.bs.refresh();
  }

  scrollToElement(...args) {
    this.bs.scrollToElement.apply(this.bs, args);
  }

  refreshScroll() {
    timer(this.refreshDelay).subscribe(() => {
      this.refresh();
    });
  }

  scrollTo(...args) {}
}
