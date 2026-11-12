<template>
  <detail-layout>
    <template #operate>
      <el-button v-if="!isEdit" type="primary" @click="handleEdit">编辑</el-button>
      <el-button v-else type="primary" :loading="isSaving" @click="handleSave">保存</el-button>
      <el-button @click="handleBack">返回</el-button>
    </template>

    <el-form
      ref="formRef"
      v-loading="isLoading"
      :model="formData"
      :rules="rules"
      :disabled="!isEdit"
      label-width="100px"
    >
      <el-form-item label="用户名：" prop="name">
        <el-input v-model="formData.name" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="手机号：" prop="phone">
        <el-input v-model="formData.phone" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="邮箱：" prop="email">
        <el-input v-model="formData.email" placeholder="请输入邮箱" />
      </el-form-item>
    </el-form>
  </detail-layout>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus';
import { getUserDetail, updateUser } from './api';
import type { UserDetail } from './api/type';
import useLoading from '@/hooks/useLoading';

const route = useRoute();
const router = useRouter();

const isEdit = computed(() => route.name === 'SystemManageUserManageEdit');
const userId = computed(() => String(route.params.id ?? ''));

const formRef = ref<FormInstance>();
const formData = ref<UserDetail>({ id: '', name: '', phone: '', email: '' });
/**
 * 进入编辑态时的数据快照, 用于判断是否存在未保存的修改
 */
const originalForm = ref<UserDetail>();

const { isLoading, executor } = useLoading();
const { isLoading: isSaving, executor: executorSave } = useLoading();

const rules: FormRules<UserDetail> = {
  name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' },
  ],
};

const isDirty = computed(() => {
  if (!isEdit.value || !originalForm.value) return false;
  const { name, phone, email } = formData.value;
  const { name: originName, phone: originPhone, email: originEmail } = originalForm.value;
  return name !== originName || phone !== originPhone || email !== originEmail;
});

const fetchDetail = async () => {
  const res = await executor(getUserDetail, { id: userId.value });
  formData.value = { ...res.data };
  originalForm.value = { ...res.data };
};

const handleEdit = () => {
  router.push({
    name: 'SystemManageUserManageEdit',
    params: { id: userId.value },
  });
};

const handleSave = async () => {
  const valid = await formRef.value?.validate().catch(() => false);
  if (!valid) return;

  await executorSave(updateUser, { ...formData.value });
  ElMessage.success('保存成功');
  router.push({ name: 'SystemManageUserManageList' });
};

const handleBack = async () => {
  if (isDirty.value) {
    try {
      await ElMessageBox.confirm('当前内容尚未保存，确定要返回吗？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      });
    } catch {
      return;
    }
  }

  router.push({ name: 'SystemManageUserManageList' });
};

onMounted(() => {
  fetchDetail();
});
</script>
