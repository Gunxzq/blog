---
date: 2026-04-16
order: 2
category:
  - cloudbase
tag:
  - 云开发
  - cloudbase
  - 数据库
---

# 使用非官方 SDK 连接云 MySQL 数据库

如果你希望摆脱官方 Node.js SDK ([@cloudbase/node-sdk](https://docs.cloudbase.net/api-reference/server/node-sdk/initialization)) 在数据库操作上的局限性，可以选择安装第三方依赖（如 `mysql2`）直接连接云 MySQL。

> **注意**：使用此方式前，请确保满足以下**必要条件**：
>
> 1. **网络环境**：云 MySQL 实例必须拥有 [VPC 网络](VPC_NETWORK_DOC_URL)。
> 2. **环境版本**：必须使用 [标准版云环境](STANDARD_ENV_DOC_URL)。
> 3. **子网配置**：云函数必须与云 MySQL 实例部署在**同一个 VPC 子网**下。

## 连接配置说明

在编写代码前，请获取以下连接信息并配置到云函数的环境变量中：

*   **主机地址 (`DB_HOST`)**：云 MySQL 实例的内网地址。
*   **端口号 (`DB_PORT`)**：源于数据库设置界面的**内网地址**部分，通常默认为 `3306`，请以控制台显示为准。
*   **用户名 (`DB_USER`)**：需要你在云 MySQL 控制台中**自行创建**的数据库账号，不建议直接使用 root 账号（因为 root 账号默认没有设置密码，存在安全风险且无法直接通过密码认证连接）。
*   **密码 (`DB_PASSWORD`)**：上述创建账号时设置的密码。
*   **数据库名 (`DB_NAME`)**：默认情况下，系统会自动创建一个与**云环境 ID** 相同的数据库，你也可以在 **DMC** 数据库管理中创建其他自定义数据库。

## 示例代码

以下示例展示如何在云函数中使用 [`mysql2`](https://www.npmjs.com/package/mysql2) 连接池操作数据库。

```js
const mysql = require('mysql2/promise');

// 全局连接池，避免每次调用都重新创建连接
let pool;

/**
 * 获取数据库连接池单例
 */
function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,       // 数据库主机地址
      port: process.env.DB_PORT || 3306, // 端口号
      user: process.env.DB_USER || 'root', // 用户名
      password: process.env.DB_PASSWORD,   // 密码
      database: process.env.DB_NAME || 'tcb', // 数据库名
      waitForConnections: true,        // 当无可用连接时，是否等待
      connectionLimit: 5,              // 连接池最大连接数
      queueLimit: 0,                   // 最大等待队列长度，0表示无限制
      acquireTimeout: 60000,           // 获取连接的超时时间
      timeout: 60000,                  // 连接超时时间
      charset: 'utf8mb4'               // 字符集
    });
  }
  return pool;
}

exports.main = async (event, context) => {
  let connection;
  try {
    const pool = getPool();
    // 从池中获取一个连接
    connection = await pool.getConnection();
    
    // 执行查询
    const [rows] = await connection.query('SELECT * FROM persons LIMIT 10');
    
    return { 
      success: true, 
      data: rows 
    };
  } catch (error) {
    console.error('数据库操作失败:', error);
    return { 
      success: false, 
      error: error.message 
    };
  } finally {
    // 确保连接被释放回池中
    if (connection) {
      connection.release();
    }
  }
};
```



## 常见问题与解决方案
1. 如果没有 VPC 网络怎么办？
如果你的云 MySQL 是旧版本实例且不支持 VPC：
建议方案：先备份现有数据，然后销毁旧实例。重新创建的新版云 MySQL 实例将默认包含 VPC 网络支持。

2. 如果不想使用标准版环境怎么办？
开发/测试场景：可以在本地开发环境或支持公网访问的环境中，暂时通过公网地址连接数据库。