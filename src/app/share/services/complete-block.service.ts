import { Injectable } from '@angular/core'
import * as _ from 'lodash'

@Injectable()
export class CompleteBlockService {
  constructor() {}

  // 处理图表数据，针对不同的图表进行对应的处理，返回处理后的数据
  handleAllChartsData(newBlock) {
    let dataSrc
    switch (newBlock.templateSwitch) {
      case 'cross':
      case 'cross-time':
        dataSrc = newBlock.dataSrc.data[0][0]
        if (newBlock.templateId === '154778232785223023') {
          dataSrc = _.unzip(newBlock.dataSrc.data[0])[0]
        }
        break
      case 'obj-n-value-time':
        dataSrc = _.unzip(newBlock.dataSrc.data[0])[1]
        break
      case 'key-value':
        dataSrc = _.unzip(newBlock.dataSrc.data[0])[0]
        break
      case 'tree':
      case 'sunburst':
      case 'tree-value':
      case 'obj-n-value':
      case 'obj-type-value':
        dataSrc = _.uniq(_.unzip(newBlock.dataSrc.data[0])[0])
        break
      case 'sankey':
        dataSrc = _.compact(_.uniq([..._.unzip(newBlock.dataSrc.data[0])[0], ..._.unzip(newBlock.dataSrc.data[0])[1]]))
        break
      default:
        break
    }
    return dataSrc
  }
}
