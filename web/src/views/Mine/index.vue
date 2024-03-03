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
          <ElIcon style="margin-left: 6px" size="18"><Plus /></ElIcon>
        </ElButton>
      </div>

      <ElMenu @select="handleMenuSelect" default-active="all">
        <ElMenuItem index="all">
          <ElIcon><Files /></ElIcon>
          全部
        </ElMenuItem>
        <ElMenuItem index="folder">
          <ElIcon><Folder /></ElIcon>
          文件夹
        </ElMenuItem>
        <ElMenuItem index="recycle">
          <ElIcon><Delete /></ElIcon>
          回收站
        </ElMenuItem>
      </ElMenu>
    </ElAside>
    <ElCard class="mine-main">
      <div class="tool-bar">
        <ElInput
          v-if="!inFolderMenu"
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
        <div class="right">
          <ElButton type="success" @click="handleFolder()" v-if="inFolderMenu">
            新建文件夹
          </ElButton>

          <template v-else>
            <ElSelect @change="getData" v-model="state.searchOrderBy">
              <ElOption
                key="answerCount"
                label="答卷数量"
                value="answerCount"
              />
              <ElOption key="createTime" label="创建时间" value="createTime" />
            </ElSelect>
            <ElSelect @change="getData" v-model="state.searchDesc">
              <ElOption key="true" label="降序" :value="true" />
              <ElOption key="false" label="升序" :value="false" />
            </ElSelect>
          </template>
          <ElButton
            v-if="!(currentMenuItem === 'all')"
            type="danger"
            @click="handleRemove(inFolderMenu ? 'folder' : 'survey')"
          >
            批量删除
          </ElButton>
        </div>
      </div>
      <ElTable
        :data="inFolderMenu ? state.folderList : state.surveyList"
        ref="tableRef"
        :row-key="inFolderMenu ? 'idInFolder' : 'id'"
        :load="loadSurveyListOfFolder"
        :lazy="inFolderMenu"
        @selection-change="handleSelectionChange"
        :max-height="inFolderMenu ? '' : 700"
        size="large"
      >
        <ElTableColumn type="selection" width="55" />
        <ElTableColumn label="ID" prop="id">
          <!-- scope.row.folderIds !== undefined 判断该条数据是文件夹还是问卷 -->
          <template #default="scope">
            {{
              scope.row.folderIds !== undefined
                ? scope.row.id
                : scope.row.idInFolder
            }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="名称" prop="title"></ElTableColumn>
        <ElTableColumn label="创建时间" width="200" prop="createTime">
          <template #default="scope">
            <span v-if="scope.row.folderIds !== undefined">
              {{ new Date(parseInt(scope.row.createTime)).toLocaleString() }}
            </span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="答卷数量" prop="answerCount">
          <template #default="scope">
            <span v-if="scope.row.folderIds !== undefined">
              {{ scope.row.answerCount }}个
            </span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="状态" prop="status">
          <template #default="scope">
            <ElTag
              v-if="scope.row.folderIds !== undefined"
              :type="
                scope.row.status == SurveyStatus.Running ? 'success' : 'info'
              "
            >
              {{ ["已停止", "答题中", "已回收"][scope.row.status] }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn fixed="right" label="操作" width="250">
          <template #default="scope">
            <template v-if="scope.row.folderIds === undefined">
              <!-- 修改名称 -->
              <ElButton
                link
                type="primary"
                size="large"
                @click="handleFolder(scope.row.id)"
                >修改名称</ElButton
              >

              <!-- 删除文件夹 -->
              <ElButton
                link
                type="danger"
                size="large"
                @click="handleRemove('folder', scope.row.id)"
                >删除</ElButton
              >
            </template>
            <template v-else>
              <ElButton
                link
                type="warning"
                size="large"
                @click="() => handleChangeStatus(scope.row)"
              >
                {{ ["开始答题", "停止答题", "恢复"][scope.row.status] }}
              </ElButton>
              <ElButton
                v-if="currentMenuItem === 'recycle'"
                link
                type="danger"
                size="large"
                @click="handleRemove('survey', scope.row.id)"
                >彻底删除</ElButton
              >
              <ElButton
                v-if="scope.row.status != SurveyStatus.Removed"
                link
                type="primary"
                size="large"
                @click="$router.push(`/edit/${scope.row.id}`)"
                >编辑</ElButton
              >
              <ElDropdown
                v-if="scope.row.status != SurveyStatus.Removed"
                trigger="click"
              >
                <ElButton text plain>
                  更多操作
                  <ElIcon class="el-icon--right">
                    <ArrowDown />
                  </ElIcon>
                </ElButton>
                <template #dropdown>
                  <ElDropdownMenu>
                    <ElDropdownItem
                      @click="
                        (e) => showShareDialog(scope.row.id, scope.row.status)
                      "
                      >分享</ElDropdownItem
                    >
                    <ElDropdownItem
                      @click="
                        $router.push('/stat/overview?surveyId=' + scope.row.id)
                      "
                      >统计</ElDropdownItem
                    >
                    <ElDropdownItem @click="handleAddSurveyToFolder(scope.row)"
                      >添加到文件夹</ElDropdownItem
                    >
                    <ElDropdownItem
                      v-if="inFolderMenu"
                      @click="handleMoveSurveyOutFolder(scope)"
                      >移出当前文件夹</ElDropdownItem
                    >
                    <ElDropdownItem @click="handleChangeStatus(scope.row, true)"
                      >移动到回收站</ElDropdownItem
                    >
                  </ElDropdownMenu>
                </template>
              </ElDropdown>
            </template>
          </template>
        </ElTableColumn>
      </ElTable>
      <ElPagination
        v-if="!inFolderMenu"
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
    </ElCard>
  </ElContainer>
</template>

<script setup lang="ts">
import {
  getSurveyList,
  createNewSurvey,
  updateSurvey,
  removeSurvey,
  type SearchSurveyParams,
  type SurveyWithQuestions
} from "@/api/survey";
import {
  addFolder,
  getFolderList,
  removeFolder,
  updateFolderName
} from "@/api/folder";
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
  ElMessage,
  ElTag,
  ElCard
} from "element-plus";
import {
  ArrowDown,
  Delete,
  Files,
  Folder,
  Plus,
  Search
} from "@element-plus/icons-vue";
import { shallowReactive, ref, h, computed } from "vue";
import { useRouter } from "vue-router";
import SharePane from "@/components/SharePane.vue";
import { SurveyStatus } from "@/constants";

const state = shallowReactive({
  surveyList: [] as Array<Record<string, any>>,
  searchInputValue: "",
  searchOrderBy: "createTime" as const,
  searchDesc: true,
  currentPage: 1,
  pageSize: 10,
  listTotal: 0,
  showShareDialog: false,
  folderList: [] as Array<Record<string, any>>,
  tableSelectList: [] as number[]
});
const currentFocusSurvey = ref<number>(0);

const router = useRouter();
type MenuItemType = "all" | "folder" | "recycle";
const currentMenuItem = ref<MenuItemType>("all");
const inFolderMenu = computed(() => currentMenuItem.value === "folder");

// 处理菜单变化
function handleMenuSelect(menuKey: string) {
  currentMenuItem.value = menuKey as MenuItemType;
  getData();
}

// 文件夹页列表数据加载与更新
const tableRef = ref();
const refreshFolderDataMap = new Map<
  number,
  { row: any; treeNode: any; resolve: (data: Record<string, any>[]) => void }
>();
function loadSurveyListOfFolder(
  row: any,
  treeNode: unknown,
  resolve: (data: Record<string, any>[]) => void
) {
  const folderId = row.id;
  refreshFolderDataMap.set(folderId, { row, treeNode, resolve });
  getSurveyList({
    folderId
  }).then(({ data }) => {
    if (data.resultList.length === 0) {
      // 更新列表数据补丁
      tableRef.value.store.states.lazyTreeNodeMap.value[row.id] = [];
    }
    resolve(
      data.resultList.map((item: any) => ({
        ...item,
        idInFolder: folderId + "-" + item.id,
        currentFolder: folderId
      }))
    );
  });
}
// 刷新文件夹内容数据
function refreshSurveyListOfFolder(folderId: number) {
  if (folderId) {
    const { row, treeNode, resolve } = refreshFolderDataMap.get(folderId)!;
    loadSurveyListOfFolder(row, treeNode, resolve);
  }
}

// 处理创建新问卷
function handleNewCreate() {
  createNewSurvey().then(({ data }) => {
    ElMessage.success("创建成功！");
    router.push(`/edit/${data.surveyId}`);
  });
}

// 展示分享弹窗
function showShareDialog(surveyId: number, surveyStatus: SurveyStatus) {
  if (surveyStatus == SurveyStatus.Stopping) {
    ElMessage.warning("此问卷当前为停止状态，无法分享作答。");
    return;
  }

  state.showShareDialog = true;
  currentFocusSurvey.value = surveyId;
}

// 更改问卷状态
function handleChangeStatus(row: any, toRecycle: boolean = false) {
  const { id: surveyId, status: curStatus, currentFolder } = row;
  let changeStatus: SurveyStatus;
  if (toRecycle) {
    changeStatus = SurveyStatus.Removed;
  } else if (
    curStatus == SurveyStatus.Running ||
    curStatus == SurveyStatus.Removed
  ) {
    changeStatus = SurveyStatus.Stopping;
  } else {
    changeStatus = SurveyStatus.Running;
  }
  updateSurvey({
    id: surveyId,
    status: changeStatus
  }).then(() => {
    ElMessage.success("操作成功！");
    currentFolder && refreshSurveyListOfFolder(currentFolder);
    getData();
  });
}

// 添加问卷到文件夹
function handleAddSurveyToFolder(row: SurveyWithQuestions) {
  const selectValue = ref<number>();
  const filterFolders = state.folderList.filter(
    (item) => !row.folderIds?.includes(item.id)
  );
  const childrenVNodes = filterFolders.map((item) => {
    return h(ElOption, {
      key: item.id,
      label: item.title,
      value: item.id
    });
  });
  ElMessageBox({
    title: "添加到文件夹",
    // Should pass a function if VNode contains dynamic props
    message: () =>
      h(
        ElSelect,
        {
          modelValue: selectValue.value,
          "onUpdate:modelValue": (val: number) => {
            selectValue.value = val;
          },
          placeholder: "选择文件夹"
        },
        () => childrenVNodes
      ),
    showCancelButton: true,
    cancelButtonText: "取消",
    confirmButtonText: "确定"
  })
    .then(() => {
      if (selectValue.value) {
        updateSurvey({
          id: row.id,
          folderIds: [...(row.folderIds as number[]), selectValue.value]
        }).then(() => {
          if (inFolderMenu.value) {
            refreshSurveyListOfFolder(selectValue.value!);
          }

          ElMessage.success("添加成功！");
        });
      } else {
        ElMessage.warning("未选择文件夹，添加失败！");
      }
    })
    .catch((e) => {
      console.log(e);
    });
}

// 移出当前文件夹
function handleMoveSurveyOutFolder(scope: any) {
  updateSurvey({
    id: scope.row.id,
    folderIds: scope.row.folderIds.filter(
      (i: number) => i != scope.row.currentFolder
    )
  }).then(() => {
    refreshSurveyListOfFolder(scope.row.currentFolder);
    ElMessage.success("操作成功！");
  });
}

// 添加和修改文件夹
function handleFolder(folderId?: number) {
  ElMessageBox.prompt(
    "请输入文件夹名称",
    folderId ? "修改文件夹名称" : "新建文件夹",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消"
    }
  )
    .then(({ value }) => {
      if (!folderId) {
        addFolder(value).then(() => {
          ElMessage.success("新建成功！");
          getData();
        });
      } else {
        updateFolderName(folderId, value).then(() => {
          ElMessage.success("修改成功！");
          getData();
        });
      }
    })
    .catch(() => {});
}

// 删除问卷或文件夹
function handleRemove(type: "survey" | "folder", id?: number) {
  let ids: number[] = [];
  if (id) {
    ids.push(id);
  } else {
    ids = state.tableSelectList;
  }
  if (ids.length === 0) {
    ElMessage.warning("请选择删除项目！");
    return;
  }
  ElMessageBox.confirm(
    `确定要删除该${type === "survey" ? "问卷" : "文件夹"}吗？`,
    "提示",
    {
      cancelButtonText: "取消",
      confirmButtonText: "确认"
    }
  )
    .then(() => {
      const cb = () => {
        ElMessage.success("删除成功！");
        getData();
      };
      if (type === "survey") {
        removeSurvey(ids).then(cb);
      } else if (type === "folder") {
        removeFolder(ids).then(cb);
      }
    })
    .catch(() => {});
}

function handleSelectionChange(val: any) {
  state.tableSelectList = val.map((i: any) => i.id);
}

// 获取列表数据
function getData() {
  getFolderList().then(({ data }) => {
    state.folderList = data.resultList.map((item: any) => ({
      id: item.id,
      idInFolder: "F" + item.id,
      title: item.name,
      hasChildren: true
    }));
  });
  const searchParams: SearchSurveyParams = {
    keyword: state.searchInputValue,
    orderBy: state.searchOrderBy,
    desc: state.searchDesc,
    page: state.currentPage,
    pageSize: state.pageSize
  };
  if (currentMenuItem.value === "recycle") {
    searchParams.status = SurveyStatus.Removed;
  }
  getSurveyList(searchParams).then(({ data }) => {
    state.surveyList = data.resultList;
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
    background-color: var(--el-bg-color);
  }
  .mine-main {
    margin: 50px;
    flex: 1;
  }
}

.tool-bar {
  display: flex;
  padding: 20px 5px 40px;

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
