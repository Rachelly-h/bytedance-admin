<template>
  <div class='settings-container'>
    <el-card class="box-card">
      <div class="clearfix" slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to='/'>首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-row>
        <el-col :span="15">
          <el-form label-width="80px" :model="user">
            <el-form-item label="编号">
              {{ user.id }}
            </el-form-item>
            <el-form-item label="手机">
              {{ user.mobile }}
            </el-form-item>
            <el-form-item label="媒体名称">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
               type="primary"
               @click="onUpdateUser"
               :loading="updateProfileLoading"
              >保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4" :offset="2">
          <label for="file">
            <el-avatar
              shape="square"
              :size="180"
              fit="cover"
              :src="user.photo"
            ></el-avatar>
          </label>
          <input id="file" type="file" hidden ref="file" @change="onChangeFile">
        </el-col>
      </el-row>
    </el-card>

    <el-dialog
      title="修改头像"
      :visible.sync="dialogVisible"
      append-to-body
      @opened="onDialogOpened"
      @closed="onDialogClosed"
    >
      <div class="preview-image-wrap">
        <img
          class="preview-image"
          :src="previewImage"
          alt=""
          ref="preview-image"
        >
      </div>
      <span class="dialog-footer" slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          @click="onUpdatePhoto"
          type="primary"
          :loading="updatePhotoLoading"
        >确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserProfile, updateUserPhoto, updateUserProfile } from '@/api/user'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

export default {
  name: 'SettingsIndex',
  data: () => ({
    user: {
      email: '',
      id: null,
      intro: '',
      mobile: '',
      name: '',
      photo: ''
    },
    dialogVisible: false,
    previewImage: '',
    cropper: null,
    updatePhotoLoading: false,
    updateProfileLoading: false
  }),
  created () {
    this.loadUser()
  },
  methods: {
    loadUser () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },
    onChangeFile () {
      const file = this.$refs.file

      const blobData = window.URL.createObjectURL(file.files[0])
      this.previewImage = blobData

      this.dialogVisible = true
      // 解决选择相同文件不触发change事件问题
      this.$refs.file.value = ''
    },
    onDialogOpened () {
      const image = this.$refs['preview-image']
      // 二次预览裁剪图片不会更新，裁剪的还是第一次预览的图片
      this.cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: 'none',
        background: false,
        cropBoxResizable: false
      })
    },
    onDialogClosed () {
      // 销毁裁剪器，防止二次预览不更新
      this.cropper.destroy()
    },
    onUpdatePhoto () {
      this.updatePhotoLoading = true
      this.cropper.getCroppedCanvas().toBlob(file => {
        const formdata = new FormData()
        formdata.append('photo', file)

        updateUserPhoto(formdata).then(res => {
          this.dialogVisible = false

          this.user.photo = window.URL.createObjectURL(file)

          this.updatePhotoLoading = false

          this.$message({
            type: 'success',
            message: '更新头像成功'
          })
        })
      })
    },
    onUpdateUser () {
      this.updateProfileLoading = true
      const { name, intro, email } = this.user
      updateUserProfile({ name, intro, email }).then(res => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.updateProfileLoading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .preview-image-wrap {
    .preview-image {
      display: block;
      max-width: 100%;
      height: 200px;
    }
  }
</style>
