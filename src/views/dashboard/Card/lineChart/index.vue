<template>
  <!-- 容器 -->
  <div class="charts" ref="charts"></div>
</template>

<script>
//引入echarts
import * as echarts from "echarts";
export default {
  name: "",
  mounted() {
    //初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts);
    //配置数据
    lineCharts.setOption({
      xAxis: {
        //隐藏轴
        show: false,
        type: "category",
      },
      yAxis: {
        //隐藏轴
        show: false,
      },
      //系列
      series: [
        {
          type: "line",
          smooth: true,
          data: [78, 39, 24, 37, 20, 45, 27, 50, 69,83],
          //拐点样式
          itemStyle: {
            opacity: 0,
          },
          //线条颜色
          lineStyle: {
            color: "purple",
          },
          //填充的颜色
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              // 渐变色
              colorStops: [
                {
                  offset: 0,
                  color: "purple",
                },
                {
                  offset: 1,
                  color: "#fff",
                },
              ],
              global: false,
            },
          },
        },
      ],
      //调整布局
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    });
  },
};
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>