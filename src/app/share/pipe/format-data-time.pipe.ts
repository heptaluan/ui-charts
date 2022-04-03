import { Pipe, PipeTransform } from "@angular/core";
import * as _ from 'lodash';

@Pipe({
  name: "formatDataTime"
})

export class FormatDataTimePipe implements PipeTransform {

  transform(value: string) {
    // if (value.length <= 4) {
    //   return value;
    // } else {
    //   value = value.replace(/，/g, ',');
    //   return `${_.take(value.split(','))} - ${_.takeRight(value.split(','))}`
    // }
    value = value.replace(/，/g, ',');
    let arr = value.split(',');
    let arrLength = arr.length;
    if (arrLength > 1) {
      let firstYear = arr[0];
      let lastYear = arr[arrLength - 1];
      if (firstYear === lastYear) {
        return firstYear;
      } else {
        return `${firstYear} - ${lastYear}`;
      }
    } else {
      return arr.join('');
    }
  }
}
