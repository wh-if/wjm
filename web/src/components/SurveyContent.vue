<template>
  <div
    v-if="surveyData === undefined"
    v-loading.fullscreen.lock="surveyData === undefined"
  ></div>
  <ElCard v-else style="margin: 0 70px; overflow: visible">
    <QuestionCard>
      <EditInput
        v-model="surveyData!.value.title"
        :text-box-style="{ fontSize: '2.5rem', textAlign: 'center' }"
      >
      </EditInput>
    </QuestionCard>
    <QuestionCard>
      <EditInput v-model="surveyData!.value.description"> </EditInput>
    </QuestionCard>
    <QuestionCard
      v-for="(item, index) in surveyData!.value.questions"
      :key="item.id"
    >
      <RadioQuestion :list-index="index"></RadioQuestion>
    </QuestionCard>
    <div class="submit-box" v-if="!isEdit">
      <ElButton
        @click="handleSubmit"
        type="primary"
        size="large"
        style="width: 200px"
        >提交</ElButton
      >
    </div>
  </ElCard>
</template>

<script setup lang="ts">
import { addAnswer } from "@/api/answer";
import {
  updateSurvey,
  type SurveyWithQuestions,
  getSurveyWithQuestions
} from "@/api/survey";
import EditInput from "@/components/EditInput.vue";
import QuestionCard from "@/components/QuestionCard.vue";
import RadioQuestion from "@/components/RadioQuestion.vue";
import { ElButton, ElCard, ElInput, ElMessage } from "element-plus";
import { inject, ref, watch, type Ref, reactive, provide } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false
  }
});

const router = useRouter();

const surveyData = ref<Ref<SurveyWithQuestions>>();
const provideData = ref();

const questionAnswer = ref<Record<string, any>[]>([]);

// 开始时间
const startTime = Date.now();

function initData() {
  if (props.isEdit) {
    surveyData.value = inject<Ref<SurveyWithQuestions>>("surveyData")!;
    watch(
      () => [
        (surveyData.value as Ref<SurveyWithQuestions>).value.title,
        (surveyData.value as Ref<SurveyWithQuestions>).value.description
      ],
      (val) => {
        updateSurvey({
          title: val[0],
          description: val[1],
          id: (surveyData.value as Ref<SurveyWithQuestions>).value.id
        } as SurveyWithQuestions);
      }
    );
  } else {
    getSurveyWithQuestions(
      router.currentRoute.value.params.surveyId as string
    ).then(({ data }) => {
      surveyData.value = ref(data);
      provideData.value = surveyData.value.value;
    });
    provide("surveyData", provideData);
  }
}

initData();

function handleSubmit() {
  addAnswer(
    surveyData.value?.value.id as number,
    questionAnswer.value as Record<string, any>[],
    Date.now() - startTime
  ).then(() => {
    ElMessage.success("提交成功！");
    router.push("/result");
  })
}

provide("isEdit", props.isEdit);
provide("questionAnswer", questionAnswer);
</script>

<style lang="scss">
.submit-box {
  text-align: center;
  padding: 10px 0;
}
</style>