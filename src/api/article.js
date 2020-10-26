/**
 * 文章请求模块
 */

import request from '@/utils/request'

export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/articles',
    // body => data
    // query => params
    params
  })
}

export const getArticleChannels = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/channels'
  })
}

export const deleteArticle = articleId => {
  return request({
    method: 'DELETE',
    // 路径参数 :target => articleId
    url: `/mp/v1_0/articles/${articleId}`
  })
}
