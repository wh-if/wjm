<template>
  <ElHeader class="main-header">
    <div class="logo">
      <h1>问卷猫</h1>
    </div>
    <ElDropdown>
      <ElLink :underline="false">
        {{ userStore.user.email }}
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
  ElDialog
} from "element-plus";
import UserInfoForm from "./components/UserInfoForm.vue";
import { reactive, ref } from "vue";
import UserAccountForm from "./components/UserAccountForm.vue";

const userStore = useUserStore();

const dialogState = reactive({
  visible: false,
  type: "userinfo"
});

function handleLogout() {
  userStore.logoutAction();
}
</script>

<style lang="scss" scoped>
.main-header {
  display: flex;
  justify-content: flex-end;
  position: fixed;
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  z-index: 99;

  .logo {
    width: 130px;
    height: 80%;
    align-self: center;
    position: absolute;
    left: 150px;
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
