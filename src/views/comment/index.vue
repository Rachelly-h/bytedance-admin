<template>
  <div class='comment-container'>
    <el-card class="box-card">
      <div class="clearfix" slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to='/'>首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-table
        class="table-list"
        stripe
        :data="articles"
      >
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="total_comment_count" label="总评论数"></el-table-column>
        <el-table-column prop="fans_comment_count" label="粉丝评论数"></el-table-column>
        <el-table-column label="评论状态">
          <template slot-scope="scope">
            {{ scope.row.comment_status ? '正常' :  '关闭'}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.comment_status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="onStatusChange(scope.row)"
              :disabled="scope.row.statusDisabled"
            ></el-switch>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page.sync="page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getArticles, updateCommentStatus } from '@/api/article'

export default {
  name: 'CommentIndex',
  data: () => ({
    articles: [],
    totalCount: 0,
    pageSize: 10,
    page: 1
  }),
  created () {
    this.loadArticles()
  },
  methods: {
    handleCurrentChange (page) {
      this.loadArticles(page)
    },
    handleSizeChange () {
      this.loadArticles(1)
    },
    loadArticles (page = 1) {
      // 让分页组件激活的页码和请求数据的页码保持一致
      this.page = page

      getArticles({
        response_type: 'comment',
        page,
        per_page: this.pageSize
      }).then(res => {
        const { results } = res.data.data
        results.forEach(element => {
          element.statusDisabled = false
        })
        this.articles = results
        this.totalCount = res.data.data.total_count
      })
    },
    onStatusChange (article) {
      article.statusDisabled = true
      updateCommentStatus(article.id.toString(), article.comment_status).then(res => {
        article.statusDisabled = false
      })
      this.$message({
        type: 'success',
        message: article.comment_status ? '开启成功' : '关闭成功'
      })
    }
  }
}
</script>

<style lang="less" scoped>
 .table-list {
   width: 100%;
   margin-bottom: 30px;
 }
</style>
