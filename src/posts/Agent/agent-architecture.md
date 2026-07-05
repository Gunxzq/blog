---
title: AI Agent 架构与实现
date: 2026-06-25
category: Agent
tag:
  - Agent
  - Coze
  - 微信小程序
  - CloudBase
---

# AI Agent 架构与实现

> 基于 Coze + CloudBase AGUI 协议适配 + 小程序端工具调用

---

## 一、整体架构

```
┌──────────────────────────────────────────────────────────┐
│ 微信小程序                                                  │
│                                                           │
│  pages/index/index                                        │
│    └─ AI 助手 按钮 → navigateToAgent()                     │
│                                                           │
│  subpages/agent/agent-chat/agent-chat                     │
│    └─ <agent-ui> 组件                                      │
│         ├─ 渲染聊天界面 (markdown/工具卡片/推荐问题)         │
│         ├─ 管理对话状态 (消息列表/会话列表)                  │
│         ├─ 发送请求 → wx.cloud.extend.AI.bot.sendMessage() │
│         └─ 执行工具 handler → wx.cloud.callFunction()      │
│                                                           │
│  components/agent-ui/ (官方组件)                            │
│    ├─ 当 botId 以 "agent-" 开头 → V2 (AGUI 协议)          │
│    └─ V2 模式下支持前端工具调用                              │
├──────────────────────────────────────────────────────────┤
│                       ↓ AGUI 协议                          │
├──────────────────────────────────────────────────────────┤
│ CloudBase 网关                                             │
│  wx.cloud.extend.AI.bot.sendMessage({ botId })             │
│    → 路由到对应的 HTTP 云函数                                │
├──────────────────────────────────────────────────────────┤
│                       ↓ HTTP                              │
├──────────────────────────────────────────────────────────┤
│ HTTP 云函数: agent-dwa                                     │
│  (Python, @cloudbase/agent-adapter-coze)                  │
│                                                           │
│  app.py → AgentServiceApp + CozeAgent                     │
│  agent.py → build_coze_agent()                            │
│  auth.py → JWT 鉴权 (提取 user_id)                         │
│                                                           │
│  功能: 将 AGUI 协议 ↔ Coze Chat V3 API 相互转换            │
│  部署: CloudBase HTTP 云函数, Python 3.10, 端口 9000       │
├──────────────────────────────────────────────────────────┤
│                       ↓ Coze Chat V3 API                   │
├──────────────────────────────────────────────────────────┤
│ Coze 平台 (api.coze.cn)                                    │
│                                                           │
│  输入: 用户消息 + 工具定义 (tool schema)                    │
│  处理: LLM 根据提示词和上下文决定调用哪个工具                │
│  输出: 工具调用 JSON 参数 或 自然语言回复                    │
│                                                           │
│  Coze 只负责: 语义理解、对话管理、参数生成                   │
│  Coze 不负责: 实际数据查询、数据库操作                       │
└──────────────────────────────────────────────────────────┘
```

---

## 二、单次请求的执行流

以下以用户提问"附近有没有母婴室"为例，完整走一遍：

### Step 1: 用户输入

```
用户: "附近有没有母婴室？"
```

agent-ui 组件收集消息，构造 AGUI 请求：

```js
// agent-ui/index.js sendMessageV2()
await ai.bot.sendMessage({
  data: {
    botId: "agent-dwa-xxx",              // 以 agent- 开头，触发 V2 模式
    threadId: "threadId_1719300000000",
    runId: "run_id_1719300000000",
    messages: [
      { id: "msg_xxx", role: "user", content: "附近有没有母婴室？" }
    ],
    tools: [                              // 将工具定义发给 Coze
      {
        name: "search_poi",
        description: "搜索指定位置附近的POI设施",
        parameters: {
          type: "object",
          properties: {
            keyword: { type: "string", description: "搜索关键词" },
            type: { type: "string", description: "类型代号" },
          },
        },
      },
    ],
  },
});
```

### Step 2: CloudBase 网关路由

CloudBase 网关根据 `botId` 将请求路由到对应的 HTTP 云函数 `agent-dwa`。

### Step 3: Coze 适配器转换协议

`agent-dwa` 将 AGUI 请求转为 Coze Chat V3 API 请求，调用 Coze 平台。

### Step 4: Coze LLM 决策

Coze 上的 Bot 根据提示词和工具描述，决定调用 `search_poi` 工具，返回 tool call 事件：

```json
{
  "type": "TOOL_CALL_START",
  "toolCallId": "call_xxx",
  "toolCallName": "search_poi"
}
```

接着流式传输参数：

```json
{
  "type": "TOOL_CALL_ARGS",
  "toolCallId": "call_xxx",
  "delta": "{\"keyword\": \"母婴室\", \"type\": \"1\"}"
}
```

**Coze 的产出到此为止——它只输出了一个 JSON 参数串。**

### Step 5: agent-ui 组件执行前端工具

```js
// agent-ui/index.js handleStream() → 第 2454-2510 行
// 过滤出 status === "running" 的 tool_call
const toolCalls = currentParts.filter(
  part => part.type === "tool_call" && part.status === "running"
);

for (const toolCall of toolCalls) {
  // 在 agentV2Config.tools 中找到同名 tool
  const tool = this.data.agentV2Config.tools.find(
    item => item.name === toolCall.toolCallName
  );
  if (tool) {
    // 执行 handler（跑在微信小程序端）
    const toolResult = await tool.handler(JSON.parse(toolCall.arguments));
    // 结果发回 Coze
    frontendToolsResult.push({ toolCallId, result: JSON.stringify(toolResult) });
  }
}

// 递归调用 sendMessageV2，将工具结果送回 Coze
await this.sendMessageV2(toolCallMessages);
```

### Step 6: 工具 Handler 调用云函数

```js
// agent-chat.js 中定义的 tools[].handler
handler: async (params) => {
  // ⭐ 小程序原生 API，直接调用云函数
  const res = await wx.cloud.callFunction({
    name: 'agent-poi-router',
    data: params,    // { keyword: "母婴室", type: "1" }
  });
  return res.result; // { success: true, data: [...], total: 5 }
}
```

`wx.cloud.callFunction` 的特性：
- 微信原生能力，**无需配置域名白名单**
- 自动携带用户 `OPENID`
- 走事件触发，不走 HTTP 网关
- 相比 `wx.cloud.callHTTPFunction` 配置成本为零

### Step 7: 结果回流

```
工具执行结果 → sendMessageV2(toolCallMessages) → Coze
  → Coze LLM 拿到查询结果
  → 组织自然语言回复
  → TEXT_MESSAGE_CONTENT 事件流 → agent-ui 渲染
```

---

## 三、关键源码位置

### 前端组件（已迁移）

| 文件 | 关键逻辑 |
|---|---|
| `components/agent-ui/index.js:58` | botId 以 `agent-` 开头 → 自动切 V2 模式 |
| `components/agent-ui/index.js:1393-1396` | `isAgent` 决定走 V1 还是 V2 发送 |
| `components/agent-ui/index.js:2326-2370` | `sendMessageV2()` → 构造 AGUI 请求 |
| `components/agent-ui/index.js:2371-2512` | `handleStream()` → 处理事件流 + 执行前端工具 |
| `components/agent-ui/index.js:2454-2510` | **工具调用执行 + 结果回传** |

### Coze 适配器（已部署）

| 文件 | 说明 |
|---|---|
| `cloudfunctions/agent-dwa/app.py` | 入口，AgentServiceApp + CozeAgent |
| `cloudfunctions/agent-dwa/agent.py` | 构建 CozeAgent，JWT 预处理器 |
| `cloudfunctions/agent-dwa/auth.py` | JWT 鉴权，从 Authorization header 提取 user_id |

### POI 路由云函数

| 文件 | 说明 |
|---|---|
| `cloudfunctions/agent-poi-router/config/db.js` | Knex + MySQL 连接 |
| `cloudfunctions/agent-poi-router/routes/poi.js` | `/api/poi` GET 接口 |

---

## 四、配置步骤

### 1. 环境变量

在 CloudBase 控制台为 `agent-dwa` 配置：

| 变量 | 说明 |
|---|---|
| `COZE_API_TOKEN` | Coze 平台 API Token |
| `COZE_BOT_ID` | Coze Bot ID |
| `COZE_API_BASE` | 可选，默认 `https://api.coze.cn` |

### 2. 小程序端配置

```js
// config.js
export const config = {
  // ...
  botId: 'agent-dwa-xxx',  // 来自 CloudBase Agent 控制台的 botId，必须以 "agent-" 开头
};
```

```js
// subpages/agent/agent-chat/agent-chat.js
Page({
  data: {
    chatMode: 'bot',
    agentConfig: {
      botId: config.botId,
      tools: [
        {
          name: 'search_poi',
          description: '搜索指定位置附近的 POI 设施，支持按类型和关键词筛选',
          parameters: {
            type: 'object',
            properties: {
              keyword: { type: 'string', description: '搜索关键词' },
              type: {
                type: 'string',
                description: '类型: 0-卫生间, 1-母婴室, 2-康复医疗, 3-康复教育, 4-辅具适配, 5-康园, 6-评估机构, 7-卫生间（附母婴室）',
              },
              latitude: { type: 'number', description: '纬度' },
              longitude: { type: 'number', description: '经度' },
            },
          },
          handler: async (params) => {
            const res = await wx.cloud.callFunction({
              name: 'agent-poi-router',
              data: params,
            });
            return res.result;
          },
        },
      ],
    },
  },
});
```

---

## 五、职责边界

| 层 | 职责 | 不做什么 |
|---|---|---|
| **Coze** | 语义理解、对话管理、工具参数生成 | 不查询数据库、不调云函数 |
| **agent-dwa** | AGUI ↔ Coze API 协议转换 | 不执行业务逻辑 |
| **agent-ui 组件** | 渲染 UI、执行前端工具 handler | 不做 API 调用（只调 handler） |
| **handler (agent-chat.js)** | 调用云函数 | 只做参数透传 |
| **agent-poi-router (云函数)** | 查询数据库、返回 POI 数据 | 不做 AI 推理 |

核心结论：
> **Coze 只产生 JSON 参数，真正的数据查询发生在 `wx.cloud.callFunction` 这一步，完全在小程序端执行。**

---

