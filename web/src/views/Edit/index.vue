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
import { ElMessageBox, ElNotification } from "element-plus";
import { ref, provide } from "vue";
import { onBeforeRouteLeave } from "vue-router";

const surveyContentRef = ref();

onBeforeRouteLeave(async () => {
  if (!hasSaved.value) {
    try {
      await ElMessageBox.confirm("当前修改暂未保存，确认要离开吗？", {
        type: "warning",
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      });
      return true;
    } catch (e) {
      return false;
    }
  }
  return true;
});

const hasSaved = ref(true);
let timer = 0;
const fnMap = new Map<string, () => Promise<any>>();

function addSaveItem(key: string, fn: () => Promise<any>) {
  fnMap.set(key, fn);
  hasSaved.value = false;
  if (timer) clearTimeout(timer);
  timer = setTimeout(saveAll, 5000);
}
// 全部保存
function saveAll() {
  const promises: Promise<any>[] = [];
  fnMap.forEach((valueFn) => promises.push(valueFn()));
  Promise.all(promises).then(() => {
    clearTimeout(timer);
    fnMap.clear();
    hasSaved.value = true;
    ElNotification.success({
      message: "保存成功！",
      duration: 1500
    });
  });
}
provide("saveTool", {
  addSaveItem,
  saveAll,
  hasSaved
});
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
    width: 300px;
    position: fixed;
    top: 120px;
    left: 10px;
    height: calc(100vh - 140px);
  }

  .content {
    margin: 0 320px 20px;
    // height: 1500px;
    padding: 100px 0 0;
  }

  .right {
    position: fixed;
    top: 120px;
    right: 10px;
    width: 300px;
    height: calc(100vh - 140px);
  }

  @media (max-width: 1280px) {
    .left,
    .right {
      width: 230px;
    }
    .content {
      margin-left: 250px;
      margin-right: 250px;
    }
  }
}
</style>
