<template>
  <div class="image-list">
    <div class="action-header">
      <el-radio-group v-model="collect" @change="loadImages()">
        <el-radio-button :label="false">全部</el-radio-button>
        <el-radio-button :label="true">收藏</el-radio-button>
      </el-radio-group>
      <el-button type="primary" @click="dialogUploadVisible = true" v-if="isShowAdd"
        >上传素材</el-button
      >
    </div>
    <el-row :gutter="20">
      <el-col
        :xs="12"
        :sm="6"
        :md="6"
        :lg="4"
        v-for="(image, index) in images"
        :key="index"
        class="image-item"
        @click.native="selected = index"
      >
        <el-image
          style="height: 100px"
          :src="image.url"
          fit="cover"
        ></el-image>
        <div
         class="selected"
         v-if="isSelect && selected === index"
        ></div>
        <div class="image-action" v-if="isShowAction">
          <i
            :class="{
              'el-icon-star-on': image.is_collected,
              'el-icon-star-off': !image.is_collected,
            }"
            @click="onCollect(image)"
          ></i>
          <i class="el-icon-delete" @click="onDelete(image)"></i>
        </div>
      </el-col>
    </el-row>
    <!--
        :current-page.sync="page"
        添加page数据，解决'全部'和'收藏'切换时，elementUI的分页高亮不改变问题
      -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalCount"
      :current-page.sync="page"
      @current-change="onPageChange"
    ></el-pagination>
    <el-dialog
      title="上传素材"
      :visible.sync="dialogUploadVisible"
      append-to-body
    >
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
import { getImages, collectImage, deleteImage } from '@/api/image'

export default {
  name: 'ImageList',
  props: {
    // 是否显示添加素材按钮
    isShowAdd: {
      type: Boolean,
      default: true
    },
    // 是否显示图片下方操作（删除和收藏）
    isShowAction: {
      type: Boolean,
      default: true
    },
    isSelect: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    collect: false,
    images: [],
    dialogUploadVisible: false,
    totalCount: 0,
    page: 1,
    selected: null // 选中素材
  }),
  created () {
    this.loadImages()
  },
  methods: {
    loadImages (page = 1) {
      this.page = page
      getImages({
        collect: this.collect,
        page,
        per_page: 12
      }).then((res) => {
        this.images = res.data.data.results
        this.totalCount = res.data.data.total_count
      })
    },
    onUploadSuccess () {
      this.dialogUploadVisible = false
      this.loadImages(this.page)
      this.$message({
        type: 'success',
        message: '上传成功'
      })
    },
    onPageChange (page) {
      this.loadImages(page)
    },
    onCollect (image) {
      collectImage(image.id, !image.is_collected).then((res) => {
        image.is_collected = !image.is_collected
      })
    },
    onDelete (image) {
      deleteImage(image.id).then((res) => {
        this.loadImages(this.page)
      })
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

.image-item {
  position: relative;
}
.image-action {
  height: 40px;
  background-color: rgba(204, 204, 204, 0.5);
  position: absolute;
  bottom: 4px;
  left: 10px;
  right: 10px;
  font-size: 25px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  color: #fff;
}
.selected {
  background: url(./selected.png) no-repeat;
  background-size: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;

}
</style>
