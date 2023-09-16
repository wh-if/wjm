<template>
  <div v-if="loading" v-loading.fullscreen.lock="loading"></div>
  <div v-else class="stat-box">
    <ElCard class="stat-sidebar" body-style="padding:0">
      <ElMenu :default-active="$route.path" router>
        <ElMenuItem class="stat-sidebar-menuitem" index="/mine" route="/mine">
          <ElIcon><ArrowLeftBold /></ElIcon>
          <span>返回</span>
        </ElMenuItem>
        <ElMenuItem
          class="stat-sidebar-menuitem"
          index="/stat/overview"
          :route="{
            path: `/stat/overview`,
            replace: true,
            query: {
              surveyId: $route.query.surveyId
            }
          }"
        >
          <ElIcon><Location /></ElIcon>
          <span>数据概览</span>
        </ElMenuItem>
        <ElMenuItem
          class="stat-sidebar-menuitem"
          index="/stat/detail"
          :route="{
            path: `/stat/detail`,
            replace: true,
            query: {
              surveyId: $route.query.surveyId
            }
          }"
        >
          <ElIcon><Location /></ElIcon>
          <span>数据详情</span>
        </ElMenuItem>
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
import { ArrowLeftBold, Location } from "@element-plus/icons-vue";
import {
  ElStatistic,
  ElCol,
  ElRow,
  ElCard,
  ElMenu,
  ElMenuItem,
  ElIcon
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

  const promise2 = getAnswerList(parseInt(surveyId), { status: 0 }).then(
    ({ data }) => {
      statRawData.answerList = reactive(data.list);
    }
  );

  Promise.all([promise1, promise2]).then(() => {
    loading.value = false;
  });
}

getData();
provide("statRawData", statRawData);
provide("updateStatRawData", getData);
</script>

<style lang="scss" scoped>
.stat-box {
  padding: 20px 0;

  .stat-sidebar {
    position: fixed;
    top: 80px;
    bottom: 20px;
    left: 20px;
    &-menuitem {
      display: flex;
      flex-direction: column;
      margin-top: 20px;
      i {
        flex: 1;
      }
      span {
        // height: fit-content;
        padding-bottom: 5px;
        line-height: normal;
      }
    }
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
