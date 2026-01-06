<script setup lang="ts">
import { ref } from 'vue'

const username = ref('')
const password = ref('')

function onConfirm() {
  console.log('username:', username.value)
  console.log('password:', password.value)
}
</script>

<template>
  <div class="container">
    <h1 class="title">智慧校车抢票系统</h1>

    <div class="form">
      <input
        v-model="username"
        placeholder="请输入用户名"
        class="input"
      />

      <input
        v-model="password"
        type="password"
        placeholder="请输入密码"
        class="input"
      />

      <button class="btn" @click="onConfirm">
        确认
      </button>
    </div>
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.title {
  font-size: 28px;
  margin-bottom: 30px;
}

.form {
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input {
  padding: 8px 10px;
  font-size: 14px;
}

.btn {
  padding: 8px;
  font-size: 15px;
  cursor: pointer;
}
</style>
