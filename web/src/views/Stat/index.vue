<template>
  <div v-if="loading" v-loading.fullscreen.lock="loading"></div>
  <div v-else class="stat-box">
    <ElCard class="stat-sidebar" body-style="padding:0">
      <ElMenu :default-active="`/stat/overview?surveyId=${$route.query.surveyId}`" :router="true">
        <ElMenuItem :index="`/stat/overview?surveyId=${$route.query.surveyId}`"
          >数据概览</ElMenuItem
        >
        <ElMenuItem :index="`/stat/detail?surveyId=${$route.query.surveyId}`"
          >数据详情</ElMenuItem
        >
        <!-- <ElMenuItem>统计图表</ElMenuItem>
        <ElMenuItem>交叉分析</ElMenuItem> -->
      </ElMenu>
    </ElCard>
    <div class="stat-main">
      <div class="stat-main-header">
        <h1>{{ statRawData.survey.title }}</h1>
        <ElRow style="flex: 1">
          <ElCol v-for="item in headerInfo" :key="item.title" :span="6">
            <ElStatistic
              :title="item.title"
              :value="item.value"
              :suffix="item.suffix || ''"
              :formatter="item.formatter"
              value-style="font-weight:bold"
            />
          </ElCol>
        </ElRow>
      </div>
      <RouterView></RouterView>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAnswerList, type Answer } from "@/api/answer";
import { getSurveyWithQuestions, type SurveyWithQuestions } from "@/api/survey";
import {
  ElStatistic,
  ElCol,
  ElRow,
  ElCard,
  ElMenu,
  ElMenuItem
} from "element-plus";
import { computed, provide, reactive, ref } from "vue";
import { useRouter } from "vue-router";

const loading = ref(true);

const headerInfo = computed(() => {
  let rate = 0;
  let averageTime = 0;
  if (statRawData.answerList.length && statRawData.survey.viewCount) {
    rate = (statRawData.answerList.length * 100) / statRawData.survey.viewCount;
    averageTime =
      statRawData.answerList.reduce(
        (prev, cur) => prev + new Number(cur.expendDuration).valueOf(),
        0
      ) / statRawData.answerList.length;
  }

  return [
    {
      title: "回收量",
      value: statRawData.answerList.length
    },
    {
      title: "浏览量",
      value: statRawData.survey.viewCount
    },
    {
      title: "回收率",
      value: rate,
      suffix: "%"
    },
    {
      title: "平均完成时间",
      value: averageTime,
      formatter: (val: number) => {
        return `${(val / 60).toFixed(0)}分${(val % 60).toFixed(0)}秒`;
      }
    }
  ];
});
const router = useRouter();

const statRawData = reactive<{
  survey: SurveyWithQuestions;
  answerList: Answer[];
}>({
  survey: {},
  answerList: []
});

function getData() {
  const surveyId = router.currentRoute.value.query.surveyId as string;
  const promise1 = getSurveyWithQuestions(surveyId).then(({ data }) => {
    statRawData.survey = reactive(data);
  });

  const promise2 = getAnswerList(parseInt(surveyId)).then(({ data }) => {
    statRawData.answerList = reactive(data.list);
  });

  Promise.all([promise1, promise2]).then(() => {
    loading.value = false;
  });
}

getData();
provide("statRawData", statRawData);
</script>

<style lang="scss" scoped>
.stat-box {
  padding: 20px 0;

  .stat-sidebar {
    position: fixed;
    top: 80px;
    bottom: 20px;
    left: 20px;
  }
  .stat-main {
    width: 70%;
    margin: 0 auto;
    &-header {
      display: flex;
      padding-bottom: 20px;
      h1 {
        width: 60%;
        font-weight: bold;
      }
    }
  }
}
</style>