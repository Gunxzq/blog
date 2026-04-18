---
date: 2026-04-19
---

# 通过 Git 生成热力贡献图并同步博客

## 前置依赖

> [!TIP]
> 以下三个 npm 包配合使用，实现从数据记录到图表生成的全流程

- `git-stats`：核心数据库，负责记录你的提交数据
- `git-stats-html`：生成器，把数据读取出来画成网页图表
- `git-stats-importer`：时光机，把历史 Git 记录导入到数据库

## 步骤一：确认 Git 邮箱

> [!IMPORTANT]
> `git-stats` 是靠邮箱来识别提交者的，请确保配置正确

```bash
git config user.email "你的邮箱"
```

## 步骤二：导入历史数据

> [!NOTE]
> `git-stats` 不会自动记录历史，需要手动导入一次

进入项目目录并执行导入：

```bash
cd D:\project\你的项目文件夹
git-stats-importer -e "你的邮箱"
```

> [!TIP]
> 如果你有多个项目（公司项目、个人项目），需要分别进入每个项目目录运行此命令

## 步骤三：生成 HTML 图表

```bash
git-stats --raw | git-stats-html -o stats.html
```

## 步骤四：集成到 VuePress

1. 将生成的 `stats.html` 移动到 `VuePress/public/` 目录
2. 在 Markdown 文件中使用 `<iframe src="/stats.html">` 引用

## 步骤五：配置自动化钩子

> [!TIP]
> 配置好 Husky 钩子后，每次提交代码会自动更新热力图

编辑 `.husky/pre-commit` 文件：

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔄 正在更新代码热力图..."

if command -v git-stats >/dev/null 2>&1 && command -v git-stats-html >/dev/null 2>&1; then
    if git-stats --raw | git-stats-html -o src/.vuepress/public/stats.html; then
        git add src/.vuepress/public/stats.html
        echo "✅ 代码热力图已更新"
    else
        echo "⚠️ 代码热力图生成失败，请检查 git-stats 配置"
    fi
else
    echo "⚠️ git-stats 或 git-stats-html 未安装，跳过热力图更新"
fi
```

## 避坑指南

> [!WARNING]
> **全局统计**：`git-stats` 的图表永远是你所有项目的总和，无法生成"仅当前项目"的热力图

> [!WARNING]
> **数据持久化**：数据库文件在 `~/.git-stats`，重装系统后需重新运行步骤二恢复数据

> [!WARNING]
> **邮箱匹配**：如果提交记录有多个邮箱，需分别运行 `git-stats-importer -e "邮箱A"` 和 `git-stats-importer -e "邮箱B"`
