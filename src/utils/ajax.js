import axios from 'axios'
import { MessageBox, Notification } from 'element-ui'
import store from '../store'
import router from '@/router'

// with cookie
axios.defaults.withCredentials = true

// 创建axios实例
const service = axios.create({
  baseURL: 'api', // api 的 base_url
  timeout: 1000 * 60 * 5 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    alert(error)
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== '0') {
      Notification.error({
        title: 'ajax responding error',
        dangerouslyUseHTMLString: true,
        message: 'loc: ' + response.config.method.toUpperCase() + ' ' + response.config.url + '<br/>' +
         '<span style="">' + 'code: ' + res.code + ' </span> <br/>' +
         'msg: ' + res.msg
      })
    }
    return response.data
  },
  error => {
    if (error.response.status !== 200) {
      Notification.error({
        title: 'ajax error',
        dangerouslyUseHTMLString: true,
        message: '<span style="color:red;">' + error.response.status + ' </span>' +
          error.response.config.method.toUpperCase() + ' ' +
          error.response.config.url
      })
      if ((error.response.status === 403 || error.response.status === 401) &&
        !store.getters.ignoreAjaxMessageBox) {
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('FedLogOut').then(() => {
            router.push(`/login?redirect=${router.currentRoute.path}`)
          })
        })
      }
    } else {
      Notification.error({
        title: 'ajax error',
        dangerouslyUseHTMLString: true,
        message: '<span style="color:red;">' + error + ' </span>' +
          error.response.config.url
      })
    }
    return Promise.reject(error)
  }
)

export default service
