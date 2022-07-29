// 导出一个axios的实例 而且这个实例要有请求拦截器 响应拦截器
import store from '@/store'
import { config } from '@vue/test-utils'
import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'
import { getTimeStamp } from '@/utils/auth'

// 定义超时时间
const TimeOut = 3600
const service = axios.create({
    // 如果执行 npm run dev  值为 /api 正确  /api 这个代理只是给开发环境配置的代理
  // 如果执行 npm run build 值为 /prod-api  没关系  运维应该在上线的时候 给你配置上 /prod-api的代理
    baseURL: process.env.VUE_APP_BASE_API, // 设置axios请求的基础地址
    timeout: 5000 // 定义5秒超时
}) // 创建一个axios的实例
service.interceptors.request.use(config => {
    // config是请求的配置信息
    // 在这个位置需要统一去注入token
    if (store.getters.token) {
        // 如果token存在 注入token
        // 只有在有token的情况下 才有必要检查时间戳是否超时
        if (IsCheckTimeOut()) {
            // 如果为true表示过期了
            // token没用了 因为超时了
            store.dispatch('user/logout') // 登出操作
            // 跳转到登录页
            router.push('/login')
            return Promise.reject(new Error('token超时了'))
        }
        config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config // 必须返回配置
}, error => {
    return Promise.reject(error)
}) // 请求拦截器
service.interceptors.response.use(response => {
    // axios默认加了一层data
    const { success, message, data } = response.data
    // 要根据success的成功与否决定下面的操作
    if (success) {
        return data
    } else {
        // 业务已经错误，此时应该进catch
        Message.error(message) // 提示错误消息
        return Promise.reject(new Error(message))
    }
}, error => {
    // error信息里面response的对象
    if (error.response && error.response.data && error.response.data.code === 10002) {
        // 当等于10002的时候表示后端告诉我token超时了
        store.dispatch('user/logout') // 登出action 删除token
        router.push('/login')
    } else {
        Message.error(error.message) // 提示错误消息
    }
    return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功，直接进入catch
}) // 响应拦截器
// 是否超时
// 超时逻辑 （当前时间-缓存中的时间）是否大于时间差
function IsCheckTimeOut() {
    var currentTime = Date.now() // 当前时间戳
    var timeStamp = getTimeStamp() // 缓存时间戳
    return (currentTime - timeStamp) / 1000 > TimeOut
}
export default service // 导出axios实例