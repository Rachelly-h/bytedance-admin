/**
 * 基于axios的请求模块
 */

import axios from 'axios'

// 创建的axios实例
const request = axios.create({
  // 请求的基础路径
  baseURL: 'http://ttapi.research.itcast.cn/'
})

// axios({
//   method: '',
//   url: ''
// })

export default request
