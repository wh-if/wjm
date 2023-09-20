<template>
  <div
    v-if="surveyState.loading"
    v-loading.fullscreen.lock="surveyState.loading"
  ></div>
  <div v-else>
    <QuestionCard :tool="false">
      <EditInput
        v-model="surveyState.data.title"
        placeholder="请输入问卷标题"
        :edit="editFlag"
        :text-box-style="{ fontSize: '2.5rem', textAlign: 'center' }"
      >
      </EditInput>
    </QuestionCard>
    <QuestionCard :tool="false">
      <EditInput
        v-model="surveyState.data.description"
        :edit="editFlag"
        placeholder="请输入问卷描述信息"
      >
      </EditInput>
    </QuestionCard>
    <QuestionCard
      v-for="(item, index) in surveyState.data.questions"
      :key="item.id"
      :stared="item.stared"
      @star="handleStar(item.id!, item.stared)"
      @delete="handleDelete(item.id!)"
      @copy="handleCopy(item)"
    >
      <QuestionRender
        :question-data="item"
        :index="index"
        :edit="editFlag"
        :disabled="disabledFlag"
        @focus="(e) => (focusQuestionIndex = e.index)"
        @answer-change="(e) => (answerResult[e.index] = e.data)"
        :answer-data="answerResult[index]"
      ></QuestionRender>
    </QuestionCard>
    <div v-if="props.type === 'Answer'" class="submit-box">
      <ElButton
        @click="handleSubmit"
        type="primary"
        size="large"
        style="width: 200px"
        >提交</ElButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { addAnswer, getAnswerById } from "@/api/answer";
import {
  updateSurvey,
  type SurveyWithQuestions,
  getSurveyWithQuestions
} from "@/api/survey";
import EditInput from "@/components/EditInput.vue";
import QuestionCard from "@/components/QuestionCard.vue";
import { ElButton, ElCard, ElMessage, ElMessageBox } from "element-plus";
import { ref, watch, type PropType, computed, reactive } from "vue";
import { useRouter } from "vue-router";
import QuestionRender, {
  type AnswerData
} from "./questions/QuestionRender.vue";
import { useAutoSave } from "@/hooks/useAutoSave";
import { addCollect, removeCollect } from "@/api/collect";
import {
  removeQuestion,
  type Question,
  addQuestionToSurvey
} from "@/api/question";

type SurveyContentType = "Edit" | "Review" | "Answer";

const props = defineProps({
  type: {
    type: String as PropType<SurveyContentType>,
    default: "Answer"
  }
});
// 聚焦的问题卡片的问题索引
const focusQuestionIndex = ref();

const surveyState = reactive({
  data: {} as SurveyWithQuestions,
  loading: true
});

const editFlag = computed(() => props.type === "Edit");
const disabledFlag = computed(() => props.type === "Review");
const { addSaveItem } = useAutoSave();

const router = useRouter();

const answerResult = ref([] as AnswerData[]);

// 开始时间
const startTime = Date.now();

function init() {
  const surveyId = router.currentRoute.value.params.surveyId as string;
  getSurveyWithQuestions(surveyId).then(({ data }) => {
    if (props.type === "Answer" && data.status == 0) {
      ElMessageBox.alert("当前问卷已停止接收答卷！", "提示", {
        showConfirmButton: false,
        showClose: false
      });
    } else {
      surveyState.data = data;
      surveyState.loading = false;
      updateViewCount();
      onUpdateSurveyData();
    }
  });

  if (props.type === "Review") {
    const answerId = router.currentRoute.value.params.answerId as string;
    getAnswerById(parseInt(answerId)).then(({ data }) => {
      answerResult.value = data.content;
    });
  }
}
init();

function onUpdateSurveyData() {
  if (editFlag.value) {
    const saveKey = Symbol("survey");
    watch(
      () => [
        surveyState.data.title,
        surveyState.data.description,
        surveyState.data.status
      ],
      (newVal, oldVal) => {
        let changed = false;
        for (let index = 0; index < newVal.length; index++) {
          if (newVal[index] != oldVal[index]) {
            changed = true;
            break;
          }
        }
        if (changed) {
          addSaveItem(saveKey, () =>
            updateSurvey({
              title: surveyState.data.title,
              description: surveyState.data.description,
              status: surveyState.data.status,
              id: surveyState.data.id
            })
          );
        }
      }
    );
  }
}

function handleSubmit() {
  const requiredIndex: number[] = [];
  surveyState.data.questions?.forEach((item, index) => {
    if (item.required) {
      requiredIndex.push(index);
    }
  });
  const findRes = requiredIndex.find((item) => !answerResult.value[item]);
  if (findRes !== undefined) {
    ElMessage.warning("请完成问卷中带*号的必填项目！");
  } else {
    addAnswer(
      surveyState.data.id as number,
      answerResult.value as Record<string, any>[],
      parseInt(((Date.now() - startTime) / 1000).toFixed(0))
    ).then(() => {
      ElMessage.success("提交成功！");
      router.replace("/result");
    });
  }
}

// 计算浏览量
function updateViewCount() {
  if (props.type === "Answer") {
    const { surveyId } = router.currentRoute.value.params;
    updateSurvey({
      id: parseInt(surveyId as string),
      viewCount: surveyState.data.viewCount! + 1
    });
  }
}

// 收藏题目
function handleStar(questionId: number, stared: boolean = false) {
  if (stared) {
    ElMessageBox.confirm("确定要取消收藏吗？", "取消收藏", {
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      type: "warning"
    })
      .then(() => {
        removeCollect(questionId).then(() => {
          ElMessage.success("取消成功！");
          init();
        });
      })
      .catch(() => {});
  } else {
    addCollect(questionId).then(() => {
      ElMessage.success("收藏成功！");
      init();
    });
  }
}

// 删除题目
function handleDelete(questionId: number) {
  ElMessageBox.confirm("确定要删除吗？", "删除问卷", {
    cancelButtonText: "取消",
    confirmButtonText: "确定",
    type: "error"
  })
    .then(() => {
      removeQuestion(questionId).then(() => {
        ElMessage.success("删除成功！");
        init();
      });
    })
    .catch(() => {});
}

// 复制题目
function handleCopy(question: Question) {
  addQuestionToSurvey({
    surveyId: surveyState.data.id,
    type: question.type,
    content: question.content,
    required: question.required,
    index: question.index! + 1,
    description: question.description,
    title: question.title
  }).then(() => {
    ElMessage.success("复制成功！");
    init();
  });
}

defineExpose({
  surveyState: surveyState,
  focusQuestionIndex
});
</script>

<style lang="scss" scoped>
.submit-box {
  text-align: center;
  padding: 25px 0 40px;
}
</style>
