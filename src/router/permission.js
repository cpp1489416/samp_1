import store from '../store/index'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式

export default function (router) {
  const whiteList = ['/login', '/register', '/404'] // 不重定向白名单
  router.beforeEach((to, from, next) => {
    NProgress.start()
    if (store.getters['username'] !== null && store.getters['username'] !== '') {
      if (store.getters.userInfo === null) {
        store.dispatch('GetUser').then(res => {
        })
      }
      next()
    } else {
      if (whiteList.indexOf(to.path) !== -1) {
        next()
      } else {
        store.commit('SET_IGNORE_AJAX_MESSAGE_BOX', true)
        store.dispatch('GetUser').then(res => {
          next()
          store.commit('SET_IGNORE_AJAX_MESSAGE_BOX', false)
        }).catch(() => {
          next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
          NProgress.done()
          store.commit('SET_IGNORE_AJAX_MESSAGE_BOX', false)
        })
      }
    }
  })

  router.afterEach(() => {
    NProgress.done() // 结束Progress
  })
}
