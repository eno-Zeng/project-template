<template>
  <main>
    <h1 class="mb-4 text-xl font-bold">Home Page</h1>
  </main>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { fetchUserList, type User } from '@/api/user';

const users = ref<User[]>([]);
const error = ref('');

onMounted(async () => {
  try {
    users.value = await fetchUserList();
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e);
  }
});
</script>
