<template>
  <ElCard shadow="never">
    <ElTable :data="tableState.list" stripe>
      <ElTableColumn type="index" width="50" />
      <ElTableColumn
        v-for="(item, index) in tableState.columns"
        :prop="item"
        :label="'字段' + (index + 1)"
        :key="item"
      >
        <template #default="scope">
          <ElImage
            v-if="
              scope.row[scope.column.rawColumnKey]
                .toString()
                .startsWith('data:image/png;')
            "
            :src="scope.row.resultValue"
          ></ElImage>
          <span v-else>{{ scope.row[scope.column.rawColumnKey] }}</span>
          {{ console.log() }}
        </template>
      </ElTableColumn>
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
import {
  ElCard,
  ElImage,
  ElButton,
  ElTable,
  ElTableColumn
} from "element-plus";
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
  if (props.list.length == 0) {
    return {
      list: [],
      columns: []
    };
  }
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
  const columns = Reflect.ownKeys(list[0]).filter(
    (i) => i != "answerId"
  ) as string[];
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
