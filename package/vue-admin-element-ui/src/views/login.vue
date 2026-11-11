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
        <el-form-item label="用户名" prop="username">
          <template #label>
            <el-space>
              <el-icon :size="16"><user-filled /></el-icon>
              用户名
            </el-space>
          </template>
          <el-input v-model="formData.username" placeholder="请输入用户名" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
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
        </el-form-item>
        <el-button type="primary" class="mt-[20px] block w-full" @click="handleLogin()"
          >登录</el-button
        >
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
import { useRoute, useRouter } from 'vue-router';
import { HomePage } from '@/router/constant';

const { login } = useAccountStore();

const formInstance = ref<FormInstance>();
const formData = ref({
  username: '',
  password: '',
});
const formRule: FormRules<typeof formData.value> = {
  username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
};

const route = useRoute();
const router = useRouter();
const handleLogin = async () => {
  // 校验失败时 validate 会 reject, 静默忽略即可 (表单项已展示错误信息)
  const valid = await formInstance.value?.validate().catch(() => false);
  if (!valid) return;

  try {
    const { username, password } = formData.value;
    await login(username, password);
  } catch {
    // 登录失败: 错误提示由请求层统一处理, store 已回滚登录态, 无需重复处理
    return;
  }

  ElMessage.success('登录成功');
  // 优先回跳登录前的目标页面 (路由守卫跳转登录时携带 redirect)
  const redirect = route.query.redirect;
  const target =
    typeof redirect === 'string' && redirect.startsWith('/') ? redirect : HomePage.path;
  router.replace(target);
};
</script>

<style lang="scss" scoped></style>
