<template>
  <div class='fans-container'>
    <div ref="main" class="main"></div>
    <map-chart></map-chart>
  </div>
</template>

<script>
import echarts from 'echarts'
import mapChart from './components/mapChart'

export default {
  name: 'FansIndex',
  data: () => ({

  }),
  components: {
    mapChart
  },
  mounted () {
    const myChart = echarts.init(this.$refs.main)

    const option = {
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: ['2016', '2017', '2018', '2019', '2020']
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [850, 30, 100, 500, 300]
        }
      ]
    }

    myChart.setOption(option)
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
  .main {
    width: 600px;
    height: 400px;
  }
</style>
