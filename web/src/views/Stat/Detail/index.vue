<template>
  <div>
    <ElCard class="filter-box">
      <ElForm :model="filterState" label-position="top" inline>
        <ElFormItem label="提交时间区间" prop="submitTimeRange">
          <ElDatePicker
            v-model="filterState.submitTimeRange"
            type="datetimerange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
          />
        </ElFormItem>
        <ElFormItem label="答题时长区间" prop="durationRange">
          <ElTimePicker
            v-model="filterState.durationRange"
            is-range
            range-separator="To"
            start-placeholder="Start time"
            end-placeholder="End time"
          />
        </ElFormItem>
        <div style="display: flex; align-items: center;">
          <ElButton
            type="primary"
            size="large"
            style="width: 150px;"
          > 筛选
          </ElButton>
        </div>
      </ElForm>
    </ElCard>
    <ElTable
      :data="
        state.answerList.slice(
          (state.currentPage - 1) * state.pageSize,
          state.currentPage * state.pageSize
        )
      "
      size="large"
    >
      <ElTableColumn label="编号" width="120" prop="id"> </ElTableColumn>

      <ElTableColumn label="提交时间" width="180" prop="submitTime">
        <template #default="scope">
          {{ new Date(parseInt(scope.row.submitTime)).toLocaleString() }}
        </template>
      </ElTableColumn>
      <ElTableColumn
        label="答题时长"
        width="120"
        prop="expendDuration"
      ></ElTableColumn>
      <ElTableColumn label="状态" width="120" prop="status">
        <template #default="scope">
          {{ scope.row.status == 1 ? "作废" : "正常" }}
        </template>
      </ElTableColumn>
      <ElTableColumn label="IP" width="120" prop="ip"></ElTableColumn>
      <ElTableColumn label="User-Agent" width="400" prop="ua"></ElTableColumn>
      <ElTableColumn fixed="right" label="操作" width="250">
        <template #default="scope">
          <ElButton
            link
            :type="scope.row.status == 1 ? 'success' : 'info'"
            size="large"
            @click="
              () =>
                handleChangeStatus(scope.row.id, scope.row.status == 1 ? 0 : 1)
            "
            >{{ scope.row.status == 1 ? "恢复正常" : "作废" }}</ElButton
          >
          <ElButton
            link
            type="primary"
            size="large"
            @click="$router.push(`/a/${$route.query.surveyId}/${scope.row.id}`)"
            >详情</ElButton
          >
        </template>
      </ElTableColumn>
    </ElTable>
    <ElPagination
      class="pagination"
      background
      layout="total, sizes, prev, pager, next, jumper"
      v-model:page-size="state.pageSize"
      v-model:current-page="state.currentPage"
      :page-sizes="[10, 15, 20, 25]"
      :total="state.answerList.length"
    />
  </div>
</template>

<script setup lang="ts">
import { updateAnswerData, type Answer, getAnswerList } from "@/api/answer";
import {
  ElCard,
  ElFormItem,
  ElForm,
  ElPagination,
  ElTable,
  ElTableColumn,
  ElButton,
  ElDatePicker,
  ElTimePicker
} from "element-plus";
import { reactive } from "vue";
import { useRouter } from "vue-router";

const state = reactive({
  pageSize: 10,
  currentPage: 1,
  answerList: [] as Answer[]
});

const filterState = reactive({
  durationRange: 0,
  submitTimeRange: 0
});

const router = useRouter();

function getData() {
  getAnswerList(
    parseInt(router.currentRoute.value.query.surveyId as string)
  ).then(({ data }) => {
    state.answerList = data.list;
  });
}

getData();

function handleChangeStatus(answerId: number, status: 0 | 1) {
  updateAnswerData(answerId, { status }).then((res) => {
    getData();
  });
}
</script>

<style lang="scss" scoped>
.filter-box {
  margin-bottom: 50px;
}

.pagination {
  margin-top: 30px;
  justify-content: right;
}
</style>
