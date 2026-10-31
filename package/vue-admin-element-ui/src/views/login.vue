<template>
  <div class="flex size-full">
    <div class="flex-1 bg-(--a-color-fill-4) pt-[20vh]">
      <div class="mb-[20px] flex justify-center">
        <el-image :src="LogoImage" class="w-[100px]" />
      </div>
      <h2 class="text-center text-(--a-size-title-xl)">管理系统</h2>
      <p class="p-[20px] text-(--a-color-text-3)">
        一个后台管理系统, 基于 vue + vite + element plus 搭建的基础模板,
        包含布局、路由、mock、请求工具与其他常用工具封装。
      </p>
    </div>
    <div class="flex-1 pt-[30vh] pr-[40px] pl-[40px]">
      <h3 class="mb-[8px] text-(--a-size-title-lg)">欢迎回来</h3>
      <p class="mb-[12px] text-(--a-color-text-3)">请使用管理员账号登录系统</p>
      <el-form :model="formData" :rules="formRule" ref="formInstance" label-position="top">
        <el-form-item label="用户名">
          <template #label>
            <el-space>
              <el-icon :size="16"><user-filled /></el-icon>
              用户名
            </el-space>
          </template>
          <el-input v-model="formData.username" placeholder="请输入用户名" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <template #label>
            <el-space>
              <el-icon><lock /></el-icon>
              密码
            </el-space>
          </template>
          <el-input
            v-model="formData.password"
            type="password"
            show-password
            placeholder="请输入密码"
            clearable
          ></el-input>

          <el-button type="primary" class="mt-[20px] block w-full" @click="handleLogin()"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import LogoImage from '@/assets/logo.svg';
import { ref } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { UserFilled, Lock } from '@element-plus/icons-vue';
import { useAccountStore } from '@/stores/account';
import { useRouter } from 'vue-router';

const { login } = useAccountStore();

const formInstance = ref<FormInstance>();
const formData = ref({
  username: '',
  password: '',
});
const formRule: FormRules<typeof formData.value> = {
  username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
};

const router = useRouter();
const handleLogin = async () => {
  await formInstance.value?.validate();
  const { username, password } = formData.value;
  await login(username, password);
  ElMessage.success('登录成功');
  router.replace({ name: 'Home' });
};
</script>

<style lang="scss" scoped></style>
