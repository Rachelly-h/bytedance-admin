<template>
  <div class='upload-cover' @click="showCoverSelect">
    <div class="cover-wrap">
      <img
       class="cover-image"
       ref="cover-image"
       :src="value"
      >
    </div>
    <el-dialog
     title="选择封面"
     :visible.sync="dialogVisible"
     width="30%"
     append-to-body
    >
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="first"></el-tab-pane>
        <el-tab-pane label="上传图片" name="second">
          <input ref="file" type="file" @change="onFileChange">
          <img ref="preview-image" src="" width="100" alt="">
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button>取消</el-button>
        <el-button type="primary" @click="onCoverConfirm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { uploadImage } from '@/api/image'

export default {
  name: 'UploadCover',
  data: () => ({
    dialogVisible: false,
    activeName: ''
  }),
  props: ['value'],
  methods: {
    showCoverSelect () {
      this.dialogVisible = true
    },
    onFileChange () {
      const file = this.$refs.file.files[0]

      const blob = window.URL.createObjectURL(file)
      this.$refs['preview-image'].src = blob
    },
    onCoverConfirm () {
      if (this.activeName === 'second') {
        const file = this.$refs.file.files[0]
        if (!file) {
          this.$message('请选择文件')
          return
        }
        const formdata = new FormData()
        formdata.append('image', file)

        uploadImage(formdata).then(res => {
          this.dialogVisible = false

          this.$refs['cover-image'].src = res.data.data.url

          // 将服务器返回的图片地址发送到父组件
          // this.$emit('update-cover', res.data.data.url);
          this.$emit('input', res.data.data.url)
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .cover-wrap {
    width: 150px;
    height: 120px;
    border: 1px dotted #000;
    .cover-image {
      height: 120px;
      max-width: 100%;
    }
  }
</style>
