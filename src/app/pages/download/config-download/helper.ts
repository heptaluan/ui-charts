import { isObject } from 'lodash'

/**
 * 将图片转换成base64 并返回路径
 * @param img
 * @param {number} width 调用时传入具体像素值，控制大小 ,不传则默认图像大小
 * @param {number} height
 * @returns {string}
 */
function getBase64Image(img, width = 0, height = 0) {
  const canvas = document.createElement('canvas')
  canvas.width = width ? width : img.width
  canvas.height = height ? height : img.height

  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  const dataURL = canvas.toDataURL()
  return dataURL
}

/**
 * 检查是不是Base64
 * @param img
 * @returns {boolean}
 */
function IsBase64(img) {
  // jpg jpeg png gif
  const _img = img.toLowerCase()
  if (_img.endsWith('jpg') || _img.endsWith('jpeg') || _img.endsWith('png') || _img.endsWith('gif')) return false
  return true
}

/**
 * 加载图片 加载成功后经图片返回
 * @param img
 * @returns {Promise<any>}
 */
function getBase64(img) {
  let url: string
  if (IsBase64(img)) {
    // 有一些数据 后台没有返回前缀
    const _base64 = 'data:image/jpeg;base64,'
    if (img.startsWith(_base64)) {
      url = img
    } else {
      url = _base64 + img
    }
    return url
  } else {
    url = img
    const image = new Image()
    image.crossOrigin = '*'
    image.src = url
    return new Promise(function (resolve, reject) {
      image.onload = function () {
        resolve(getBase64Image(image)) //将base64传给done上传处理
      }
    })
  }
}

/**
 * 压缩图片
 */
function setBase64Img(zip, base64, imgArr, index, fn) {
  base64 = base64.split('base64,')[1]
  zip.file(`${(index + 1).toString().padStart(5, '0')}.png`, base64, { base64: true })
  if (index === imgArr.length - 1) {
    zip.generateAsync({ type: 'blob' }).then((blob) => {
      // saveAs(blob, downloadName + '.zip');
      // console.log(blob);
      // window['saveAs'](blob, 'image.zip');
      fn(blob)
    })
  }
}

/**
 * 下载压缩图片
 * @param {any[]} imgArr  图片合集
 */
export function downloadZipImage(imgArr: any[], fn) {
  if (!imgArr || !imgArr.length) {
    return
  }
  const zip = new window['JSZip']()
  // 创建images文件夹
  // const imgFolder = zip.folder('images');

  let index = 0 //  判断加载了几张图片的标识
  for (let i = 0; i < imgArr.length; i++) {
    /**
     * 如果是Base64就不需要再做异步处理了
     */
    // const Base64Img = getBase64(imgArr[i]);
    // console.log(imgArr[i]);

    setBase64Img(zip, imgArr[i], imgArr, index, fn)
    index++
    // if (Base64Img['then']) {
    //   Base64Img['then'](function(base64: string){
    //     setBase64Img(zip, imgFolder, base64, imgArr, index);
    //     index++;
    //   },function(err){
    //     console.log(err);//打印异常信息
    //   });
    // } else {
    //   setBase64Img(zip, imgFolder, Base64Img, imgArr, index);
    //   index++;
    // }
  }
}

type exportType = 'jpg' | 'png' | 'svg' | 'gif' | 'mov' | 'png' | 'mp4'

export function handleBaiduCollect(
  isPhone: boolean,
  chooseType: exportType,
  projectType: 'chart' | 'infographic',
  isHasCompleteId: boolean,
  isDIY: boolean
) {
  if (projectType !== 'chart') {
    // 信息图
    // 不需要判断pc/手机埋点的情况
    if (chooseType === 'jpg' || chooseType === 'png') {
      // 是否是用户自己制作还是用户 fork 的项目再制作
      if (isHasCompleteId) {
        if (isDIY) {
          window['_hmt'].push(['_trackEvent', 'editpage', 'edit-download', `edit-download-my-info-${chooseType}`])
        } else {
          window['_hmt'].push(['_trackEvent', 'editpage', 'edit-download', `edit-download-info-fork-${chooseType}`])
        }
      }
    }
    // 信息图 导出到 PC / phone
    window['_hmt'].push([
      '_trackEvent',
      'editpage',
      'edit-download',
      `edit-download-${isPhone ? `${chooseType}-phone` : chooseType}`,
    ])
  } else {
    // 单图 导出 包括 pc/ phone 全格式导出
    window['_hmt'].push([
      '_trackEvent',
      'editpage',
      'edit-download',
      `edit-download-chart-${isPhone ? `${chooseType}-phone` : chooseType}`,
    ])
  }
}
