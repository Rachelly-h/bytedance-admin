<template>
  <el-menu
   default-active="/"
   router
   class="nav-menu"
   :collapse="isCollapse"
  >
    <h1>{{ isCollapse == true ? 'R' : 'Rachey' }}</h1>
    <el-menu-item index="/">
      <i class="el-icon-s-home"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-menu-item index="/article">
      <i class="el-icon-menu"></i>
      <span slot="title">内容管理</span>
    </el-menu-item>
    <el-menu-item index="/image">
      <i class="iconfont iconimage"></i>
      <span slot="title">素材管理</span>
    </el-menu-item>
    <el-menu-item index="/publish">
      <i class="iconfont iconpublish"></i>
      <span slot="title">发布文章</span>
    </el-menu-item>
    <el-menu-item index="/comment">
      <i class="iconfont iconCommentquantity"></i>
      <span slot="title">评论管理</span>
    </el-menu-item>
    <el-menu-item index="/fans">
      <i class="el-icon-setting"></i>
      <span slot="title">粉丝管理</span>
    </el-menu-item>
    <el-menu-item index="/settings">
      <i class="el-icon-setting"></i>
      <span slot="title">个人设置</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'AppAside',
  data: () => ({
    // isCollapse: false
  }),
  props: {
    isCollapse: {
      type: Boolean
    }
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
  h1 {
    text-align: center;
  }

  .nav-menu {
    .iconfont {
      margin-right: 10px;
      padding-left: 4px;
    }
  }
</style>
