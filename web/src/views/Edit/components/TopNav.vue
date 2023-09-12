<template>
  <div class="nav-main">
    <!-- <ElSteps simple :active="1" style="width: 620px;background-color: transparent;"> -->
    <!-- <ElStep title="编辑" status="process"></ElStep> -->
    <!-- <ElStep title="设置" status="process"></ElStep> -->
    <!-- <ElStep title="分享" status="finish"></ElStep>
      <ElStep title="统计" status="process"></ElStep>
    </ElSteps> -->
    <ElPageHeader class="nav-left" @back="$router.back()">
      <template #content>
        <span class="text-large font-600 mr-3"> 编辑问卷 </span>
      </template>
    </ElPageHeader>
    <div class="nav-right">
      <ElButton @click="showShareDialog = true" type="primary"
        >分享问卷</ElButton
      >
    </div>
    <ElDialog title="分享问卷" v-model="showShareDialog">
      <SharePane :survey-id="surveyData!.id!"></SharePane>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
import {
  ElSteps,
  ElStep,
  ElButton,
  ElDialog,
  ElPageHeader
} from "element-plus";
import SharePane from "@/components/SharePane.vue";
import { inject, ref } from "vue";
import { type SurveyWithQuestions } from "@/api/survey";
const showShareDialog = ref(false);
const surveyData = inject<SurveyWithQuestions>("surveyData");
</script>

<style lang="scss" scoped>
.nav-main {
  display: flex;
  justify-content: space-between;
  text-align: center;

  background-color: #fff;
  z-index: 99;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.06);

  .nav-left {
    display: flex;
    align-items: center;
    margin-left: 50px;
  }
  .nav-right {
    display: flex;
    align-items: center;
    > * {
      margin: 0 10px;
    }
  }
}
</style>
