---
date: 2026-07-13
category:
  - 逆向分析
  - 游戏格式
tag:
  - SPT
  - 脚本语言
  - 场景组装
  - 起动战士
sticky: 1
---

# Script.spt — 起动战士的场景组装脚本语言

## 概述

`Ultimate Knight WindomXP` 使用 **Script.spt** 文件来定义场景。SPT 全称为 **Standard Parts Table**（标准部件表），是一种基于 Shift-JIS 编码的命令式脚本语言。

有趣的是，**SPT 有两种完全不同的用途**，但文件名相同：

| 用途 | 位置 | 内容 |
|:-----|:------|:------|
| **地图场景组装** | `map/*/Script.spt` | 瓦片布局、建筑摆放、光照、BGM |
| **角色属性定义** | `Robo/KD-03/Script.spt` | 机体属性、AI、配色、武器定义 |

---

## 1. 语法基础

SPT 的语法极其简单：

- `'` 开头为注释
- `command(arg1, arg2, ...);` 为命令调用
- `key=value;` 为属性赋值
- 编码为 Shift-JIS

---

## 2. 地图场景指令集

### 2.1 完整指令表

| 指令 | 签名 | 说明 |
|:-----|:------|:------|
| `LoadMapData` | `(filename)` | 加载瓦片地图布局数据 |
| `LoadHitXFile` | `(filename)` | 加载场景碰撞网格 |
| `LoadWaterXFile` | `(filename)` | 加载水面网格 |
| `LoadSkyXFile` | `(filename, R, G, B)` | 加载天空球，RGB 为雾色 |
| `SetLightColor` | `(R, G, B)` | 方向光颜色 |
| `BgmFileName` | `(id, filename.ogg)` | 背景音乐 |
| `LoadBuildingXFile` | `(id, normal.x, normal.x?, dmg.x?, dmg.x?)` | 加载建筑预设 |
| `LoadMaterialXFile` | `(filename)` | 瓦片材质定义 |
| `LoadMapXFile` | `(index, mesh.x, hit.x)` | 加载一个瓦片 |
| `MapSetting` | `(tileIndex, xfileNo, waterHeight)` | 瓦片索引 → 几何体映射 |
| `MapSettingEx` | `(index, xfileNo, count, ...)` | 扩展瓦片映射 |
| `SetBuilding` | `(mapNo, bldNo, bldXNo, hp, x, y, z)` | 在瓦片上摆放建筑 |

### 2.2 City 地图示例

```
LoadMapData(MapData3.txt);
LoadHitXFile(Hit.x);
LoadWaterXFile(Sea.x);
LoadSkyXFile(Sky.x,194,214,240);
SetLightColor(255,255,255);
BgmFileName(0,fuse.ogg);

' 建筑预设定义（4参数 = 正常, 受损, 破坏, 废墟）
LoadBuildingXFile(0, Bill00.x,Bill00.x,,);
LoadBuildingXFile(1, Bill01.x,Bill01.x,Bill01_d.x,Bill01_d.x);

' 瓦片定义（16个）
LoadMaterialXFile(map00.x);
LoadMapXFile(0, map00.x, map00hit.x);
...

' 瓦片 → 几何体映射
MapSettingEx(0, 0,16, -1,..., -10000);
MapSetting(1, 1, -10000);

' 瓦片上的建筑
SetBuilding(0, 0, 1, 1500, 8.207660, 0.537087, 21.932104);
```

### 2.3 场景构建流程

```
Script.spt 解析
    ↓
LoadMapData → 加载瓦片地图布局 (.mpd + .txt)
    ↓
各 LoadXFile → 加载网格/碰撞/水面/天空
    ↓
SetLightColor + BgmFileName → 光照和音效
    ↓
LoadBuildingXFile → 注册建筑预设（4级损伤状态）
    ↓
LoadMapXFile → 注册瓦片网格
    ↓
MapSetting/MapSettingEx → 将瓦片索引映射到网格文件
    ↓
SetBuilding → 在指定瓦片位置摆放建筑实例
```

---

## 3. 角色属性指令集（Robo/Script.spt）

### 3.1 基础属性

```
@99 = 999999999.0;          ← 时间值（帧时长？）
Name=MS-98ﾊｽ;               ← 名称（Shift-JIS）
NameEng=MS-Type98;          ← 英文名
HP=1300;                    ← 生命值
Generator=1100;             ← 发电机出力
Energy=900;                 ← 能量值
Score=650;                  ← 分值
RestBody=4;                 ← 残机数
LockDist=80;                ← 锁定距离
```

### 3.2 AI 设定

```
AISetting(战斗倾向, 标准距离);
  ← 0=近接 〜 100=远距离

AIWeaponSetting(slot, 最小距离, 最大距离, 使用频率%, 能量消耗判定);
  ← slot: 0=shot, 1=近接, 2=sub1, 3=sub2, 4=sub3
```

### 3.3 武器系统

```
ATTACKARMSET(编号, 手臂网格.x);  ← 格斗武器/射击角度修正零件名称
GUNFILENAME(编号, 网格.x);       ← 持枪时才显示的零件
SWORDFILENAME(编号, 网格.x);     ← 持剑时才显示的零件

WEAPONPOINT(编号, 零件名称, 发射口性质);
  ← 编号: 0~4 = 手持武器发射口/挂点
  ← 编号: 18+ = 推进器喷口
  ← 性质: UP (普通发射口)
```

### 3.4 推进器系统

```
BURNERSET(编号, 网格文件.x, 大小倍率, 方向);
  ← 方向: UP / DOWN
  ← 网格文件: Output01.x ~ Output08.x（喷口模型）
```

---

## 4. 编译版本 Script.spt.a

除了文本形式的 `.spt`，游戏还使用了编译后的二进制版本 `.spt.a`：

| 属性 | 说明 |
|:-----|:------|
| **格式** | 二进制加密/压缩 |
| **加载方式** | 游戏引擎实际加载的是此文件 |
| **解密** | 需要社区工具（WindomXP File Decoder / Entranscode）解码 |
| **编辑** | 解密后可用文本编辑器修改，重新加密放回原目录 |

---

## 5. 地图变体对比

通过 SPT 脚本定义的场景参数，可以看到各地图的差异：

| 地图 | Tile 数 | 建筑种类 | 水面 | 雾色 | 特点 |
|:-----|:--------|:---------|:------|:------|:------|
| City | 16 | 8 | 有 | (194,214,240) | 完整城市街景 |
| City2 | 16 | 8 | 有 | (194,214,240) | 与 City 相同布局 |
| City3 | 2 | 12 | 有 | (194,214,240) | 简化版，密集建筑 |
| City_tac | 16 | 8 | 有 | (194,214,240) | 战术版 |
| In | 5 | 0 | 无 | (0,0,0) | 室内，纯黑雾 |
| In2 | 5 | 0 | 无 | (0,0,0) | 室内 |
| moon | 5 | 0 | 无 | (0,0,0) | 月球，galaxy 星空 |

---

## 总结

SPT 脚本语言的设计体现了务实和高效：

- **同一语法，两种用途**：地图场景组装和角色属性定义使用同一套脚本语法，降低学习成本
- **命令式设计**：顺序执行，符合直觉，无需编译即可运行
- **编译版本**：`.spt.a` 提供了加密和性能优化选项，兼顾开发效率和运行时性能
- **分层抽象**：`LoadMapData` → `LoadMapXFile` → `MapSetting` → `SetBuilding` 形成了"数据→模板→映射→实例"的四层场景构建抽象

这种脚本语言设计在 2000 年代的同人游戏中非常典型——简单、直接、够用，而且易于 MOD 作者修改。