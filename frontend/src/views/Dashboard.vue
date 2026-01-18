<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const username = computed(() => route.query.user || '同学')

function goToBuses() {
  router.push('/buses')
}

function goToTasks() {
  router.push('/tasks')
}

function logout() {
  router.push('/login')
}
</script>

<template>
  <div class="dashboard-page">
    <div class="dashboard-container">
      <div class="header">
        <div class="header-content">
          <h1>智慧校车抢票系统</h1>
          <p>欢迎回来，{{ username }}</p>
        </div>
        <button class="btn-logout" @click="logout">登出</button>
      </div>

      <div class="grid">
        <div class="card">
          <div class="card-icon">🚌</div>
          <h2>班车概览</h2>
          <p>查看班车时刻表、剩余座位和已购车票。</p>
          <button class="btn-primary" @click="goToBuses">进入班车界面</button>
        </div>

        <div class="card">
          <div class="card-icon">⚡</div>
          <h2>抢票任务</h2>
          <p>创建或查看自动抢票任务，随时跟踪状态。</p>
          <button class="btn-primary" @click="goToTasks">前往任务</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background: #0b1021;
  padding: 32px 16px;
}

.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding: 24px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
}

.header-content h1 {
  margin: 0 0 8px 0;
  font-size: 32px;
  color: #e2e8f0;
}

.header-content p {
  margin: 0;
  color: #94a3b8;
  font-size: 16px;
}

.btn-logout {
  padding: 10px 20px;
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.3);
  color: #f87171;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-logout:hover {
  background: rgba(248, 113, 113, 0.2);
  border-color: rgba(248, 113, 113, 0.5);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.2s ease;
}

.card:hover {
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(15, 23, 42, 0.8);
}

.card-icon {
  font-size: 48px;
  line-height: 1;
}

.card h2 {
  margin: 0;
  color: #e2e8f0;
  font-size: 22px;
}

.card p {
  margin: 0;
  color: #94a3b8;
  font-size: 14px;
  line-height: 1.6;
}

.btn-primary {
  padding: 12px 24px;
  background: linear-gradient(135deg, #6366f1, #22d3ee);
  color: #0b1021;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-start;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
