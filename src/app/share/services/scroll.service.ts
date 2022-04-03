import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ScrollService {
  // private emitChangeSource = new Subject<any>();
  // private scrollSource = new Subject<any>();

  // changeEmitted$ = this.emitChangeSource.asObservable();
  // scrollEmitted$ = this.scrollSource.asObservable();

  // // Service message commands
  // emitChange(change: any) {
  //   this.emitChangeSource.next(change);
  // }

  // scroll(change: any) {
  //   this.scrollSource.next(change);
  // }

  // emitChangeDestory() {
  //   this.emitChangeSource.next();
  // }

  // scrollDestory() {
  //   this.scrollSource.next();
  // }

  infoScroll = new Subject();
  collectScroll = new Subject();

  sendInfoScroll(data) {
    this.infoScroll.next(data);
  }

  getInfoScroll() {
    return this.infoScroll.asObservable();
  }

  sendCollectScroll(data) {
    this.collectScroll.next(data);
  }

  getCollectScroll() {
    return this.collectScroll.asObservable();
  }


}
