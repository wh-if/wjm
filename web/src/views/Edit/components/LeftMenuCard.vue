<template>
  <ElCard class="edit-left-menu-card">
    <ElTabs v-model="currentTab" tab-position="left">
      <ElTabPane :name="0">
        <template #label>
          <div style="padding: 8px 0">
            <ElIcon :size="24">
              <Memo></Memo>
            </ElIcon>
            <p>大纲</p>
          </div>
        </template>
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
      <ElTabPane :name="1">
        <template #label>
          <div style="padding: 8px 0">
            <ElIcon :size="24">
              <Document></Document>
            </ElIcon>
            <p>题型</p>
          </div>
        </template>
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
              class="question-type-button"
              bg
              text
            >
              <img width="18" :src="i!.icon" alt="t" />
              {{ i!.name }}
            </ElButton>
          </div>
        </div>
      </ElTabPane>
      <ElTabPane :name="2">
        <template #label>
          <div style="padding: 8px 0">
            <ElIcon :size="24">
              <Collection></Collection>
            </ElIcon>
            <p>题库</p>
          </div>
        </template>
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
                <div class="collect-list-item">
                  <ElTag effect="light" type="info">
                    {{ QuestionTypeObj[item.type!]!.name }}
                  </ElTag>
                  <ElText style="width: 120px" truncated>
                    {{ item.title }}
                  </ElText>
                </div>
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
  QuestionTypeEnum,
  getDefaultContent,
  QuestionTypeObj
} from "@/constants";
import { surveyContentRefInjectionKey } from "@/constants/injectionKey";
import {
  InfoFilled,
  Memo,
  Collection,
  Document
} from "@element-plus/icons-vue";
import {
  ElCard,
  ElTabs,
  ElTabPane,
  ElButton,
  ElPopconfirm,
  ElText,
  ElRadioButton,
  ElRadioGroup,
  ElMessage,
  ElMessageBox,
  ElTag,
  ElIcon
} from "element-plus";
import { inject, computed, ref, reactive, watch } from "vue";

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

const surveyContentRef = inject(surveyContentRefInjectionKey);
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
  padding: 10px 20px;
  .el-text {
    width: 100%;
  }
}
.question-type-button {
  overflow: hidden;
  margin: 6px 0 0 8px;
  img {
    margin-right: 4px;
    filter: drop-shadow(var(--el-text-color-primary) 50px 0);
    transform: translateX(-50px);
  }
}

.question-group-title {
  height: 40px;
  font-size: 14px;
  line-height: 40px;
  font-weight: 500;
  margin-bottom: 0;
}

.collect-container {
  text-align: center;

  .collect-list {
    margin-top: 15px;
    text-align: center;
    padding: 0 10px;

    &-item {
      display: flex;
      align-items: center;
      border: 1px solid var(--el-border-color);

      border-radius: 6px;
      padding: 6px 8px;
      margin-top: 8px;
      cursor: pointer;
      text-align: left;
    }
    &-item:hover .el-text {
      color: #1f75ff;
    }
  }
}
</style>

<style>
.edit-left-menu-card .el-tabs__item {
  height: auto;
}
</style>
