<template>
  <div id="container" class='bmap'>

  </div>
</template>

<script>
export default {
  name: 'BmapTest',
  data: () => ({

  }),
  mounted () {
    // 外部引入的百度地图sdk在全局的BMap要使用window来访问
    const map = new window.BMap.Map('container')

    const point = new window.BMap.Point(116.404, 39.915)
    map.centerAndZoom(point, 8)
  },
  methods: {

  }
}
</script>

<style scoped>
  .bmap {
    widows: 800px;
    height: 600px;
    border: 1px solid black;
  }
</style>
