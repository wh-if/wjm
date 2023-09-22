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
          <ElDropdownItem>个人资料</ElDropdownItem>
          <ElDropdownItem>修改密码</ElDropdownItem>
          <ElDropdownItem @click="handleLogout" divided
            >退出登录</ElDropdownItem
          >
        </ElDropdownMenu>
      </template>
    </ElDropdown>
  </ElHeader>
  <div class="main-content">
    <RouterView></RouterView>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import {
  ElAffix,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
  ElLink
} from "element-plus";

const userStore = useUserStore();

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
