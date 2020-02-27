let qiniu = require('qiniu-js')

/** 将base64转换为文件对象
 *  @param {String} base64 base64字符串
 * */
export const convertBase64ToBlob = (base64) => {
  var base64Arr = base64.split(',')
  var imgtype = ''
  var base64String = ''
  if (base64Arr.length > 1) {
    // 如果是图片base64，去掉头信息
    base64String = base64Arr[1]
    imgtype = base64Arr[0].substring(base64Arr[0].indexOf(':') + 1, base64Arr[0].indexOf(';'))
  }
  // 将base64解码
  var bytes = atob(base64String)
  // var bytes = base64;
  var bytesCode = new ArrayBuffer(bytes.length)
  // 转换为类型化数组
  var byteArray = new Uint8Array(bytesCode)

  // 将base64转换为ascii码
  for (var i = 0; i < bytes.length; i++) {
    byteArray[i] = bytes.charCodeAt(i)
  }

  // 生成Blob对象（文件对象
  /* eslint-disable */
  return new Blob( [bytesCode], {type : imgtype})
  /* eslint-enable */
}

export const uploadQiniu = (file, token, key) => {
  return new Promise((resolve, reject) => {
    let finishedAttr = []
    let compareChunks = []

    let config = {
      useCdnDomain: true,
      disableStatisticsReport: false,
      retryCount: 6,
      region: qiniu.region.z0
    }

    let putExtra = {
      fname: '',
      params: {},
      mimeType: ['audio/mp3', 'audio/mpeg', 'video/mp4', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.ms-powerpoint', 'image/jpeg', 'image/png', 'image/webp', 'application/pdf'] || null
    }

    let observable = qiniu.upload(file, key, token, putExtra, config)

    observable.subscribe({
      next: (response) => {
        console.log(response)
        var chunks = response.chunks || []
        var total = response.total
        // 这里对每个chunk更新进度，并记录已经更新好的避免重复更新，同时对未开始更新的跳过
        for (var i = 0; i < chunks.length; i++) {
          /* eslint-disable */
          if (chunks[i].percent === 0 || finishedAttr[i]) {
            continue;
          }
          if (compareChunks[i].percent === chunks[i].percent) {
            continue;
          }
          /* eslint-enable */
          if (chunks[i].percent === 100) {
            finishedAttr[i] = true
          }
          console.log(chunks[i].percent + '%')
        }
        console.log('进度：' + total.percent + '%')
        compareChunks = chunks
      },
      error: (err) => {
        reject(err)
      },
      complete: (res) => {
        resolve(res)
      }
    })
  }, error => {
    // 请求异常处理
    this.$message({
      showClose: true,
      message: '好像没有成功哦，再试一次吧~',
      type: 'error'
    })
    console.log(error)
  })
}
