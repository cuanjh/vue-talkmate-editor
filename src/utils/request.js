import axios from 'axios'
import { Loading, Message } from 'element-ui'
import { store } from '../store'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 99999
})

let activeAxios = 0
let loadingInstance
let timer

const showLoading = () => {
  activeAxios++
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    if (activeAxios > 0) {
      loadingInstance = Loading.service({ fullscreen: true })
    }
  }, 400)
}

const closeLoading = () => {
  activeAxios--
  if (activeAxios <= 0) {
    clearTimeout(timer)
    loadingInstance && loadingInstance.close()
  }
}

// http request 拦截器
service.interceptors.request.use(
  config => {
    showLoading()
    let contentType = 'application/json'
    if (config.headers['Content-Type'] && config.headers['Content-Type'] === 'multipart/form-data') {
      contentType = 'multipart/form-data'
      let form = new FormData()
      if (config.data) {
        let keys = Object.keys(config.data)
        keys.forEach(key => {
          if (key.indexOf('[]') > -1) {
            let val = config.data[key]
            val.split(',').forEach(v => {
              form.append(key.replace('[]', ''), v)
            })
          } else {
            form.append(key, config.data[key])
          }
        })
        config.data = form
      }
    } else {
      config.data = JSON.stringify(config.data)
    }

    const token = store.getters['user/token']
    config.headers = {
      'Content-Type': contentType,
      'x-token': token
    }
    return config
  },
  error => {
    closeLoading()
    Message({
      showClose: true,
      message: error,
      type: 'error'
    })
    return Promise.reject(error)
  }
)

// http response 拦截器
service.interceptors.response.use(
  response => {
    closeLoading()
    if (response.data.success) {
      return response.data
    } else {
      let msg = ''
      if (response.data.data && response.data.data.err) {
        msg = response.data.data.err
      }
      if (!msg) {
        msg = response.data.msg
      }
      Message({
        showClose: true,
        message: msg,
        type: 'error',
        onClose: () => {
          if (response.data.data && response.data.data.reload) {
            store.commit('user/LoginOut')
          }
        }
      })
      return Promise.reject(response.data.msg)
    }
  },
  error => {
    closeLoading()
    Message({
      showClose: true,
      message: error,
      type: 'error'
    })
    return Promise.reject(error)
  }
)

export default service
