---
date: 2025-04-11
order: 2
category:
  - PHP
tag:
  - PHP

# sticky: true
---

# 流程控制

## 替代语法
PHP 提供了一些流程控制的替代语法，包括 if，while，for，foreach 和 switch。
替代语法的基本形式是把左花括号（{）换成冒号（:），把右花括号（}）分别换成 endif;，endwhile;，endfor;，endforeach; 以及 endswitch;。
```php
<?php if ($a == 5): ?>
A is equal to 5
<?php endif; ?>
```
替代语法同样可以用在 else 和 elseif 中。下面是一个包括 elseif 和 else 的 if 结构用替代语法格式写的例子：
```php
if ($a == 5):
    echo "a equals 5";
    echo "...";
elseif ($a == 6):
    echo "a equals 6";
    echo "!!!";
else:
    echo "a is neither 5 nor 6";
endif;
```

## match(php8)
match 表达式基于值的一致性进行分支计算。 match表达式和 switch 语句类似， 都有一个表达式主体，可以和多个可选项进行比较。 
与 switch 不同点是，它会像三元表达式一样求值。 且他的比较是严格比较.
match 表达式结构
```php
$return_value = match (subject_expression) {
    single_conditional_expression => return_expression,
    conditional_expression1, conditional_expression2 => return_expression,
    // 之前的条件都匹配时运行
    default =>return_expression,
};
```
与比较运算符的例子
```php
$age = 18;
$output = match (true) {
    $age < 2 => "Baby",
    $age < 13 => "Child",
    $age <= 19 => "Teenager",
    $age >= 40 => "Old adult",
    $age > 19 => "Young adult",
};

var_dump($output);
// 输出 string(8) "Teenager"
```
当多个分支表达式右侧相同时，就可以用这种缩写。
```php
$result = match ($x) {
    // 匹配分支：
    $a, $b, $c => 5,
    // 等同于以下三个分支：
    $a => 5,
    $b => 5,
    $c => 5,
};
```
:::important
match 表达式必须详尽列出所有情况(起码要有一个满足的)。 如果主体表达式不能被任意分支条件处理， 会抛出 UnhandledMatchError。
:::

## declare(PHP 4, PHP 5, PHP 7, PHP 8)
declare 结构用来设定一段代码的执行指令。
directive 部分允许设定 declare 代码段的行为。 目前只认识三个指令：
1. ticks
2. encoding
3. strict_types
因为本指令是在文件编译时处理的，所以指令只接受字面量的值。 无法使用变量和常量。
```php
// 这样是有效的：
declare(ticks=1);

// 这样是无效的：
const TICK_VALUE = 1;
declare(ticks=TICK_VALUE);
```

### Ticks
Tick（时钟周期）是一个在 declare 代码段中解释器每执行 N 条可计时的低级语句就会发生的事件。N 的值是在 declare 中的 directive 部分用 ticks=N 来指定的。
在每个 tick 中出现的事件是由 register_tick_function() 来指定的。
```php
declare(ticks=1);

// 不是所有语句都可计时。通常条件表达式和参数表达式都不可计时。
// 每次 tick 事件都会调用该函数
function tick_handler()
{
    echo "tick_handler() called\n";
}

register_tick_function('tick_handler'); // 引起 tick 事件

$a = 1; // 引起 tick 事件

if ($a > 0) {
    $a += 2; // 引起 tick 事件
    print $a; // 引起 tick 事件
}
```

### Encoding
用 encoding 指令来对每段脚本指定其编码方式。
```php
declare(encoding='ISO-8859-1');
// 在这里写代码
```