import Vue from 'vue'
import Router from 'vue-router'

/* Layout */
import Layout from '../views/layout/Layout'
import permission from './permission'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/register', component: () => import('@/views/login/register'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  { path: '*', redirect: '/404', hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/login',
    name: 'Login',
    hidden: true ,
    children: [{
      path: 'login',
      component: () => import('@/views/login/index'), 
      name: '登陆',
      meta: {title: '登陆', icon: 'table', sidebarHidden: true },
    }]
  },
  {
    path: '/',
    component: Layout,
    children: [{
      path: '/smart_home',
      component: () => import('@/views/home/index'),
      name: 'Smart Home',
      meta: {title: 'Smart Home', icon: 'table'}
    }]
  },
  {
    path: '/',
    component: Layout,
    name: 'Visiting Room',
    children: [{
      path: 'visit_room',
      component: () => import('@/views/home/visit_room'),
      name: '客厅',
      meta: {title: '客厅', icon: 'table'}
    }]
  },
  {
    path: '/',
    component: Layout,
    name: 'Kitchen',
    children: [{
      path: 'kitchen',
      component: () => import('@/views/home/kitchen'),
      name: '厨房',
      meta: {title: '厨房', icon: 'table'}
    }]
  },
  {
    path: '/',
    component: Layout,
    name: 'main_room',
    children: [{
      path: 'main_room',
      component: () => import('@/views/home/main_room'),
      name: '主卧',
      meta: {title: '主卧', icon: 'table'}
    }]
  },
  {
    path: '/',
    component: Layout,
    name: 'sub_room',
    children: [{
      path: 'sub_room',
      component: () => import('@/views/home/sub_room'),
      name: '副卧',
      meta: {title: '副卧', icon: 'table'}
    }]
  },
  {
    path: '/',
    component: Layout,
    name: 'toilet',
    children: [{
      path: 'toilet',
      component: () => import('@/views/home/toilet'),
      name: '卫生间',
      meta: {title: '卫生间', icon: 'table'}
    }]
  },
  {
    path: '/',
    component: Layout,
    name: 'settings',
    children: [{
      path: 'settings',
      component: () => import('@/views/home/settings'),
      name: '卫生间',
      meta: {title: '配置', icon: 'guide'}
    }]
  },
]

var router = new Router({
  // mode: 'history', //后端支持可开
  base: '/books_recommend/',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

permission(router)

export { router }

export default router
