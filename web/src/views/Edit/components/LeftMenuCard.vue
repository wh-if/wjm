<template>
  <ElCard class="edit-left-menu-card">
    <ElTabs v-model="currentTab" tab-position="left">
      <ElTabPane label="大纲" :name="0">
        <div class="scroll-box">
          <ElText size="large" style="font-weight: bold" truncated>
            {{ surveyData.title }}
          </ElText>
          <ElText
            v-for="(item, index) in surveyData.questions"
            :key="item.id"
            truncated
          >
            {{ index + 1 + ". " + item.title }}
          </ElText>
        </div>
      </ElTabPane>
      <ElTabPane label="题型" :name="1">
        <div class="scroll-box">
          <div
            v-for="item in QuestionTypeList"
            :key="item.groupTitle"
            style="margin-bottom: 10px"
          >
            <p class="question-group-title">{{ item.groupTitle }}</p>
            <ElButton
              v-for="(i, index) in item.items"
              :key="index"
              @click="addQuestionByType(index)"
              style="margin: 6px 0 0 8px"
              bg
              text
            >
              {{ i!.name }}
            </ElButton>
          </div>
        </div>
      </ElTabPane>
      <ElTabPane label="题库" :name="2">
        <div class="collect-container">
          <ElRadioGroup v-model="collect.isPublic" size="small">
            <ElRadioButton :label="true">公共题库</ElRadioButton>
            <ElRadioButton :label="false">我的收藏</ElRadioButton>
          </ElRadioGroup>
          <div class="collect-list">
            <ElPopconfirm
              confirm-button-text="添加此题"
              v-for="item in collect.list"
              :key="item.id"
              cancel-button-text="取消收藏"
              cancel-button-type="danger"
              :icon="InfoFilled"
              icon-color="#626AEF"
              width="200"
              title="请选择操作类型"
              @confirm="addQuestionByCollect(item)"
              @cancel="handleRemoveCollect(item.id!)"
            >
              <template #reference>
                <ElButton style="margin: 6px 0 0" text>{{
                  item.title
                }}</ElButton>
              </template>
            </ElPopconfirm>
          </div>
        </div>
      </ElTabPane>
    </ElTabs>
  </ElCard>
</template>

<script setup lang="ts">
import { getCollectList, removeCollect } from "@/api/collect";
import { addQuestionToSurvey, type Question } from "@/api/question";
import type { SurveyWithQuestions } from "@/api/survey";
import {
  QuestionTypeList,
  type QuestionTypeEnum,
  getDefaultContent
} from "@/constants";
import { InfoFilled } from "@element-plus/icons-vue";
import {
  ElCard,
  ElTabs,
  ElTabPane,
  ElButton,
  ElPopconfirm,
  ElText,
  ElRadioButton,
  ElMessage,
  ElMessageBox
} from "element-plus";
import { type Ref, inject, computed, ref, reactive, watch } from "vue";

const currentTab = ref<0 | 1 | 2>(1);

const collect = reactive({
  list: [] as Question[],
  isPublic: true
});

watch(
  () => collect.isPublic,
  () => {
    getCollectData();
  }
);

const surveyContentRef = inject<Ref>("surveyContentRef");
const surveyData = computed(() => {
  if (surveyContentRef?.value?.surveyState) {
    return surveyContentRef.value.surveyState.data as SurveyWithQuestions;
  } else {
    return {} as SurveyWithQuestions;
  }
});

function addQuestionByType(type: QuestionTypeEnum) {
  addQuestionToSurvey({
    surveyId: surveyData!.value.id!,
    type,
    content: getDefaultContent(type)
  }).then(() => {
    surveyContentRef?.value.init();
  });
}

function addQuestionByCollect(item: Question) {
  addQuestionToSurvey({
    surveyId: surveyData!.value.id!,
    type: item.type,
    content: item.content,
    required: item.required,
    description: item.description,
    title: item.title
  }).then(() => {
    ElMessage.success("添加成功！");
    surveyContentRef?.value.init();
  });
}

// 取消收藏
function handleRemoveCollect(questionId: number) {
  ElMessageBox.confirm("确定要取消收藏吗？", "取消收藏", {
    cancelButtonText: "取消",
    confirmButtonText: "确定",
    type: "warning"
  })
    .then(() => {
      removeCollect(questionId).then(() => {
        ElMessage.success("取消成功！");
        getCollectData();
      }); 
    })
    .catch(() => {});
}

function getCollectData() {
  getCollectList(collect.isPublic).then(({ data }) => {
    collect.list = data.resultList;
  });
}

getCollectData();
</script>

<style lang="scss">
.edit-left-menu-card {
  z-index: 3;
  .el-card__body {
    height: 100%;
    padding: 20px 0;
  }
  .el-tabs,
  .el-tabs__content,
  .el-tab-pane {
    height: 100%;
  }
}
</style>

<style lang="scss" scoped>
.scroll-box {
  overflow-y: auto;
  height: 100%;
  .el-text {
    width: 100%;
  }
}
.question-group-title {
  height: 40px;
  font-size: 14px;
  line-height: 40px;
  font-weight: 500;
  margin-bottom: 0;

  color: #333;
}

.collect-container {
  .collect-list {
    margin-top: 10px;
    text-align: center;
  }
}
</style>
