// 权限拦截 导航守卫 路由守卫 router
import router from './router' // 引入路由实例
import store from './store' // 引入vuex store实例
import NProgress from 'nprogress' // 引入进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/404'] // 定义白名单 所有不受权限控制的页面
// 路由的前置守卫
// next是前置守卫必须执行的钩子，如果不执行页面就死了
// next()放过
// next(false)跳转终止
// next(地址) 跳转到某个地址
router.beforeEach(async(to, from, next) => {
  NProgress.start() // 开启进度条
  // 首先判断有无token
  if (store.getters.token) {
    // 如果有token，继续判断是不是去登录页
    if (to.path === '/login') {
        // 表示去的是登录页
        next('/') // 跳到主页 有token不用处理
    } else {
      // 只有放行的时候才去获取用户资料
      // 如果当前的vuex中有用户的资料的id，表示已经有资料了，不需要获取了，如果没有id才需要获取
      if (!store.getters.userId) {
        // 如果没有id才表示当前用户资料没有获取过
        await store.dispatch('user/getUserInfo')
        // 如果后续需要根据用户资料获取数据的话 必须改成await同步
      }
        next() //直接放行
    }
  } else {
    // 如果没有token
    if (whiteList.indexOf(to.path) > -1) {
        // 如果找到了 表示在白名单里
        next()
    } else {
        next('/login') // 跳到登录页
    }
  }
  NProgress.done() // 手动强制关闭一次 为了解决手动切换地址时，进度条的不关闭的问题
})
// 后置守卫
router.afterEach(function(){
    NProgress.done() // 关闭进度条
})
