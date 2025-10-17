# School Bus Ticketing System (SBT)

自动化 BUAA 校车票订票系统，包括登录、验证码识别以及票务购买功能。

## 🚀 特性

* **SSO 登录**：自动使用 BUAA 统一认证（SSO）系统登录。
* **验证码识别**：通过 OCR 自动识别订票过程中的验证码。
* **自动订票**：自动选择班次并完成购票流程。
* **可配置化**：用户信息通过 `config.json` 管理，避免明文写入代码。

---

## 🗂 项目结构

```
SBT_v1.0/
│
├─ app.py             # 应用入口，执行主逻辑
├─ sbt/
│   └─ cli.py         # 核心订票逻辑
├─ utils/
│   └─ auth.py        # SSO 登录与 Session 管理
├─ config.json        # 用户 BUAA SSO 凭证配置
└─ urls.py            # 接口 URL 管理
```

---

## ⚙️ 安装

1. 克隆仓库：

```powershell
git clone https://github.com/zeroduhyy/school_buss_ticket.git
cd school_buss_ticket/SBT_v1.0
```

2. 安装依赖：

```powershell
pip install -r requirements.txt
```

---

## 📝 使用方法

1. 更新 `config.json`，填写你的 BUAA SSO 凭证：

```json
{
    "USERNAME": "your_username",
    "PASSWORD": "your_password"
}
```

2. 运行应用：

```powershell
python app.py
```

3. 按提示输入班次日期和班次编号即可完成订票操作。

---

## 🛠 技术栈

* `requests` — HTTP 请求
* `Pillow` — 图片处理
* `ddddocr` — 验证码识别
* `beautifulsoup4` — HTML 解析

---

## ⚠️ 注意事项

* 请确保 `config.json` 中的账号密码正确。
* 本项目仅用于教育学习和个人使用，请勿用于商业用途。
* 使用 OCR 时可能会因验证码识别失败而需要重试。

---

## 📄 License

本项目采用 MIT 许可证。

---

