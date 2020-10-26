<template>
  <div class='publish-container'>
    <el-card class="box-card">
      <div class="clearfix" slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to='/'>首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $route.query.id ? '修改文章' : '发布文章'}}发布文章</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form :model="article" label-width="60px">
        <el-form-item label="标题">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="article.content"></el-input>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select placeholder="请选择频道" v-model="article.channel_id">
            <el-option
             :label="channel.name"
             :value="channel.id"
             v-for="(channel, index) in channels"
             :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">发布</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  getArticleChannels,
  addArticle,
  getArticle,
  updateArticle
} from '@/api/article'

export default {
  name: 'PublishIndex',
  data: () => ({
    article: {
      title: '',
      content: '',
      cover: {
        type: 0,
        images: []
      },
      channel_id: null
    },
    channels: []
  }),
  created () {
    this.loadChannels()

    if (this.$route.query.id) {
      this.loadArticle()
    }
  },
  methods: {
    onPublish (draft = false) {
      const articleId = this.$route.query.id
      if (articleId) {
        // 异步操作
        updateArticle(articleId, this.article, draft).then(res => {
          this.$message({
            message: `${draft ? '修改草稿' : '修改'}成功`,
            type: 'success'
          })
        })
        this.$router.push('/article')
      } else {
        addArticle(this.article, draft).then(res => {
          this.$message({
            message: `${draft ? '存入草稿' : '发布'}成功`,
            type: 'success'
          })
        })
        this.$router.push('/article')
      }
    },
    loadChannels () {
      getArticleChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },
    loadArticle () {
      getArticle(this.$route.query.id).then(res => {
        this.article = res.data.data
      })
    }
  }
}
</script>

<style scoped>

</style>
