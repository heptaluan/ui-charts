import { Injectable } from '@angular/core';

@Injectable()
export class WaterfallService {
  initWaterfallData = { rowGap: 18, colGap: 32, errorItemData: {width: 172, height: 172, url: '/dyassets/images/share/dy-ui/load-err.svg'} }

  constructor() { }

  // 初始化瀑布流, 将数据进行处理, 得到带宽高left,top的数据, 与容器高度的对象
  async initWaterFall(data, isMaxHeight = false , {rowGap, colGap, errorItemData} = this.initWaterfallData) {
    // 屏幕宽度
    const clientWidth = document.documentElement.clientWidth;
    // 列数
    const column = this.getColumn(clientWidth);
    // 判断是否是 iframe 里面 iframe 里面宽度 80 ,spa里面是 270 + 80
    const diff = this.isIframe() ? 80 : 350;
    // 容器宽度
    const containerWidth = clientWidth - diff < 930 ? 930 : clientWidth - diff;
    // 子元素宽度
    const itemWidth = this.getItemWidth(containerWidth, rowGap, column);
    // 加载图片，知道每张图的宽高，并且赋值到新数据里
    const firstProcessedData = await this.loadImages(data, itemWidth, colGap, errorItemData, isMaxHeight);
    // 给每个图片定位
    return this.handleDataWaterfall(firstProcessedData, rowGap, colGap, column, itemWidth);
  }

  // 判断是否在iframe 里面
  isIframe() {
    return window.self !== window.top;
  }

  // 获取列数
  getColumn(clientWidth) {
    return clientWidth < 1366 ? 5 : 6;
  }

  // 获取子元素宽度
  getItemWidth(containerWidth, rowGap, column) {
    // 减滚动条宽度，默认有滚动条
    return (containerWidth - 17 - (column - 1) * rowGap) / column;
  }

  // 加载图片，获取图片宽高
  async loadImages(data, itemWidth, colGap, errorItemData, isMaxHeight) {
    let promiseAll = [], imgArr = [], total = data.length;
    for (let i = 0; i < total; i++) {
      promiseAll[i] = new Promise((resolve, reject) => {
        imgArr[i] = new Image();
        imgArr[i].src = data[i].thumb;
        imgArr[i].onload = () => {
          resolve(this.getWaterfallItem(i, imgArr, data, itemWidth, colGap, false, errorItemData, isMaxHeight));
        };
        imgArr[i].onerror = () => {
          resolve(this.getWaterfallItem(i, imgArr, data, itemWidth, colGap, true, errorItemData, isMaxHeight));
        }
      })
    }
    return await Promise.all(promiseAll);
  }

  // 获取每一个元素的宽高
  getWaterfallItem(index, imgArr, data, itemWidth, colGap, isError, errorItemData, isMaxHeight) {
    const imgWidth = isError ? errorItemData.width : imgArr[index].width;
    const imgHeight = isError ? errorItemData.height : imgArr[index].height;
    const itemHeight = Math.floor(itemWidth * imgHeight / imgWidth);
    return {
      url: isError ? errorItemData.url : data[index].thumb,
      left: 0,
      top: 0,
      width: itemWidth,
      height: isMaxHeight && itemHeight + colGap < 120 ? 120 : itemHeight + colGap,  // 此处是场景需要，item整体高度= 图片高度+需要补的高度（这里刚好等于colGap）
      ...data[index]
    }
  }


  // 处理瀑布流数据
  handleDataWaterfall(data, rowGap, colGap, column, itemWidth) {
    const hArr = [];
    for (let i = 0; i < data.length; i++) {
      if (i < column) {
        data[i].left = i * (itemWidth + rowGap);
        data[i].top = 0;
        hArr.push(data[i].height);
      } else {
        const minH = Math.min.apply(null, hArr);
        const index = hArr.indexOf(minH);
        data[i].left = index * (itemWidth + rowGap);
        data[i].top = minH + colGap;
        hArr[index] = minH + colGap + data[i].height;
      }
    }
    return {
      data,
      containerHeight: Math.max.apply(null, hArr)
    };
  }

}
