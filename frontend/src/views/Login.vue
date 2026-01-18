<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

async function onConfirm() {
    const trimmedUser = username.value.trim()
    const trimmedPass = password.value.trim()

    if (!trimmedUser || !trimmedPass) {
        error.value = '请输入用户名和密码'
        return
    }

    loading.value = true
    error.value = ''

    try {
        //await simulateLogin(trimmedUser, trimmedPass)

        const resp = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: trimmedUser, password: trimmedPass }),
        })

        const data = await resp.json()

        if (!resp.ok || !data.success) {
            throw new Error(data.message || '登录失败')
        }
        // 登录成功，跳转到 dashboard
        router.push({ path: '/dashboard', query: { user: trimmedUser } })
        console.log(data.message)
    } catch (err) {
        error.value = err instanceof Error ? err.message : '登录失败，请稍后重试'
    } finally {
        loading.value = false
    }
}

</script>

<template>
    <div class="page">
        <div class="glass">
            <div class="brand">
                <div class="badge">智慧校车</div>
                <h1>抢票系统</h1>
                <p class="lead">统一身份登录，进入班车与抢票界面。</p>
            </div>

            <section class="panel">
                <div>
                    <p class="eyebrow">Account</p>
                    <h2>登录</h2>
                    <p class="muted">输入校园统一认证信息，完成登录后进入下一步。</p>
                </div>

                <div class="field">
                    <label for="username">用户名</label>
                    <input id="username" v-model="username" autocomplete="username" placeholder="请输入用户名" />
                </div>

                <div class="field">
                    <label for="password">密码</label>
                    <input id="password" v-model="password" type="password" autocomplete="current-password"
                        placeholder="请输入密码" />
                </div>

                <p v-if="error" class="error">{{ error }}</p>

                <button class="primary" :disabled="loading" @click="onConfirm">
                    {{ loading ? '登录中...' : '登录并进入' }}
                </button>
                <p class="hint">登录成功后将跳转到班车/抢票界面。</p>
            </section>
        </div>
    </div>
</template>

<style scoped>
.page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px;
    background: radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.12), transparent 32%),
        radial-gradient(circle at 80% 0%, rgba(56, 189, 248, 0.12), transparent 30%),
        #0b1021;
}

.glass {
    width: 100%;
    max-width: 1080px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 20px;
    padding: 32px;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(10px);
}

.brand {
    align-self: center;
    padding: 12px 6px;
}

.badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 999px;
    background: rgba(99, 102, 241, 0.15);
    color: #c7d2fe;
    font-size: 14px;
    letter-spacing: 0.02em;
}

.brand h1 {
    margin: 16px 0 8px;
    font-size: 40px;
    color: #e2e8f0;
}

.lead {
    margin: 0;
    color: #94a3b8;
    font-size: 16px;
    line-height: 1.6;
}

.panel {
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    color: #e2e8f0;
}

.eyebrow {
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-size: 12px;
    color: #8b9cb8;
}

.panel h2 {
    margin: 6px 0;
    font-size: 26px;
    color: #eef2ff;
}

.muted {
    margin: 0;
    color: #94a3b8;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.field label {
    color: #cbd5e1;
    font-size: 14px;
}

.field input {
    padding: 12px 14px;
    border-radius: 12px;
    border: 1px solid rgba(148, 163, 184, 0.3);
    background: rgba(15, 23, 42, 0.8);
    color: #e2e8f0;
    font-size: 15px;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.field input:focus {
    border-color: rgba(94, 234, 212, 0.7);
    box-shadow: 0 0 0 4px rgba(94, 234, 212, 0.12);
}

.primary {
    border: none;
    cursor: pointer;
    font-size: 15px;
    font-weight: 600;
    border-radius: 12px;
    padding: 12px 14px;
    background: linear-gradient(135deg, #6366f1, #22d3ee);
    color: #0b1021;
    box-shadow: 0 15px 35px rgba(79, 70, 229, 0.35);
    transition: transform 0.15s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.primary:not(:disabled):hover {
    transform: translateY(-1px);
}

.error {
    margin: 0;
    color: #fc0000;
    font-size: 14px;
}

.hint {
    margin: 0;
    color: #94a3b8;
    font-size: 13px;
}

@media (max-width: 900px) {
    .glass {
        grid-template-columns: 1fr;
        padding: 20px;
    }

    .brand h1 {
        font-size: 32px;
    }
}
</style>
