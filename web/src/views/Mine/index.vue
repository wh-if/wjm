<template>
  <ElContainer class="mine">
    <ElAside class="mine-sidebar">
      <div style="text-align: center; padding: 20px 0">
        <ElButton
          type="primary"
          @click="handleNewCreate"
          size="large"
          style="width: 80%"
        >
          新建问卷
        </ElButton>
      </div>

      <ElMenu default-active="all">
        <ElMenuItem index="all">
          <ElIcon><Setting /></ElIcon>
          全部
        </ElMenuItem>
        <ElMenuItem index="important">
          <ElIcon><Setting /></ElIcon>
          重要
        </ElMenuItem>
        <ElMenuItem index="recycle">
          <ElIcon><Setting /></ElIcon>
          回收站
        </ElMenuItem>
      </ElMenu>
    </ElAside>
    <ElMain>
      <div class="tool-bar">
        <ElInput
          v-model="state.searchInputValue"
          style="width: 300px"
          size="large"
          clearable
          placeholder="输入问卷标题"
        >
          <template #append>
            <ElButton @click="getData" :icon="Search" />
          </template>
        </ElInput>
        <!-- <ElButton size="large">搜索</ElButton> -->
        <div class="right">
          <ElSelect @change="getData" v-model="state.searchOrderBy">
            <ElOption key="answerCount" label="答卷数量" value="answerCount" />
            <ElOption key="createTime" label="创建时间" value="createTime" />
          </ElSelect>
          <ElSelect @change="getData" v-model="state.searchDesc">
            <ElOption key="true" label="降序" :value="true" />
            <ElOption key="false" label="升序" :value="false" />
          </ElSelect>
        </div>
      </div>
      <ElTable :data="state.surveyList" max-height="700" size="large">
        <ElTableColumn label="问卷ID" prop="id"> </ElTableColumn>
        <ElTableColumn label="标题" prop="title"></ElTableColumn>
        <ElTableColumn label="创建时间" prop="createTime">
          <template #default="scope">
            {{ new Date(parseInt(scope.row.createTime)).toLocaleString() }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="答卷数量" prop="answerCount"></ElTableColumn>
        <ElTableColumn label="状态" prop="status">
          <template #default="scope">
            {{ scope.row.status == 1 ? "答题中" : "已停止" }}
          </template>
        </ElTableColumn>
        <ElTableColumn fixed="right" label="操作" width="250">
          <template #default="scope">
            <ElButton
              link
              :type="scope.row.status == 1 ? 'danger' : 'success'"
              size="large"
              @click="
                () =>
                  handleChangeStatus(
                    scope.row.id,
                    scope.row.status == 1 ? 0 : 1
                  )
              "
              >{{ scope.row.status == 1 ? "停止答题" : "开始答题" }}</ElButton
            >
            <ElButton
              link
              type="primary"
              size="large"
              @click="$router.push(`/edit?surveyId=${scope.row.id}`)"
              >编辑</ElButton
            >

            <ElDropdown trigger="click">
              <ElButton text plain>
                更多操作
                <ElIcon class="el-icon--right">
                  <ArrowDown />
                </ElIcon>
              </ElButton>
              <template #dropdown>
                <ElDropdownMenu>
                  <ElDropdownItem @click="(e) => showShareDialog(scope.row.id)"
                    >分享</ElDropdownItem
                  >
                  <ElDropdownItem
                    @click="
                      $router.push('/stat/overview?surveyId=' + scope.row.id)
                    "
                    >统计</ElDropdownItem
                  >
                  <ElDropdownItem @click="handleRemoveSurvey(scope.row.id)"
                    >删除问卷</ElDropdownItem
                  >
                </ElDropdownMenu>
              </template>
            </ElDropdown>
          </template>
        </ElTableColumn>
      </ElTable>
      <ElPagination
        class="pagination"
        background
        layout="total, sizes, prev, pager, next, jumper"
        v-model:page-size="state.pageSize"
        v-model:current-page="state.currentPage"
        @update:current-page="getData()"
        @update:page-size="getData()"
        :page-sizes="[10, 15, 20, 25]"
        :total="state.listTotal"
      />
      <ElDialog title="分享问卷" v-model="state.showShareDialog">
        <SharePane :survey-id="currentFocusSurvey"></SharePane>
      </ElDialog>
    </ElMain>
  </ElContainer>
</template>

<script setup lang="ts">
import {
  getSurveyList,
  createNewSurvey,
  updateSurvey,
  removeSurvey
} from "@/api/survey";
import {
  ElAside,
  ElButton,
  ElContainer,
  ElInput,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElPagination,
  ElSelect,
  ElTable,
  ElTableColumn,
  ElOption,
  ElIcon,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElDialog,
  ElMessageBox,
  ElMessage
} from "element-plus";
import { ArrowDown, Search, Setting } from "@element-plus/icons-vue";
import { shallowReactive, ref } from "vue";
import { useRouter } from "vue-router";
import SharePane from "@/components/SharePane.vue";

const state = shallowReactive({
  surveyList: [] as Array<Record<string, any>>,
  searchInputValue: "",
  searchOrderBy: "createTime" as const,
  searchDesc: true,
  currentPage: 1,
  pageSize: 10,
  listTotal: 0,
  showShareDialog: false
});

const currentFocusSurvey = ref<number>(0);

const router = useRouter();

// 处理创建新问卷
function handleNewCreate() {
  createNewSurvey().then(({ data }) => {
    router.push(`/edit?surveyId=${data.surveyId}`);
  });
}

// 展示分享弹窗
function showShareDialog(surveyId: number) {
  state.showShareDialog = true;
  currentFocusSurvey.value = surveyId;
}

// 更改问卷状态
function handleChangeStatus(surveyId: number, status: 0 | 1) {
  updateSurvey({
    id: surveyId,
    status: status
  }).then(() => {
    getData();
  });
}

// 删除问卷
function handleRemoveSurvey(surveyId: number) {
  ElMessageBox.confirm("确定要删除该问卷吗？", "提示", {
    cancelButtonText: "取消",
    confirmButtonText: "确认"
  })
    .then(() => {
      removeSurvey(surveyId).then(() => {
        ElMessage.success("删除成功！");
        getData();
      });
    })
    .catch(() => {});
}

// 获取列表数据
function getData() {
  getSurveyList({
    keyword: state.searchInputValue,
    orderBy: state.searchOrderBy,
    desc: state.searchDesc,
    page: state.currentPage,
    pageSize: state.pageSize
  }).then(({ data }) => {
    state.surveyList = data.list;
    state.listTotal = data.total;
  });
}
getData();
</script>

<style lang="scss" scoped>
.mine {
  position: absolute;
  top: 60px;
  bottom: 0;
  width: 100%;
  .mine-sidebar {
    background-color: #fff;
  }
}

.tool-bar {
  display: flex;
  padding: 10px 5px 20px;

  .right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    > * {
      margin: 0 10px;
      width: 120px;
    }
  }
}
.pagination {
  margin-top: 30px;
  justify-content: right;
}
</style>
