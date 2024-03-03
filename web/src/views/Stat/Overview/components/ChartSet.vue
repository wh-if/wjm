<template>
  <div class="chartset">
    <div class="chartset-header">
      <ElButtonGroup>
        <ElButton
          :type="chartState === 'bar' ? 'primary' : ''"
          @click="handleChange('bar')"
        >
          柱状图
        </ElButton>

        <ElButton
          :type="chartState === 'line' ? 'primary' : ''"
          @click="handleChange('line')"
        >
          折线图
        </ElButton>
        <ElButton
          :type="chartState === 'pie' ? 'primary' : ''"
          @click="handleChange('pie')"
        >
          饼图
        </ElButton>
      </ElButtonGroup>
    </div>
    <div ref="chartContainerRef" class="chartset-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ElButton, ElButtonGroup } from "element-plus";
import { onMounted, ref } from "vue";
import * as echarts from "echarts";
import { useDark } from "@/hooks/useDark";

type ChartType = "bar" | "line" | "pie";

const props = defineProps({
  statData: {
    type: Object,
    required: true
  }
});
const { darkState } = useDark();
const chartContainerRef = ref();

const chartState = ref<ChartType>("bar");

let chart: echarts.ECharts;
function initChart() {
  // 基于准备好的dom，初始化echarts实例
  chart = echarts.init(
    chartContainerRef.value,
    darkState.value ? "dark" : "light"
  );
  // 绘制图表
  handleChange("bar");
}

function handleChange(type: ChartType) {
  chartState.value = type;
  const options: echarts.EChartsOption = {
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      data: props.statData.options.map((item: any) => item.text)
    },
    yAxis: {},
    series: [
      {
        type: type,
        data: props.statData.options.map((item: any) => item.count),
        label: {
          show: true
        }
      }
    ]
  };

  if (type === "pie") {
    options.xAxis = undefined;
    options.yAxis = undefined;
    options.legend = {
      data: props.statData.options.map((item: any) => item.text),
      orient: "vertical",
      top: "center",
      right: 20
    };
    options.series = [
      {
        type: "pie",
        data: props.statData.options.map((item: any) => ({
          name: item.text,
          value: item.count
        }))
      }
    ];
  }
  chart.clear();
  chart.setOption(options);
}

onMounted(() => {
  initChart();
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
    border: 1px solid var(--el-border-color);
  }
}
</style>
