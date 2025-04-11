---
date: 2025-04-11
order: 2
category:
  - PHP
tag:
  - PHP

# sticky: true
---

# 运算符

## 位运算
|例子|名称|结果|
|---|---|---|
|$a & $b|And（按位与）|	将把 $a 和 $b 中都为 1 的位设为 1。|
|$a \| $b|Or（按位或）	|将把 $a 和 $b 中任何一个为 1 的位设为 1。|
|$a ^ $b|Xor（按位异或）| 将把 $a 和 $b 中一个为 1 另一个为 0 的位设为 1。|
|~ $a|Not（按位取反）	|将 $a 中为 0 的位设为 1，反之亦然。|
|$a << $b|	Shift left（左移）|	将 $a 中的位向左移动 $b 次（每一次移动都表示“乘以 2”）。|
|$a >> $b|	Shift right（右移）|	将 $a 中的位向右移动 $b 次（每一次移动都表示“除以 2”）。|

## 比较运算
|例子|	名称|	结果|
|---|---|---|
|$a == $b	|等于|	true，如果类型转换后 $a 等于 $b。|
|$a === $b	|全等|	true，如果 $a 等于 $b，并且它们的类型也相同。|
|$a != $b	|不等|	true，如果类型转换后 $a 不等于 $b。|
|$a <> $b	|不等|	true，如果类型转换后 $a 不等于 $b。|
|$a !== $b	|不全等|	true，如果 $a 不等于 $b，或者它们的类型不同。|
|$a < $b	|小于|	true，如果 $a 严格小于 $b。|
|$a > $b	|大于|	true，如果 $a 严格大于 $b。|
|$a <= $b	|小于等于|	true，如果 $a 小于或者等于 $b。|
|$a >= $b	|大于等于|	true，如果 $a 大于或者等于 $b。|
|$a <=> $b	|太空船运算符（组合比较符）|	当$a小于、等于、大于 $b时 分别返回一个小于、等于、大于0的 int 值。|

### 三元表达式
“?:”（或三元）运算符 。
```php
// 三元运算符的例子
$action = (empty($_POST['action'])) ? 'default' : $_POST['action'];

// 以上等同于以下的  if/else 语句
if (empty($_POST['action'])) {
    $action = 'default';
} else {
    $action = $_POST['action'];
}
```
:::important
表达式 expr1 ?: expr3 等同于如果 expr1 求值为 true 时返回 expr1 的结果，否则返回 expr3。expr1 在这里仅执行一次。
:::
在 PHP 8.0.0 之前，三元运算符是从左到右执行的， 而大多数其他编程语言是从右到左的。 自 PHP 7.4.0 起，弃用依靠左联。 PHP 8.0.0 起，三元运算符是非关联的。
```php
// 乍看起来下面的输出是 'true',实际输出是't'，因为在 PHP 8.0.0 之前三元运算符是左联的
echo (true ? 'true' : false ? 't' : 'f');

// 下面是与上面等价的语句，但更清晰
echo ((true ? 'true' : 'false') ? 't' : 'f');
```
### NULL合并
```php
// NULL 合并运算符的例子
$action = $_POST['action'] ?? 'default';

// 以上例子等同于于以下 if/else 语句
if (isset($_POST['action'])) {
    $action = $_POST['action'];
} else {
    $action = 'default';
}
```
## 错误控制
PHP 支持一个错误控制运算符：@。当将其放置在一个 PHP 表达式之前，该表达式可能产生的任何错误诊断都被抑制。
如果用 set_error_handler() 设定了自定义的错误处理函数，即使诊断信息被抑制，也仍然会被调用。
error_get_last() 返回数组中的 "message" 元素储存了表达式产生的任意错误信息。 此函数的返回结果会随着每次错误的发生而相应变化，所以需要尽早检查。
```php
/* 故意文件错误 */
$my_file = @file ('non_existent_file') or
    die ("Failed opening file: error was '" . error_get_last()['message'] . "'");

// 这适用于所有表达式，而不仅仅是函数：
$value = @$cache[$key];
// 如果索引 $key 不存在，则不会发出通知。
```
:::important
@ 运算符只对 表达式 有效。 对新手来说一个简单的规则就是：如果能从某处获得值，就能在它前面加上 @ 运算符。
例如，可以把它放在变量，函数调用，某些语言构造调用（例如 include ）等等之前。 
不能把它放在函数或类的定义之前，也不能用于条件结构例如 if 和 foreach 等。
:::

## 执行运算符
PHP 支持一个执行运算符：反引号（``）。
PHP 将尝试将反引号中的内容作为 shell 命令来执行，并将其输出信息返回。
使用反引号运算符“`”的效果与函数 shell_exec() 相同。
```php
$output = `ls -al`;
echo "<pre>$output</pre>";
```

:::important
关闭了 shell_exec() 时反引号运算符是无效的。
:::