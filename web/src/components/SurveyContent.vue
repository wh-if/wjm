<template>
  <div
    v-if="surveyState.loading"
    v-loading.fullscreen.lock="surveyState.loading"
  ></div>
  <div v-else class="survey-content">
    <QuestionCard
      :style="0 == currentQuestionIndex ? 'z-index: 2' : ''"
      :tool="false"
    >
      <EditInput
        v-model="surveyState.data.title"
        placeholder="请输入问卷标题"
        :edit="editFlag"
        :text-box-style="{ fontSize: '2.5rem', textAlign: 'center' }"
      >
      </EditInput>
      <EditInput
        v-model="surveyState.data.description"
        :edit="editFlag"
        placeholder="请输入问卷描述信息"
        style="margin: 10px 0"
        :text-box-style="{ fontSize: '0.9rem' }"
      >
      </EditInput>
    </QuestionCard>
    <Draggable
      v-model="surveyState.data.questions"
      :move="editFlag ? undefined : () => false"
      @end="handleDragEnd"
      item-key="id"
    >
      <template #item="{ element: item, index }">
        <QuestionCard
          :stared="item.stared"
          @star="handleStar(item.id!, item.stared)"
          @delete="handleDelete(item.id!)"
          @copy="handleCopy(item)"
          :style="index + 1 == currentQuestionIndex ? 'z-index: 2' : ''"
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
      </template>
    </Draggable>
    <!-- <template v-else>
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
    </template> -->

    <div v-if="props.type === 'Answer'" class="submit-box">
      <ElButton
        v-show="currentQuestionIndex == 0"
        @click="currentQuestionIndex = 1"
        class="begin-answer-button"
        type="primary"
        size="large"
        style="width: 80%"
        >开始答题</ElButton
      >
      <ElPagination
        v-show="currentQuestionIndex != 0"
        class="survey-content-pagination"
        v-model:current-page="currentQuestionIndex"
        :default-page-size="1"
        :total="surveyState.data.questions!.length"
        layout="prev, pager, next"
        background
        small
      >
      </ElPagination>
      <ElButton
        @click="handleSubmit"
        type="primary"
        size="large"
        style="width: 240px"
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
import { ElButton, ElMessage, ElMessageBox, ElPagination } from "element-plus";
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
import Draggable from "vuedraggable-es";

type SurveyContentType = "Edit" | "Review" | "Answer";

const props = defineProps({
  type: {
    type: String as PropType<SurveyContentType>,
    default: "Answer"
  }
});
// 聚焦的问题卡片的问题索引
const focusQuestionIndex = ref();

// 用于移动端答题-题目分页
const currentQuestionIndex = ref(0);

const surveyState = reactive({
  data: {} as SurveyWithQuestions,
  loading: true
});

const editFlag = computed(() => props.type === "Edit");
const disabledFlag = computed(() => editFlag.value || props.type === "Review");
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

      if (props.type === "Answer") {
        updateViewCount();
      }

      if (props.type === "Review") {
        const answerId = router.currentRoute.value.params.answerId as string;
        getAnswerById(parseInt(answerId)).then(({ data }) => {
          answerResult.value = surveyState.data.questionSort!.map(
            (item) =>
              (data.content as AnswerData[]).find(
                (i) => i && i.questionId == item
              )!
          );
          surveyState.loading = false;
        });
      } else {
        surveyState.loading = false;
      }
      if (props.type === "Edit") {
        onUpdateSurveyData();
      }
    }
  });
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
  if (surveyState.data.questions?.length == 1) {
    ElMessage.warning("问卷至少需要一个题目。");
    return;
  }
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
    description: question.description,
    title: question.title
  }).then(() => {
    ElMessage.success("复制成功！");
    init();
  });
}

// 处理拖动
function handleDragEnd() {
  surveyState.data.questionSort = surveyState.data.questions?.map(
    (item) => item.id!
  );
  updateSurvey({
    questionSort: surveyState.data.questionSort,
    id: surveyState.data.id
  });
}

defineExpose({
  surveyState: surveyState,
  focusQuestionIndex,
  init
});

// 适配移动端答题
if (props.type == "Answer") {
  document.body.style.minWidth = "auto";
}
</script>

<style lang="scss" scoped>
.survey-content {
  padding-bottom: 50px;
  .submit-box {
    text-align: center;
    padding: 25px 0 40px;
  }
}
@media (min-width: 860px) {
  .survey-content-pagination,
  .begin-answer-button {
    display: none;
  }
}
@media (max-width: 860px) {
  .submit-box {
    z-index: 2;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;

    .survey-content-pagination {
      justify-content: center;
      padding: 15px 0;
    }
    .begin-answer-button {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
