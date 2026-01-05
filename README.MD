# BUAA Shuttle Ticket Automation (TypeScript & PyTorch)

English | [简体中文](README_CN.md)

> ⚠️ Use for educational/personal purposes only. Do not engage in illegal resale or commercial scalping.

This repository contains two main parts:

| Directory | Description |
| --- | --- |
| `src/` | Node.js/TypeScript backend logic: CAS login, captcha recognition, booking workflow. |
| `frontend/` | Vite + Vue web UI (WIP) for scheduling and monitoring. |

---

## Highlights

- ✅ CAS login with weak-password flow handling and shared cookie jar.
- ✅ Custom captcha recognizer built on `onnxruntime-node` + Jimp preprocessing.
- ✅ Automatic retries when the server returns “验证码错误”.
- ✅ Payment URLs printed for quick manual payment (15-minute window).
- ✅ `.env` validation via `zod` to avoid missing credentials.
- ✅ Front-end scaffold (Vite + Vue) ready for scheduling dashboards.

---

## Requirements

- Node.js ≥ 18
- npm ≥ 9
- Python ≥ 3.10 (only if you need to retrain the captcha model)

---

## Backend Quick Start

1. **Install dependencies**
	```bash
	cd typescript
	npm install
	```
2. **Configure credentials**
	```bash
	cp .env.example .env
	# fill BUAA_USERNAME / BUAA_PASSWORD
	```
3. **Prepare model files**
	- Pretrained `captcha.onnx`, `captcha.onnx.data`, and `charset.txt` already ship with the repo (see `src/model/`). Just clone and go—no extra training required.
4. **Run the script**
	```bash
	npm run dev
	```
	The CLI executes the sample scenario in `src/index.ts` and prints the payment URL when successful.

---

## Front-end (Vite + Vue)

> Currently WIP – ships a clean Vue scaffold to build dashboards (date picker, scheduling, logs, etc.).

```bash
cd typescript/frontend
npm install
npm run dev
# open http://localhost:5173/
```

Build REST endpoints around `ticket.buy()` (or wrap it in a scheduler) and consume them from the UI.

---

## FAQ

| Question | Answer |
| --- | --- |
| GitHub doesn’t show my latest commits | Only commits merged into the default branch count toward contributions. |
| Can I delete `captcha.onnx.data`? | No. The ONNX model references that file for weights. |
| TypeScript can’t import `App.vue` | Add `src/env.d.ts` with the Vue module declaration and include `**/*.d.ts` in `tsconfig.app.json`. |
| “验证码错误” persists | The script retries automatically; if it still fails, retrain the model or increase `maxCaptchaRetries`. |

---

## Roadmap

- [ ] Front-end UI: schedule planner, log viewer, manual trigger
- [ ] Cron/batch booking with multi-route support
- [ ] Payment link notifications (SMTP/Webhook/SMS)
- [ ] Inventory checks and refund workflows
- [ ] More OCR/model optimizations

---

Contributions and issue reports are welcome! 🎉