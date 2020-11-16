/**
 * 基于axios的请求模块
 */

import axios from 'axios'
import JSONbigint from 'json-bigint'
import router from '@/router'
import { Message } from 'element-ui'

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

request.interceptors.response.use(function (response) {
  // 所有响应码为2xx的响应
  // response 响应数据

  return response
}, function (err) {
  const status = err.reponse.status
  // 任何不是2xx的响应码
  if (status === 401) {
    window.localStorage.removeItem('user')
    router.push('/login')
    Message.error('登录状态无效')
  } else if (status === 400) {
    // 参数错误
    Message.warning('请求参数错误')
  } else if (status === 403) {
    // 没有权限
    Message.warning('没有操作权限')
  } else if (status >= 500) {
    // 服务端错误
    Message.error('服务端内部异常，请稍后重试')
  }
  return Promise.reject(err)
})

export default request
