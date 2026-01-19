<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NCard, NDataTable, NDatePicker, NGi, NGrid, NSelect, NSpace } from 'naive-ui'

const router = useRouter()

const date = ref<number | null>(null)
const direct = ref<number | null>(null)
const time = ref<string | null>(null)

const direction = [{ value: 1, name: '学院路->沙河' }, { value: 2, name: '沙河->学院路' }]

const timeOptions1 = [
  { value: '07:00', id: 1 },
  { value: '08:00', id: 2 },
  { value: '08:05', id: 3 },
  { value: '08:50', id: 4 },
  { value: '09:40', id: 5 },
  { value: '10:30', id: 6 },
  { value: '13:00', id: 7 },
  { value: '13:05', id: 8 },
  { value: '14:50', id: 9 },
  { value: '15:40', id: 10 },
  { value: '16:30', id: 11 },
  { value: '17:40', id: 12 },
  { value: '19:30', id: 13 },
  { value: '21:00', id: 14 },
  { value: '21:50', id: 16 },
]
const timeOptions2 = [
  { value: '06:40', id: 17 },
  { value: '08:01', id: 18 },
  { value: '08:06', id: 19 },
  { value: '10:00', id: 20 },
  { value: '11:50', id: 21 },
  { value: '12:30', id: 22 },
  { value: '13:20', id: 23 },
  { value: '14:40', id: 24 },
  { value: '16:00', id: 25 },
  { value: '16:05', id: 26 },
  { value: '17:00', id: 27 },
  { value: '17:50', id: 28 },
  { value: '17:55', id: 29 },
  { value: '19:00', id: 30 },
  { value: '21:00', id: 31 },
  { value: '21:50', id: 32 },
]

const timeOptions = computed(() => {
  return direct.value === 1 ? timeOptions1 : direct.value === 2 ? timeOptions2 : []
})

const tableData = ref<any[]>([])

const columns = [
  { title: '日期', key: 'date' },
  { title: '方向', key: 'direction' },
  { title: '时间', key: 'time' }
]

const startOfToday = (() => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.getTime()
})()

const isPastDate = (ts: number) => ts < startOfToday

function goBack() {
  router.push('/dashboard')
}

function onConfirm() {
  if (!date.value || !direct.value || !time.value) {
    console.warn('请填写完整的信息')
    return
  }
  
  const directionName = direction.find(d => d.value === direct.value)?.name || ''
  const dateStr = new Date(date.value).toLocaleDateString('zh-CN')
  
  tableData.value.push({
    date: dateStr,
    direction: directionName,
    time: time.value
  })
  
  // 重置表单
  date.value = null
  direct.value = null
  time.value = null
}
</script>

<template>
  <div class="page">
    <div class="container">
      <div class="header">
        <button class="btn-back" @click="goBack">← 返回</button>
        <h1>抢票任务</h1>
      </div>

      <div class="content">
        <n-space vertical size="large">
          <n-card title="创建抢票任务" size="medium">
            <n-grid :x-gap="12" :y-gap="12" :cols="2" responsive="screen">
              <n-gi :span="1">
                <div class="field-label">日期</div>
                <n-date-picker v-model:value="date" type="date" clearable :is-date-invalid="isPastDate"
                  :is-date-disabled="isPastDate" />
              </n-gi>
              <n-gi :span="1">
                <div class="field-label">发车方向</div>
                <n-select v-model:value="direct" :options="direction" label-field="name" placeholder="请选择发车方向" clearable />
              </n-gi>
              <n-gi :span="1">
                <div class="field-label">时间</div>
                <n-select v-model:value="time" :options="timeOptions" label-field="value" placeholder="请选择时间" clearable />
              </n-gi>
            </n-grid>
            <div class="actions">
              <n-button type="primary" @click="onConfirm">确定</n-button>
            </div>
          </n-card>

          <n-card title="抢票时间表" size="medium">
            <n-data-table :columns="columns" :data="tableData" size="small" />
          </n-card>
        </n-space>
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
  padding: 16px;
  color: #cbd5e1;
}

.field-label {
  margin-bottom: 6px;
  color: #cbd5e1;
  font-size: 14px;
}

.actions {
  margin-top: 16px;
  text-align: right;
}
</style>
