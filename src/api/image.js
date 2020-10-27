/**
 * 素材请求模块
 */

import request from '@/utils/request'

export const uploadImage = data => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/user/images',
    // 一般文件上传的接口都要把请求头中的 Content-Type 设置为 multipart/form-data，
    // 但是使用axios上传文件的话不需要手动设置，只需要data是FormData对象即可
    data
  })
}

export const getImages = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/images',
    params
  })
}
