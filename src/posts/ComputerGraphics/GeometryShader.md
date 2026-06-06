---
date: 2026-06-05
category:
  - 图形学
tag:
  - 渲染流水线
  - 几何着色器
---


# 几何着色器（Geometry Shader）
在不启用曲面细分的情况下，几何着色器将位于**VS（顶点着色器）**与**PS（像素着色器）**之间。
他的输入和输出分别是：
1. 输入：完整的图元（顶点着色器的输出）
2. 输出：新的图元（像素着色器的输入）


## 核心能力
|能力|说明|典型应用|
|--|--|--|
|几何放大|1个图元 → N个图元|公告牌（1点→4顶点）、粒子系统（1点→1四边形）、细分| 
|几何解扩|多个图元 → 更少图元|LOD简化、遮挡剔除| 
|改变图元类型|三角形→点、点→四边形等|粒子发射、轮廓线提取|
|访问相邻顶点|可获取邻接图元信息|阴影体积、轮廓线检测|


## 系统定位
1. 公告牌PSO：近景用实例化，远景用公告牌作为LOD末级——这与NVIDIA白皮书中根据投影面积动态控制粒子数量的LOD方案一致
2. 粒子特效PSO：火焰、烟雾、火花，适合用几何着色器将点扩展为粒子四边形
3. 几何特效PSO：爆炸碎片、毛发、轮廓线等




## 例程
```hlsl
[maxvertexcount(N)]   // 单次调用输出的顶点数量的最大值为2
void ShaderName(
  PrimitiveType InputVertexType InputName[NumElements],
  inout StreamOutputObject<OutputVertexType> OutputName){
    // 几何着色器的代码
  }
```

1. N：单次调用输出的顶点数量的最大值,**GS**每次输出的顶点数各不相同，但是不会超过N。
在**GS**每次输出的标量在1~20之间，性能最好。每次调用几何着色器所输出的标量个数为：maxvertexcount与输出的顶点类型结构体中标量个数的乘积。
```
顶点结构体定义了“float3 Position”与“float2 TexCoord”两个成员变量。
如果maxvertexcount为4，则几何着色器每次输出20个标量
```
2. 输入：定义有特定图元的顶点数组
InputVertexType有如下值：point、line、triangle、lineadj、triangleadj
3. 输出：流类型（StreamOutputObject），模板参数用于指定输出顶点的具体类型，组织几何着色器输出顶点为图元。
StreamOutputObject有如下类型：PointStream、LineStream、TriangleStream
