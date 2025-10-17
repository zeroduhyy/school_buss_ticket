# SBT (refactored)

这个仓库将原始脚本重构为一个小的包 `sbt`，保留原来 `app.py` 的入口行为。

结构说明:
- `app.py` - 入口文件（保持不变的调用点），现在只是导入并调用 `sbt.main()`。
- `sbt/cli.py` - 主逻辑被迁移到这里。
- `utils/` - 原有工具模块（如 `auth.py`）保持不变。

如何运行:

```powershell
python .\app.py
```

依赖:
- requests
- pillow
- ddddocr
- beautifulsoup4
