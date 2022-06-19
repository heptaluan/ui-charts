import { Injectable } from '@angular/core'
import { Subject, Observable } from 'rxjs'

@Injectable()
export class NotifyChartRenderService {
  private subject = new Subject<any>()
  private playBySpeedSubject = new Subject<any>()

  sendChartRender(data: any) {
    this.subject.next(data)
  }

  getChartRender(): Observable<any> {
    return this.subject.asObservable()
  }

  sendChartSpeed(data: number) {
    this.playBySpeedSubject.next(data)
  }

  getChartSpeed(): Observable<any> {
    return this.playBySpeedSubject.asObservable()
  }
}
