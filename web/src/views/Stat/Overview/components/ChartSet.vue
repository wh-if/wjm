<template>
  <div class="chartset">
    <div class="chartset-header">
      <ElButtonGroup>
        <ElButton>饼图</ElButton>
        <ElButton> 折线图 </ElButton>
        <ElButton> 柱状图 </ElButton>
      </ElButtonGroup>
    </div>
    <div ref="chartContainerRef" class="chartset-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ElButton, ElButtonGroup } from "element-plus";
import { onMounted, ref } from "vue";
import * as echarts from "echarts";

const chartContainerRef = ref();

function initLineChart() {
  // 基于准备好的dom，初始化echarts实例
  const lineChart = echarts.init(chartContainerRef.value);
  // 绘制图表
  lineChart.setOption({
    // title: {
    //   text: "ECharts 入门示例"
    // },
    tooltip: {},
    xAxis: {
      data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
    },
    yAxis: {},
    series: [
      {
        name: "销量",
        type: "bar",
        data: [5, 20, 36, 10, 10, 20]
      }
    ]
  });
}

onMounted(() => {
  initLineChart();
});
</script>

<style lang="scss" scoped>
.chartset {
  padding: 15px 0;
  .chartset-header {
    padding-bottom: 15px;
  }
  .chartset-container {
    width: 100%;
    height: 360px;
    border: 1px solid #e1e7f2;
  }
}
</style>
