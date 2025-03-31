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
import { ElCard, dayjs } from "element-plus";

import * as echarts from "echarts";
import { inject, onMounted, ref, shallowRef } from "vue";
import StatRender from "./components/StatRender.vue";
import type { SurveyWithQuestions } from "@/api/survey";
import type { Answer } from "@/api/answer";
import { formatStatData, type FormatStatResult } from "@/utils/formatStatData";
import { useDark } from "@/hooks/useDark";

const chartRef = ref();

const statRawData = inject<{
  survey: SurveyWithQuestions;
  answerList: Answer[];
}>("statRawData", { survey: {}, answerList: [] });

const statFormattedData = shallowRef<FormatStatResult[]>([]);

statFormattedData.value = formatStatData(statRawData!);

const { darkState } = useDark();

function initChart() {
  // 基于准备好的dom，初始化echarts实例
  const chart = echarts.init(
    chartRef.value,
    darkState.value ? "dark" : "light"
  );

  const resultData: [string, number][] = [];

  const sortedAnswerList = statRawData?.answerList.sort(
    (a, b) => parseInt(a.submitTime!) - parseInt(b.submitTime!)
  );

  if (sortedAnswerList.length > 0) {
    const getHourFn = (time: string) => {
      if (time === undefined) {
        return undefined;
      }
      return new Date(parseInt(time)).toLocaleString().split(":")[0];
    };

    let baseHour = getHourFn(sortedAnswerList[0].submitTime!);

    let count = 0;
    for (let i = 0; i < sortedAnswerList.length + 1; ) {
      const item = sortedAnswerList[i];
      const itemHour = getHourFn(item?.submitTime!);
      if (itemHour === baseHour) {
        resultData.splice(resultData.length - 1, 1, [itemHour + "时", ++count]);
        i++;
      } else {
        count = 0;
        baseHour = getHourFn(
          dayjs(baseHour + ":00")
            .add(1, "hour")
            .unix() + "000"
        );
        resultData.push([baseHour + "时", count]);
        if (!item) {
          break;
        }
      }
    }
  }

  // 绘制图表
  chart.setOption({
    title: {
      text: "回收趋势"
    },
    tooltip: {
      trigger: "axis",
      position: function (pt: any) {
        return [pt[0], "10%"];
      }
    },
    toolbox: {
      feature: {
        // dataZoom: {
        // yAxisIndex: "none"
        // },
        // restore: {},
        saveAsImage: {}
      }
    },
    xAxis: {
      type: "category",
      boundaryGap: false
    },
    yAxis: {
      type: "value",
      boundaryGap: [0, "100%"]
    },
    dataZoom: [
      {
        type: "inside",
        start: 0,
        end: 100
      },
      {
        start: 0,
        end: 20
      }
    ],
    series: [
      {
        name: "回收量",
        type: "line",
        smooth: true,
        symbol: "none",
        data: resultData,
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
