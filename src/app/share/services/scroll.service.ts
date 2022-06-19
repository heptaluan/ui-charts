import { Injectable } from '@angular/core'
import { Subject } from 'rxjs/Subject'

@Injectable()
export class ScrollService {
  infoScroll = new Subject()
  collectScroll = new Subject()

  sendInfoScroll(data) {
    this.infoScroll.next(data)
  }

  getInfoScroll() {
    return this.infoScroll.asObservable()
  }

  sendCollectScroll(data) {
    this.collectScroll.next(data)
  }

  getCollectScroll() {
    return this.collectScroll.asObservable()
  }
}
