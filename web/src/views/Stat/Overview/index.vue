<template>
  <div class="overview-box">
    <ElCard>
      <div ref="chartRef" class="overview-line"></div>
    </ElCard>
    <ElCard class="overview-questions" shadow="never">
      <RadioStat
        v-for="(item, index) in statFormattedData"
        :key="item.questionId"
        :stat-data="item"
        :list-index="index"
      ></RadioStat>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
import { ElCard } from "element-plus";

import * as echarts from "echarts";
import { computed, inject, onMounted, ref, shallowRef, toRaw } from "vue";
import RadioStat from "./components/RadioStat.vue";
import type { SurveyWithQuestions } from "@/api/survey";
import type { Answer } from "@/api/answer";

const chartRef = ref();

const statRawData = inject<{
  survey: SurveyWithQuestions;
  answerList: Answer[];
}>("statRawData");

const statFormattedData = shallowRef<any[]>([]);

function initFormattedData() {
  const result: any[] = [];
  statRawData?.survey.questions?.forEach((questionItem) => {
    const resultList: any[] = [];
    // 选择题
    if (questionItem.type === "radio") {
      // 筛选出该问题的所有答卷
      statRawData.answerList.forEach((answerItem) => {
        answerItem.content?.find((answerQuestionItem) => {
          if (answerQuestionItem == null) {
            return false;
          }
          if (answerQuestionItem.questionId == questionItem.id) {
            resultList.push(answerQuestionItem.resultValue);
            return true;
          } else {
            return false;
          }
        });
      });
      // 统计各选项数据
      const resultOptions: any[] = [];
      questionItem.content.options.forEach((optionItem: any) => {
        // 选该选项的个数
        optionItem.count = 0;

        resultList.forEach((item) => {
          if (item == optionItem.id) {
            optionItem.count++;
          }
        });
        // 选项选择率
        optionItem.rate = parseFloat(
          (optionItem.count / resultList.length).toFixed(2)
        );
        if (isNaN(optionItem.rate)) optionItem.rate = 0;
        resultOptions.push(toRaw(optionItem));
      });
      // 填写率
      let answerRate: number | string =
        (resultList.length * 100) / statRawData.answerList.length;
      if (isNaN(answerRate)) {
        answerRate = 0;
      } else {
        answerRate = answerRate.toFixed(2);
      }
      result.push({
        // 题目ID
        questionId: questionItem.id,
        // 题目标题
        questionTitle: questionItem.title,
        // 答卷数据列表
        answerResultList: resultList,
        // 填写率
        answerRate,
        // 各选项数据
        options: resultOptions
      });
    } else {
      // 其它题目类型
    }
  });
  console.log(result);
  statFormattedData.value = result;
}

initFormattedData();

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
        areaStyle: {}
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
