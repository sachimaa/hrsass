import { login } from "@/api/user"
import { getToken, setToken, removeToken } from "@/utils/auth"
// 设置token的共享状态
// 初始化时从缓存中读取状态 并赋值到初始化的状态上
const state = {
  token: getToken() // 设置token初始状态   token持久化 => 放到缓存中
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
  }
}
// 执行异步
const actions = {
  // 经过拦截器的处理后 这里的result实际上就是token
  async login(context, data) {
    const result = await login(data) // 实际上就是一个promise result就是执行的结果
    // axios默认给数据加了一层data
    if (result.data.success) {
      // 表示登录接口调用成功
      // 现有用户token
      // action修改state必须通过mutations
      // 在request中已经默认去除了一层data的外衣
      context.commit('setToken', result)
    }
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}