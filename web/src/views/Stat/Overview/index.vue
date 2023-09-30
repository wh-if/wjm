<template>
  <div class="overview-box">
    <ElCard>
      <div ref="chartRef" class="overview-line"></div>
    </ElCard>
    <ElCard class="overview-questions" shadow="never">
      <StatRender
        v-for="(item, index) in statFormattedData"
        :key="item.questionRaw.id"
        :stat-data="item"
        :list-index="index"
        :type="item.questionRaw.type!"
      ></StatRender>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
import { ElCard } from "element-plus";

import * as echarts from "echarts";
import { inject, onMounted, ref, shallowRef } from "vue";
import StatRender from "./components/StatRender.vue";
import type { SurveyWithQuestions } from "@/api/survey";
import type { Answer } from "@/api/answer";
import { formatStatData, type FormatStatResult } from "@/utils/formatStatData";

const chartRef = ref();

const statRawData = inject<{
  survey: SurveyWithQuestions;
  answerList: Answer[];
}>("statRawData");

const statFormattedData = shallowRef<FormatStatResult[]>([]);

statFormattedData.value = formatStatData(statRawData!);

function initChart() {
  // 基于准备好的dom，初始化echarts实例
  const chart = echarts.init(chartRef.value);

  // 回收趋势
  let computedData: Record<string, number> = {};

  for (let countTimes = 0, index = 1; countTimes < 10; index++) {
    let countIndex = statRawData!.answerList.length - index;
    if (countIndex < 0) {
      break;
    } else {
      const element = statRawData!.answerList[countIndex];
      const dateObj = new Date(parseInt(element.submitTime as string));
      const keyFlag =
        dateObj.toLocaleDateString() + " " + dateObj.getHours() + ":00";

      if (computedData[keyFlag] === undefined) {
        computedData[keyFlag] = 1;
        countTimes++;
      } else {
        computedData[keyFlag]++;
      }
    }
  }

  // 绘制图表
  chart.setOption({
    title: {
      text: "回收趋势"
    },
    tooltip: {},
    xAxis: {
      data: Reflect.ownKeys(computedData).reverse()
    },
    yAxis: {},
    series: [
      {
        type: "line",
        data: Object.values(computedData),
        smooth: true,
        lineStyle: { color: "#fe9a8b" },
        itemStyle: { color: "#fe9a8b", borderColor: "#fe9a8b" },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#fe9a8bb3" },
            { offset: 1, color: "#fe9a8b03" }
          ])
        }
      }
    ]
  });
}

onMounted(() => {
  initChart();
});
</script>

<style lang="scss" scoped>
.overview-line {
  width: 100%;
  height: 500px;
}

.overview-questions {
  margin-top: 25px;
  padding: 0 80px;
}
</style>
