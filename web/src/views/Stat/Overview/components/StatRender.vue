<template>
  <div class="stat-render">
    <p class="stat-render-title">
      <span style="font-weight: bold">{{ props.listIndex + 1 }}.</span>
      {{ props.statData.questionRaw.title }}
    </p>
    <p class="stat-render-info">
      填写率 {{ props.statData.answerRate }}% / 填写
      {{ props.statData.answerResultList.length }}
    </p>
    <template v-if="ifShowStatus.PercentBar">
      <PercentBar
        v-for="item in props.statData.options"
        :key="item.id"
        :name="item.text"
        :count="item.count"
        :rate="item.rate"
      ></PercentBar>
    </template>

    <InfiniteList :list="props.statData.answerResultList" v-if="ifShowStatus.InfiniteList"></InfiniteList>
    <ChartSet
      v-if="ifShowStatus.ChartSet"
      :stat-data="props.statData"
    ></ChartSet>
  </div>
</template>

<script setup lang="ts">
import PercentBar from "./PercentBar.vue";
import ChartSet from "./ChartSet.vue";
import InfiniteList from "./InfiniteList.vue";
import { computed, type PropType } from "vue";
import type { FormatStatResult } from "@/utils/formatStatData";
import { QuestionTypeEnum } from "@/constants";

const props = defineProps({
  statData: {
    type: Object as PropType<FormatStatResult>,
    required: true
  },
  listIndex: {
    type: Number,
    required: true
  },
  type: {
    type: String as PropType<QuestionTypeEnum>,
    required: true
  }
});

const ifShowStatus = computed(() => {
  const ifShowList = {
    PercentBar: [QuestionTypeEnum.Radio, QuestionTypeEnum.MultiRadio],
    InfiniteList: [QuestionTypeEnum.Text],
    ChartSet: [QuestionTypeEnum.Radio, QuestionTypeEnum.MultiRadio]
  };
  const ifShowStatus: Partial<Record<keyof typeof ifShowList, boolean>> = {};

  for (const key in ifShowList) {
    if (Object.prototype.hasOwnProperty.call(ifShowList, key)) {
      let tKey = key as keyof typeof ifShowList;
      const element = ifShowList[tKey];
      ifShowStatus[tKey] = element.includes(props.statData.questionRaw.type);
    }
  }
  return ifShowStatus;
});
</script>

<style lang="scss" scoped>
.stat-render {
  margin: 70px 0;
}
.stat-render-title {
  padding: 5px 0;
}
.stat-render-info {
  color: #999999;
  font-size: 0.8rem;
  padding: 5px 0;
}
</style>
