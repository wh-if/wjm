<template>
  <div v-loading.fullscreen.lock="loading">
    <template v-if="!loading">
      <TopNav class="top-nav"></TopNav>
      
      <div class="main-box">
        <LeftMenuCard class="left"></LeftMenuCard>
        <EditContent class="content"></EditContent>
        <RightSettingCard class="right"></RightSettingCard>
      </div>
    </template>
    
  </div>
</template>

<script setup lang="ts">
import TopNav from "./components/TopNav.vue";
import LeftMenuCard from "./components/LeftMenuCard.vue";
import RightSettingCard from "./components/RightSettingCard.vue";
import EditContent from "./components/EditContent.vue";

import { ref, provide, reactive } from "vue";
import { useRouter } from "vue-router";
import { getSurveyWithQuestions, type SurveyWithQuestions } from "@/api/survey";

const state = ref<SurveyWithQuestions>();
const loading = ref(true);
const router = useRouter();
const surveyId = router.currentRoute.value.query.surveyId as string;
const activeQuestionIndex = ref<number>();

getSurveyWithQuestions(surveyId).then(({ data }) => {
  state.value = reactive(data);
  loading.value = false;
});

provide("surveyData", state);
provide("activeQuestionIndex", activeQuestionIndex);
</script>

<style lang="scss" scoped>
.top-nav {
  position: fixed;
  top: 60px;
  width: 100%;
  height: 48px;
  // background-color: #7ed3f1;
}

.main-box {
  margin-top: 60px;

  .left {
    width: 230px;
    position: fixed;
    top: 120px;
    left: 10px;
    height: calc(100vh - 140px);
  }

  .content {
    margin: 0 250px 20px;
    // height: 1500px;
  }

  .right {
    position: fixed;
    top: 120px;
    right: 10px;
    width: 230px;
    height: calc(100vh - 140px);
  }
}
</style>
