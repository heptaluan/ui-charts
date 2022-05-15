import { Component, OnInit } from '@angular/core'
import { UtilsService } from '../../share/services/utils.service'

@Component({
  selector: 'lx-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss'],
})
export class PriceComponent implements OnInit {
  browserType: string = ''
  isChrome: boolean = true
  isCloseTip: boolean = false

  isShowBackTop: boolean = false

  constructor(private _utilService: UtilsService) {}

  ngOnInit() {
    this.isChrome = this._utilService.getBrowserInfo() === 'Chrome' || this._utilService.getBrowserInfo() === 'Safari'
    this.isCloseTip = this._utilService.isCloseTip
  }

  ngAfterViewInit(): void {
    window.addEventListener('scroll', this.handleScroll.bind(this))
  }

  closeTip() {
    this.isCloseTip = true
    this._utilService.closeTip()
  }

  handleScroll() {
    const top = Math.round(document.documentElement.scrollTop)
    if (top >= 500) {
      this.isShowBackTop = true
    } else {
      this.isShowBackTop = false
    }
  }
}
