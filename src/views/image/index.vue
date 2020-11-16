<template>
  <div class="image-container">
    <el-card class="box-card">
      <div class="clearfix" slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <image-list></image-list>
    </el-card>
  </div>
</template>

<script>
import ImageList from './components/image-list'

export default {
  name: 'ImageIndex',
  components: {
    ImageList
  },
  data: () => ({}),
  created () {},
  methods: {}
}
</script>

<style lang="less" scoped>
// .action-header {
//   padding-bottom: 20px;
//   display: flex;
//   justify-content: space-between;
// }

// .image-item {
//   position: relative;
// }
// .image-action {
//   height: 40px;
//   background-color: rgba(204, 204, 204, .5);
//   position: absolute;
//   bottom: 4px;
//   left: 10px;
//   right: 10px;
//   font-size: 25px;
//   display: flex;
//   justify-content:space-evenly;
//   align-items: center;
//   color: #fff;
// }
</style>
