/**
 * 基于axios的请求模块
 */

import axios from 'axios'

// 创建的axios实例
const request = axios.create({
  // 请求的基础路径
  baseURL: 'http://ttapi.research.itcast.cn/'
})

request.interceptors.request.use(config => {
  const user = JSON.parse(window.localStorage.getItem('user'))

  // 如果有用户登录信息
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // config 是当前请求相关的配置信息对象，
  // return config，请求才会发出去，如果不return，则请求无法发送报错
  return config
}, error => {
  return Promise.reject(error)
})

// axios({
//   method: '',
//   url: ''
// })

export default request
