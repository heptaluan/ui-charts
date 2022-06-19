import { Injectable } from '@angular/core'
import { chartDisplayDicArr } from '../common-type'

@Injectable()
export class SearchTypeService {
  constructor() {}

  // 选择样式
  selectDisplay(name) {
    return chartDisplayDicArr.filter((item) => item.jsonElement === name)[0]
  }
}
