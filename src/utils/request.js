/**
 * 基于axios的请求模块
 */

import axios from 'axios'
import JSONbigint from 'json-bigint'

// 创建的axios实例
const request = axios.create({
  // 请求的基础路径
  baseURL: 'http://ttapi.research.itcast.cn/',
  // 自定义后端返回的原视数据的处理
  // data就是未经处理返回的数据，即未使用JSON.parse()
  transformResponse: [function (data) {
    // 防止后端返回的数据不是JSON字符串
    try {
      return JSONbigint.parse(data)
    } catch (err) {
      return data
    }
  }]
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
