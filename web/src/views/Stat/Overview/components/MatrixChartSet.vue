<template>
  <div class="matrix-chartset">
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
      <ElSelect
        v-model="selectSeries"
        multiple
        collapse-tags
        placeholder="选择展示系列维度"
        :multiple-limit="4"
        style="width: 240px"
      >
        <ElOption
          v-for="item in props.statData.questionRaw.content.series"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </ElSelect>
    </div>
    <div ref="chartContainerRef" class="chartset-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ElButton, ElButtonGroup, ElOption, ElSelect } from "element-plus";
import { computed, onMounted, ref, watch } from "vue";
import * as echarts from "echarts";
import { useDark } from "@/hooks/useDark";

type ChartType = "bar" | "line" | "pie";

const props = defineProps({
  statData: {
    type: Object,
    required: true
  }
});

const chartContainerRef = ref();
const { darkState } = useDark();

const chartState = ref<ChartType>("bar");

const selectSeries = ref<number[]>(getSelectSeriesDefault());

function getSelectSeriesDefault() {
  const arr = [] as any;
  if (props.statData.questionRaw.content.series[0]) {
    arr.push(props.statData.questionRaw.content.series[0].id);
  }
  if (props.statData.questionRaw.content.series[1]) {
    arr.push(props.statData.questionRaw.content.series[1].id);
  }
  return arr;
}

const computedSeriesStat = computed(() =>
  props.statData.seriesStat.filter((item: any) =>
    selectSeries.value.includes(item.id)
  )
);

watch(computedSeriesStat, () => {
  handleChange(chartState.value);
});

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
      data: props.statData.questionRaw.content.options.map(
        (item: any) => item.text
      )
    },
    yAxis: {},
    series: computedSeriesStat.value.map((seriesItem: any) => {
      return {
        type: type,
        name: seriesItem.name,
        data: seriesItem.options.map((item: any) => item.count),
        label: {
          show: true
        }
      };
    }),
    legend: {
      data: computedSeriesStat.value.map((i: any) => i.name),
      top: "10",
      right: 20
    }
  };

  if (type === "pie") {
    options.xAxis = undefined;
    options.yAxis = undefined;
    options.legend = {
      data: props.statData.questionRaw.content.options.map(
        (item: any) => item.text
      ),
      orient: "vertical",
      top: "center",
      right: 20
    };
    const itemWidth = Math.round(100 / (computedSeriesStat.value.length + 1));
    const itemRadius = `${60 / computedSeriesStat.value.length}%`;

    options.series = computedSeriesStat.value.map(
      (seriesItem: any, index: number) => {
        return {
          type: "pie",
          center: [`${itemWidth * (index + 1)}%`, "50%"],
          radius: itemRadius,
          data: seriesItem.options.map((item: any) => ({
            name: item.text,
            value: item.count
          }))
        };
      }
    );
  }
  chart.clear();
  chart.setOption(options);
}

onMounted(() => {
  initChart();
});
</script>

<style lang="scss" scoped>
.matrix-chartset {
  padding: 15px 0;
  .chartset-header {
    padding-bottom: 15px;
    display: flex;
    justify-content: space-between;
  }
  .chartset-container {
    width: 100%;
    height: 360px;
    border: 1px solid var(--el-border-color);
  }
}
</style>
