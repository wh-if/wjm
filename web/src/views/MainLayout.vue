<template>
  <ElHeader class="main-header">
    <ElDropdown>
      <ElLink :underline="false">
        {{ userStore.user.email }}
        <ElIcon class="el-icon--right">
          <ArrowDown />
        </ElIcon>
      </ElLink>
      <template #dropdown>
        <ElDropdownMenu>
          <ElDropdownItem>Action 1</ElDropdownItem>
          <ElDropdownItem>Action 2</ElDropdownItem>
          <ElDropdownItem @click="handleLogout" divided>退出登录</ElDropdownItem>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
  </ElHeader>

  <RouterView class="main-content"></RouterView>
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
}

.main-content{
  padding-top: 60px;
  min-height: 100vh;
}
</style>
