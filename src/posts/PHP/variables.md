---
date: 2025-04-11
order: 2
category:
  - PHP
tag:
  - PHP

# sticky: true
---

# 变量
变量用一个美元符号后面跟变量名来表示。变量名是区分大小写的。
有效的变量名由字母（A-Z、a-z 或 128 到 255 之间的字节）或者下划线开头，后面跟上任意数量的字母，数字，或者下划线。 



## 引用赋值
新的变量简单的引用了原始变量。改动新的变量将影响到原始变量，反之亦然。
```php
<?php
$foo = 'Bob';              // 将 'Bob' 赋给 $foo
$bar = &$foo;              // 通过 $bar 引用 $foo
$bar = "My name is $bar";  // 修改 $bar 变量
echo $bar;
echo $foo;                 // $foo 的值也被修改
?>
```

## 预定义变量
PHP 提供了许多 预定义变量。PHP 提供了一套附加的预定数组，这些数组变量包含了来自 web 服务器（如果可用），运行环境，和用户输入的数据。这些数组在每个作用域内自动可用。因此通常被称为自动全局变量（autoglobals）或者超全局变量（superglobals）。


## 作用域
PHP 有函数作用域和全局作用域。在函数之外定义的任何变量都仅限于全局作用域。
当包含文件时，该文件中的代码继承了包含语句所在行的变量作用域。
```php
<?php
$a = 1;
include 'b.inc'; // 变量 $a 将在 b.inc 内可用
?>
```
在命名函数或匿名函数内创建的任何变量都仅限于函数主体的作用域。然而，箭头函数会绑定父级作用域中的变量，使其在函数体内可用。
如果在函数内部 include 文件，那么包含文件中的变量将如同在调用函数内部定义一样可用。

## global
global 关键字用于将变量从全局作用域绑定到局部作用域。该关键字可以与变量列表或单个变量一起使用。
将创建引用同名全局变量的局部变量。如果全局变量不存在，则将在全局作用域内创建该变量并赋值为 null。
```php
$a = 1;
$b = 2;

function Sum()
{
    global $a, $b;
    $b = $a + $b;
}

Sum();
echo $b;
```
访问变量的第二个办法，是用特殊的 PHP 自定义 $GLOBALS 数组。
```php
$a = 1;
$b = 2;

function Sum()
{
    $GLOBALS['b'] = $GLOBALS['a'] + $GLOBALS['b'];
}

Sum();
echo $b;
```
$GLOBALS 是一个关联数组，每一个变量为一个元素，键名对应变量名，值对应变量的内容。$GLOBALS 之所以在全局作用域内存在，是因为 $GLOBALS 是一个超全局变量。

## static
变量作用域的另一个重要特性是 static 变量。静态变量仅在局部函数作用域中存在，但当程序执行离开此作用域时，其值并不丢失。
```php
function test()
{
    // a有着局部作用域，但生命周期极长
    static $a = 0;
    echo $a;
    $a++;
}
```
在 PHP 8.3.0 之前，静态变量只能使用常量表达式进行初始化。自 PHP 8.3.0 起，还允许使用动态表达式（例如函数调用）：
```php
function foo(){
    static $int = 0;          // 正确
    static $int = 1+2;        // 正确
    static $int = sqrt(121);  // 自 PHP 8.3.0 起正确

    $int++;
    echo $int;
}
```

## 可变变量名
有时候使用可变变量名是很方便的。就是说，一个变量的变量名可以动态的设置和使用。
一个可变变量获取了一个普通变量的值作为这个可变变量的变量名。
```php
// $a 的内容是“hello”并且 $hello 的内容是“world”
$a = 'hello';
$$a = 'world';
// 
echo "$a {$$a}";
echo "$a $hello";
```

## 来自PHP之外的变量

### HTML表单（GET 和 POST）
当一个表单提交给 PHP 脚本时，表单中的信息会自动在脚本中可用。有几个方法访问此信息，例如：
```html
<form action="foo.php" method="POST">
    Name:  <input type="text" name="username"><br />
    Email: <input type="text" name="email"><br />
    <input type="submit" name="submit" value="Submit me!" />
</form>
```
只有两种方法可以访问 HTML 表单中的数据。以下列出了当前有效的方法：
```php
echo $_POST['username'];
echo $_REQUEST['username'];
```
使用 GET 表单也类似，只不过要用适当的 GET 预定义变量。GET 也适用于 QUERY_STRING（URL 中在“?”之后的信息）。
因此，举例说，http://www.example.com/test.php?id=3 包含有可用 $_GET['id'] 来访问的 GET 数据。
:::important 
变量名中的点和空格被转换成下划线。例如 <input name="a.b" /> 变成了 $_REQUEST["a_b"]。
:::
PHP 也理解表单变量上下文中的数组。例如可以将相关的变量编成组，或者用此功能从多选输入框中取得值。例如，将表单 POST 给自己并在提交时显示数据：
```php
<?php
if ($_POST) {
    echo '<pre>';
    // htmlspecialchars将特定的·html字符转为HTML实体字符
    echo htmlspecialchars(print_r($_POST, true));
    echo '</pre>';
}
?>
<form action="" method="post">
    Name:  <input type="text" name="personal[name]" /><br />
    Email: <input type="text" name="personal[email]" /><br />
    Beer: <br />
    <select multiple name="beer[]">
        <option value="warthog">Warthog</option>
        <option value="guinness">Guinness</option>
        <option value="stuttgarter">Stuttgarter Schwabenbräu</option>
    </select><br />
    <input type="submit" value="submit me!" />
</form>
```
:::important 
如果外部变量名以有效的数组语法开头，则将会忽略尾随字符。例如， <\input name="foo[\bar]baz">  变为 $_REQUEST \['foo']['bar']。
:::

IMAGE SUBMIT 变量名
当提交表单时，可以用一幅图像代替标准的提交按钮，用类似这样的标记：
```html
<input type="image" src="image.gif" name="sub" />
```
当用户点击到图像中的某处时，相应的表单会被传送到服务器，并加上两个变量 sub_x 和 sub_y。
它们包含了用户点击图像的坐标。有经验的用户可能会注意到被浏览器发送的实际变量名包含的是一个点而不是下划线（即 sub.x 和 sub.y），但 PHP 自动将点转换成了下划线。

### HTTP Cookie
Cookies 是一种在远端浏览器端存储数据并能追踪或识别再次访问的用户的机制。可以用 setcookie() 函数设定 cookies。
Cookies 是 HTTP 信息头中的一部分，因此 SetCookie 函数必须在向浏览器发送任何输出之前调用。
对于 header() 函数也有同样的限制。Cookie 数据会在相应的 cookie 数据数组中可用，例如 $_COOKIE 和 $_REQUEST。

如果要将多个值赋给单个 cookie 变量，可以将其赋成数组。例如：
```php
<?php
  setcookie("MyCookie[foo]", 'Testing 1', time()+3600);
  setcookie("MyCookie[bar]", 'Testing 2', time()+3600);
?>
```
尽管 MyCookie 在脚本中是单个数组，这将会建立两个单独的 cookie。如果只需为一个 cookie 设定多个值，考虑先在值上使用 serialize() 或 explode()。

注意，除非路径或者域不同，cookie 将替换浏览器中先前的同名 cookie。因此对于购物车程序，可以保留一个计数器并一起传递，即
```php
if (isset($_COOKIE['count'])) {
    $count = $_COOKIE['count'] + 1;
} else {
    $count = 1;
}
setcookie('count', $count, time()+3600);
setcookie("Cart[$count]", $item, time()+3600);
```
### 变量名中的点
通常，PHP 不会改变传递给脚本中的变量名。然而应该注意到点（句号）不是 PHP 变量名中的合法字符。
```php
<?php
$varname.ext;  /* 非法变量名 */
?>
```
这时，解析器看到是一个名为 $varname 的变量，后面跟着一个字符串连接运算符，后面跟着一个裸字符串（即没有加引号的字符串，且不匹配任何已知的健名或保留字）'ext'。很明显这不是想要的结果。
出于此原因，要注意 PHP 将会自动将变量名中的点替换成下划线。


### 确定变量类型 
因为 PHP 会判断变量类型并在需要时进行转换（通常情况下），因此在某一时刻给定的变量是何种类型并不明显。
PHP 包括几个函数可以判断变量的类型，例如：gettype()，is_array()，is_float()，is_int()，is_object() 和 is_string()。

HTTP 是一种文本协议，大多数（可能不是全部）超全局数组中的内容（如 $_POST 和 $_GET）将保留为字符串。PHP 不会尝试将值转换为特定类型。
在下面的示例中，$_GET["var1"] 将包含字符串“null”，而 $_GET["var2"] 将包含字符串“123”。
```php
/index.php?var1=null&var2=123
```



