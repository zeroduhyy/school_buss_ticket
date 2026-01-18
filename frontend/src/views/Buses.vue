<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  router.push('/dashboard')
}
</script>

<template>
  <div class="page">
    <div class="container">
      <div class="header">
        <button class="btn-back" @click="goBack">← 返回</button>
        <h1>班车概览</h1>
      </div>

      <div class="content">
        <p>班车信息页面开发中...</p>
        <div class="placeholder">
          <p>在这里可以显示：</p>
          <ul>
            <li>班车时刻表</li>
            <li>剩余座位数</li>
            <li>已购车票列表</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #0b1021;
  padding: 32px 16px;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.btn-back {
  padding: 10px 16px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #cbd5e1;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.3);
}

.header h1 {
  margin: 0;
  color: #e2e8f0;
  font-size: 28px;
}

.content {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 32px;
  color: #cbd5e1;
}

.placeholder {
  margin-top: 20px;
  padding: 20px;
  background: rgba(99, 102, 241, 0.1);
  border-left: 3px solid #6366f1;
  border-radius: 8px;
}

.placeholder ul {
  margin: 10px 0 0 0;
  padding-left: 20px;
}

.placeholder li {
  margin: 8px 0;
}
</style>
