<template>
  <div class="nav-main">
    <ElPageHeader class="nav-left" title="返回" @back="$router.back()">
      <template #content>
        <span> 编辑问卷 </span>
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
import { ElButton, ElDialog, ElPageHeader } from "element-plus";
import SharePane from "@/components/SharePane.vue";
import { computed, inject, ref, type Ref } from "vue";
import { type SurveyWithQuestions } from "@/api/survey";
const showShareDialog = ref(false);
const surveyContentRef = inject<Ref>("surveyContentRef");
const surveyData = computed(() => {
  if (surveyContentRef?.value?.surveyState) {
    return surveyContentRef.value.surveyState.data as SurveyWithQuestions;
  } else {
    return {} as SurveyWithQuestions;
  }
});
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
