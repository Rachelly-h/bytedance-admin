<template>
  <div class='article-container'>
    <el-card class="filter-card">
      <div class="clearfix" slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to='/'>首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form label-width="80px" size="mini">
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelId" placeholder="请选择频道">
            <el-option label="全部" :value="null"></el-option>
            <el-option
             :label="channel.name"
             :value="channel.id"
             v-for="(channel, index) in channels"
             :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="rangeDate"
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <!-- button 按钮的click事件有个默认参数，没有指定参数的时候，会默认传递一个没用的数据{"isTrusted": true} -->
          <el-button type="primary" :disabled="loading" @click="loadArticles(1)">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div class="clearfix" slot="header">
        根据筛选条件共查询到{{ totalCount }}条结果：
      </div>
      <el-table
       :data="articles"
       style="width: 100%"
       class="list-table"
       size="small"
       v-loading="loading"
      >
        <el-table-column prop="date" label="封面">
          <template slot-scope="scope">
            <el-image
              class="article-cover"
              :src="scope.row.cover.images[0]"
              fit="cover"
              lazy
            >
              <div class="image-slot" slot="placeholder">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
            <!-- <img
              :src="scope.row.cover.images[0]"
              class="article-cover"
              v-if="scope.row.cover.images[0]"
            >
            <img src="./no-cover.jpg" v-else class="article-cover"> -->
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column label="状态">
          <!-- slot-scope="scope" 获取当前遍历项的数据 -->
          <template slot-scope="scope">
            <el-tag :type="articleStatus[scope.row.status].type">{{ articleStatus[scope.row.status].text }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
             size="mini"
             circle
             icon="el-icon-edit"
            ></el-button>
            <el-button
             size="mini"
             circle
             type="danger"
             icon="el-icon-delete"
             @click="onDeleteArticle(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        :page-size="pageSize"
        :disabled="loading"
        :current-page.sync="page"
        @current-change="onCurrentChange"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getArticles, getArticleChannels, deleteArticle } from '@/api/article'

export default {
  name: 'ArticleIndex',
  data: () => ({
    articles: [],
    articleStatus: [
      { status: 0, text: '草稿', type: 'warning' },
      { status: 1, text: '待审核', type: '' },
      { status: 2, text: '审核通过', type: 'success' },
      { status: 3, text: '审核失败', type: 'danger' },
      { status: 4, text: '已删除', type: 'info' }
    ],
    totalCount: 0,
    pageSize: 10,
    status: null,
    channels: [],
    channelId: null,
    rangeDate: [],
    loading: true,
    page: 1
  }),
  created () {
    this.loadArticles()
    this.loadChannels()
  },
  methods: {
    onSubmit () {

    },
    loadArticles (page = 1) {
      this.loading = true
      getArticles({
        page,
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null,
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null
      }).then(res => {
        const { results, total_count: totalCount } = res.data.data
        this.articles = results
        this.totalCount = totalCount

        this.loading = false
      })
    },
    onCurrentChange (page) {
      this.loadArticles(page)
    },
    loadChannels () {
      getArticleChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },
    onDeleteArticle (articleId) {
      this.$confirm('确认删除吗？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteArticle(articleId.toString()).then(res => {
          this.loadArticles(this.page)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .filter-card {
    margin-bottom: 30px;
  }
  .list-table {
    margin-bottom: 20px;
  }
  .article-cover {
    width: 100px;
    height: 100px;
  }
</style>
