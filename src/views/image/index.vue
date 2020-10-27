<template>
  <div class='image-container'>
    <el-card class="box-card">
      <div class="clearfix" slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to='/'>首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="action-header">
        <el-radio-group v-model="collect" @change="loadImages">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button type="primary" @click="dialogUploadVisible= true">上传素材</el-button>
      </div>
      <el-row :gutter="20">
        <el-col
         :xs="12"
         :sm="6"
         :md="6"
         :lg="4"
         v-for="(image, index) in images"
         :key="index"
        >
          <el-image
           style="height: 100px"
           :src="image.url"
           fit="cover"
          ></el-image>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog title="上传素材" :visible.sync="dialogUploadVisible" append-to-body>
      <el-upload
       class="upload-demo"
       drag
       action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
       :headers="uploadHeaders"
       name="image"
       multiple
       :on-success="onUploadSuccess"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖拽至此出，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getImages } from '@/api/image'

export default {
  name: 'ImageIndex',
  data: () => ({
    collect: false,
    images: [],
    dialogUploadVisible: false
  }),
  created () {
    this.loadImages()
  },
  methods: {
    loadImages (collect = false) {
      getImages({
        collect
      }).then(res => {
        this.images = res.data.data.results
      })
    },
    onUploadSuccess () {
      this.dialogUploadVisible = false
      this.loadImages(false)
    }
  },
  computed: {
    uploadHeaders: function () {
      const user = JSON.parse(window.localStorage.getItem('user'))
      return {
        Authorization: `Bearer ${user.token}`
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .action-header {
    padding-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }
</style>
