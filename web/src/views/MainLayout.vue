<template>
  <ElHeader class="main-header">
    <div class="logo">
      <h1>问卷猫</h1>
    </div>

    <img
      class="github-icon"
      @click="toGitHub()"
      src="../assets/svg/github.svg"
      title="GitHub"
      alt="GitHub"
    />
    <ElSwitch
      v-model="darkState"
      style="margin: 0 25px"
      size="large"
      :active-action-icon="Moon"
      :inactive-action-icon="Sunny"
    />
    <ElDropdown>
      <ElLink :underline="false">
        {{ userStore.user.name }}
        <ElIcon class="el-icon--right">
          <ArrowDown />
        </ElIcon>
      </ElLink>
      <template #dropdown>
        <ElDropdownMenu>
          <ElDropdownItem
            @click="
              () => {
                dialogState.visible = true;
                dialogState.type = 'userinfo';
              }
            "
            >个人资料</ElDropdownItem
          >
          <ElDropdownItem
            @click="
              () => {
                dialogState.visible = true;
                dialogState.type = 'password';
              }
            "
            >修改密码</ElDropdownItem
          >
          <ElDropdownItem @click="handleLogout" divided
            >退出登录</ElDropdownItem
          >
        </ElDropdownMenu>
      </template>
    </ElDropdown>
    <ElDialog
      v-model="dialogState.visible"
      :title="dialogState.type == 'userinfo' ? '个人信息' : '修改密码'"
      destroy-on-close
      width="520px"
    >
      <UserInfoForm
        v-if="dialogState.type == 'userinfo'"
        :close="() => (dialogState.visible = false)"
      ></UserInfoForm>
      <UserAccountForm
        v-if="dialogState.type == 'password'"
        type="password"
        :close="() => (dialogState.visible = false)"
      ></UserAccountForm>
    </ElDialog>
  </ElHeader>
  <div class="main-content">
    <RouterView></RouterView>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import {
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
  ElLink,
  ElDialog,
  ElHeader,
  ElSwitch
} from "element-plus";
import { Sunny, Moon } from "@element-plus/icons-vue";
import UserInfoForm from "./components/UserInfoForm.vue";
import { reactive } from "vue";
import UserAccountForm from "./components/UserAccountForm.vue";
import { useDark } from "@/hooks/useDark";

const userStore = useUserStore();
const { darkState } = useDark();

const dialogState = reactive({
  visible: false,
  type: "userinfo"
});

function handleLogout() {
  userStore.logoutAction();
}

function toGitHub() {
  window.open("https://github.com/wh-if/wjm");
}
</script>

<style lang="scss" scoped>
.main-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: fixed;
  width: 100%;
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);
  z-index: 99;

  .github-icon {
    width: 26px;
    cursor: pointer;
  }

  .logo {
    width: 130px;
    height: 80%;
    align-self: center;
    position: absolute;
    left: 100px;
    background-image: url("@/assets/image/ghost.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: left;
    h1 {
      text-align: right;
      font-size: 1.5rem;
      height: 100%;
    }
  }
}

.main-content {
  position: relative;
  padding-top: 60px;
  min-height: 100vh;
}
</style>
