import request from '@/utils/request'

// 登录接口
export function login(data) {
    // 返回一个promise对象
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}
// 获取用户的基本资料接口
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}
// 获取用户的基本信息
export function getUserDatailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

export function logout() {
  
}
