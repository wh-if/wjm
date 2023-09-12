<template>
  <div class="overview-box">
    <ElCard>
      <div ref="lineRef" class="overview-line"></div>
    </ElCard>
    <ElCard style="margin-top: 25px;padding: 0 80px;" shadow="never">
      <RadioStat></RadioStat>
    </ElCard>
    
  </div>
</template>

<script setup lang="ts">
import { ElCard, ElProgress } from "element-plus";

import * as echarts from "echarts";
import { onMounted, ref } from "vue";
import RadioStat from "./components/RadioStat.vue";

const lineRef = ref();
function initLineChart() {
  // 基于准备好的dom，初始化echarts实例
  const lineChart = echarts.init(lineRef.value);
  // 绘制图表
  lineChart.setOption({
    title: {
      text: "ECharts 入门示例"
    },
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
.el-col {
  text-align: center;
}

.overview-line {
  width: 100%;
  height: 500px;
}


</style>
