# BUAA 校车抢票系统（TypeScript & PyTorch）

[English](README.MD) | 简体中文

> ⚠️ 请勿将本项目用于违法、倒卖或商业代抢行为。仅供学习与个人使用。

## 仓库结构

| 目录 | 说明 |
| --- | --- |
| `src/` | Node.js/TypeScript 后端逻辑：CAS 登录、验证码识别、抢票流程等。|
| `frontend/` | Vite + Vue 前端项目（WIP），用于构建可视化 UI。|

---

## 功能亮点

- ✅ **统一认证登录**：`SSOService` 自动走 BUAA CAS 流程并处理弱密码提示。
- ✅ **验证码识别**：使用自训练的 `captcha.onnx`，结合 `onnxruntime-node + Jimp` 做预处理和推理。
- ✅ **智能重试**：接口返回“验证码错误”时自动换图重试（默认 5 次）。
- ✅ **支付信息提示**：下单成功后打印支付链接，方便 15 分钟内完成付款。
- ✅ **配置校验**：`zod` 校验 `.env` 中的账号密码，防止漏填。
- ✅ **前端脚手架**：`frontend/` 采用 Vite + Vue，后续可实现日期选择、计划任务、日志等 UI。

---

## 环境要求

- Node.js ≥ 18
- npm ≥ 9
- Python ≥ 3.10（仅在需要重新训练验证码模型时使用）

---

## 后端快速上手

1. **安装依赖**
   ```bash
   cd typescript
   npm install
   ```
2. **配置账号**
   ```bash
   cp .env.example .env
   # 在 .env 中填写 BUAA_USERNAME / BUAA_PASSWORD
   ```
3. **准备模型文件**
   - 仓库已内置训练好的 `captcha.onnx`、`captcha.onnx.data` 与 `charset.txt`（位于 `src/model/`），git clone 后即可直接使用，无需自行训练。
4. **运行脚本**
   ```bash
   npm run dev
   ```
   CLI 会执行 `src/index.ts` 中的示例抢票流程，并在成功时输出付款链接。

---

## 前端（Vite + Vue）

> 目前仍在开发阶段，已提供基础模板，方便接入后端 API、展示计划任务与抢票进度。

```bash
cd typescript/frontend
npm install
npm run dev
# 浏览器访问 http://localhost:5173/
```

建议在前端封装 REST API（调用 `ticket.buy()` 或未来的服务端接口）以实现日期选择、定时抢票、推送设置等。

---

## 常见问题（FAQ）

| 问题 | 解决办法 |
| --- | --- |
| GitHub 上看不到最新 commit | 确认已经 push 到默认分支；非默认分支不会计入贡献统计。|
| `captcha.onnx.data` 能删吗？ | 不能，ONNX 会引用该文件存放权重。|
| TypeScript 报 `.vue` 类型缺失 | 新增 `src/env.d.ts` 声明，并在 `tsconfig.app.json` 中包含 `**/*.d.ts`。|
| 一直提示“验证码错误” | 程序会自动重试；若仍失败，请重新训练模型或增大 `maxCaptchaRetries`。|

---

## 路线图

- [ ] 前端 UI：日期选择、日志面板、计划管理
- [ ] 定时/批量抢票，支持多班次并发
- [ ] 付款链接推送（SMTP / Webhook / 短信等）
- [ ] 余票查询与退票
- [ ] 验证码模型精度与推理速度优化

---

欢迎提交 Issue / PR，一起让 BUAA 校车出行体验更丝滑！😊
