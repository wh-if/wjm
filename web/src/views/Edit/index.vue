<template>
  <div>
    <TopNav class="top-nav"></TopNav>
    <div class="main-box">
      <LeftMenuCard class="left"></LeftMenuCard>
      <div class="content">
        <SurveyContent ref="surveyContentRef" type="Edit"></SurveyContent>
      </div>
      <RightSettingCard class="right"></RightSettingCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import TopNav from "./components/TopNav.vue";
import LeftMenuCard from "./components/LeftMenuCard.vue";
import RightSettingCard from "./components/RightSettingCard.vue";
import SurveyContent from "@/components/SurveyContent.vue";

import { ref, provide } from "vue";

const surveyContentRef = ref();

provide("surveyContentRef", surveyContentRef);
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
    padding: 100px 0 0;
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
