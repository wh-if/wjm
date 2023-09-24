<template>
  <ElCard shadow="never">
    <ElTable :data="tableState.list" stripe>
      <ElTableColumn type="index" width="50" />
      <ElTableColumn
        v-for="(item, index) in tableState.columns"
        :prop="item"
        :label="'字段' + (index + 1)"
        :key="item"
      ></ElTableColumn>
      <ElTableColumn fixed="right" label="操作">
        <template #default="scope">
          <ElButton
            link
            type="primary"
            size="small"
            @click="handleViewDetail(scope.row.answerId)"
            >查看详情</ElButton
          >
        </template>
      </ElTableColumn>
    </ElTable>
  </ElCard>
</template>

<script setup lang="ts">
import { ElCard, ElTag, ElButton, ElTable, ElTableColumn } from "element-plus";
import { ref, type PropType, computed } from "vue";
import type { FormatStatResult } from "@/utils/formatStatData";
import { useRouter } from "vue-router";

const props = defineProps({
  list: {
    type: Object as PropType<FormatStatResult["answerResultList"]>,
    required: true
  }
});

const router = useRouter();

const tableState = computed(() => {
  const arr: FormatStatResult["answerResultList"] = [];
  props.list.forEach((item) => {
    if (Array.isArray(item.resultValue)) {
      item.resultValue.forEach((i) => {
        arr.push({
          answerId: item.answerId,
          resultValue: i
        });
      });
    } else {
      arr.push(item);
    }
  });
  const list = arr.map((item) => {
    let result = {} as any;
    result.answerId = item.answerId;

    if (typeof item.resultValue == "object") {
      Object.assign(result, item.resultValue);
    } else {
      result.resultValue = item.resultValue;
    }
    return result;
  });
  const columns = Reflect.ownKeys(list[0]).slice(1) as string[];
  return {
    list,
    columns
  };
});

function handleViewDetail(answerId: number) {
  const { surveyId } = router.currentRoute.value.query;
  router.push(`/stat/detail?surveyId=${surveyId}&answerId=${answerId}`);
}
</script>

<style lang="scss" scoped></style>
