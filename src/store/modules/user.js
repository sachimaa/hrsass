import { login, getUserInfo, getUserDatailById } from "@/api/user"
import { getToken, setToken, removeToken, setTimeStamp } from "@/utils/auth"
// 设置token的共享状态
// 初始化时从缓存中读取状态 并赋值到初始化的状态上
const state = {
  token: getToken(), // 设置token初始状态   token持久化 => 放到缓存中
  userInfo: {} // 定义一个空的对象，不是null，因为在getters中会引用userInfo的变量，如果设置为null，则会引起异常和报错
}
// 修改状态
const mutations = {
  // 设置token
  setToken(state, token) {
    state.token = token // 设置token 只是修改state的数据
    // vuex变化=》缓存数据
    setToken(token) // vuex和缓存数据的同步
  },
  // 删除缓存
  removeToken(state) {
    state.token = null // 删除vuex的token
    removeToken() // 先清除vuex再清除缓存vuex和缓存数据的同步
  },
  // 设置用户信息
  setUserInfo(state, result) {
    state.userInfo = { ...result } // 用浅拷贝的方式去赋值对象 因为数据更新后才会触发组件的更新
  },
  // 删除用户信息
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
// 执行异步
const actions = {
  // 经过拦截器的处理后 这里的result实际上就是token
  async login(context, data) {
    const result = await login(data) // 实际上就是一个promise result就是执行的结果
    // axios默认给数据加了一层data
      // 表示登录接口调用成功
      // 现有用户token
      // action修改state必须通过mutations
      // 在request中已经默认去除了一层data的外衣
      context.commit('setToken', result)
      // 写入时间戳
      setTimeStamp() // 将当前的最新时间写入缓存
  },
  // 获取用户资料action
  async getUserInfo (context) {
    const result = await getUserInfo() // result就是用户的基本资料
    const baseInfo = await getUserDatailById(result.userId) // 为了获取头像
    const baseResult = { ...result, ...baseInfo} // 将两个接口结果合并
    // 此时已经获取到了用户的基本资料，为头像再调用一次接口
    context.commit('setUserInfo', baseResult) // 提交mutations
    return baseResult
  },
  // 登出的action
  logout(context) {
    // 删除token
    context.commit('removeToken') // 不仅仅删除vuex中的，还删除了缓存中的
    // 删除用户资料
    context.commit('removeUserInfo') // 删除用户信息
  }

}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}