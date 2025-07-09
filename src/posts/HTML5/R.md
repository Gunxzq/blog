---
title: H5
date: 2025-04-22
index: false
icon: laptop-code
category:
  - HTNL
---

<Catalog />

# h5


## 图像热区
在img中创建可以点击的区域。
```html
<img src="URL" usemap="#image-map" />
<map name="image-map">
    <area shape="circle" coords="" href="" />
</map>
```
|shape|coords|含义|
|---|---|---|
|rect|左上角x，右下角y|矩形|
|circle|圆心x，y、以及半径|圆形|
|poly|指定每个节点的x、y|多边形|
|default|覆盖整个图像，其他区域未捕获点击，则此区域将被激活|默认区域|


## 字符实体
某些字符在 HTML 中具有特殊意义,如大于号 (<) 定义 HTML 标签的开始
字符实体用于在 HTML 文档中插入特殊字符,如版权号 ,注册商标等
通常情况下,HTML会自动截去多余的空格。不管你加多少空格,都被看做一个空格。
比如你在两个字之间加了10个空格,HTML会截去9个空格,只保留一个。
为了在网页中增加空格,你可以使用&nbsp;表示空格。

|属性|结构|
|---|---|
|空格|&nbsp;|
|小于号|&lt;|
|大于号|&gt;|
|引号|&quot;|
|版权号|&copy;|
|注册商标|&reg;|
|商标|&trade;|
|乘号|&times;|
|除号|&divide;|
|元|&yen;|
|磅|&pound;|
|和号|&amp;|


## 列表
列表用来在网页上组织信息,HTML能够创建三种类型的列表:无序列表（ul）、有序列表（ol）、定义列表（dl）。

### 应用
1. 水平/垂直导航栏
2. 下拉菜单
3. 面包屑导航
4. 功能列表
5. 内容分块
6. 多级列表


## 表单
表单是一个包含表单元素的区域。 表单能够包含 input 元素,textarea、select、fieldset、legend 和 label元素。 表单使用标签(<\form>)定义。 表单用于向服务器传输数据。

|属性|说明|
|---|---|
|name|表单名称|
|action|提交地址|
|method|提交方式|
|enctype|MIME类型|
|novaildate|规定当提交表单时不对表单数据进行验证|

```html
<form name="form1" action="URL" method="get">
    用户名:<input type="text" name="uname" />
    密 码:<input type="password" name="passwd" />
</form>
```
### type属性值
|类型|	说明|
|---|---|
|reset|定义重置按钮。重置按钮会将所有表单字段重置为初始值。|
|submit|定义提交按钮。提交按钮向服务器发送数据。|
|button|定义可点击的按钮（大多与 JavaScript 使用来启动脚本）|
|checkbox|定义复选框。|
|color|	定义拾色器。|
|date|定义日期字段（带有 calendar 控件）|
|month|定义日期字段的月（带有 calendar 控件）|
|week|定义日期字段的周（带有 calendar 控件）|
|time|定义日期字段的时、分、秒（带有 time 控件）|
|file|定义输入字段和 "浏览..." 按钮，供文件上传|
|hidden|定义隐藏输入字段|
|image|定义图像作为提交按钮,必须把 src 属性 和 alt 属性 结合使用。|
|radio|定义单选按钮。|
|range|定义带有 slider 控件的数字字段。|

|输入框类型|说明|
|---|---|
|tel|定义用于电话号码的文本字段。|
|text|默认。定义单行输入字段，用户可在其中输入文本。默认是 20 个字符。|
|url|定义用于 URL 的文本字段。|
|email|定义用于 e-mail 地址的文本字段|
|number|定义带有 spinner 控件的数字字段|
|password|定义密码字段。字段中的字符会被遮蔽。|
|search|定义用于搜索的文本字段。|

### input
|属性|	说明|
|---|---|
|type	|input元素类型|
|name|	input元素的名称|
|value	|input元素的值|
|size|	input元素的宽度|
|readonly|	是否只读|
|maxlength	|输入字符的字符长度|
|disabled|	是否禁用|
|autofocus|	属性规定当页面加载时按钮应当自动地获得焦点|
|form	|位于 form 表单外的输入字段（但仍然属于 form 表单的一部分）|
|pattern	|pattern 属性规定用于验证 \<input> 元素的值的正则表达式|
|placeholder	|属性规定可描述输入字段预期值的简短的提示信息|
|list	|list 属性引用 \<datalist> 元素，其中包含 \<input> 元素的预定义选项|
|min, max, step|	最小值,最大值,如果 step="3"，则合法数字应该是 -3、0、3、6，以此类推|
|multiple|	可接受多个值的文件上传字段|
|required|	必填|


### textarea(多行文本框)

|属性|	说明|
|---|---|
|name|	元素的名称|
|rows|	指定文本框的高度|
|cols|	指定文本框的宽度|

### select(下拉列表框)

|属性|	说明|
|---|---|
|name|	下拉列表框的名称|
|size|	下拉列表框的显示行数|
|multiple|	是否多选|
|disabled|	是否禁用|
|selected|	设置默认选中的选项|
|value|	选项的值|
```html
<select name="city">
  <option value="0">请选择</option>
  <option value="bj">北京</option>
  <option value="gz">广州</option>
</select>
```
### optgroup(用于组合选项的标签)


|属性|	说明|
|---|---|
|label|	指定组合选项名称|

```html
<select name="city">
  <option value="0">请选择</option>
  <optgroup label="主要城市">
      <option value="bj">北京</option>
      <option value="gz">广州</option>
  </optgroup>
</select>
```
### fieldset(组合标签)
```html
<fieldset>
  <legend>基本资料</legend>
  <form></form>
</fieldset>
```
### lablel
lablel标签的作用是将输入项或选项及其标签文字关联起来
```html
<input type="radio" name="sex" value="1" id="male" />
<label for="male">男</label>
<input type="radio" name="sex" value="0" id="female" />
<label for="female">女</label>
```