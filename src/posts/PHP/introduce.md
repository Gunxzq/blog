---
date: 2025-04-09
order: 2
category:
  - PHP
tag:
  - PHP

# sticky: true
---


# PHP
PHP 不仅限于输出 HTML。PHP 的功能包括输出丰富的文件类型，例如图像或 PDF 文件、加密数据和发送电子邮件。还可以轻松输出任何文本，例如 JSON 或 XML。PHP 可以自动生成这些文件，并将它们保存在文件系统中，而不是将其打印出来，从而形成动态内容的服务器端缓存。

## PHP标记
PHP标记表示了一段可以被PHP解析器解析的代码。
1. 当解析一个文件时，PHP 会寻找起始和结束标记，也就是 ==\<?php== 和 ==\?>== ，这告诉 PHP 开始和停止解析二者之间的代码。
2. 此种解析方式使得 PHP 可以被嵌入到各种不同的文档中去，而任何起始和结束标记之外的部分都会被 PHP 解析器忽略。
:::important 三种PHP标记
```php
// 标准 <?php ?>
1.  <?php echo 'if you want to serve PHP code in XHTML or XML documents,use these tags'; ?>
// <?= ?> 是 <?php echo ?>的简写
2.  You can use the short echo tag to <?= 'print this string' ?>.
    It's equivalent to <?php echo 'print this string' ?>.
// 短标记 <? ?>
3.  <? echo 'this code is within short tags, but will only work '.
            'if short_open_tag is enabled'; ?>
```
:::

短标记是被默认开启的，但是也可以通过 short_open_tag( ==php.ini== ) 来直接禁用。如果 PHP 在被安装时使用了 --disable-short-tags 的配置，该功能则是被默认禁用的。
如果文件内容仅仅包含 PHP 代码，最好在文件末尾删除 PHP 结束标记。这可以避免在 PHP 结束标记之后万一意外加入了空格或者换行符，会导致 PHP 开始输出这些空白，而脚本中此时并无输出的意图。
```php
<?php
echo "Hello world";
// ... 更多代码
echo "Last statement";
// 脚本在此处结束，没有 PHP 结束标记
```

## 与HTML文档的混合
在PHP标记以外的内容都会被PHP解析器忽略，这可以使php混合其他内容。
:::important 混合HTML
```php
<p>This is going to be ignored by PHP and displayed by the browser.</p>
<?php echo 'While this is going to be parsed.'; ?>
<p>This will also be ignored by PHP and displayed by the browser.</p>
```
:::
这将如预期中的运行，因为当 PHP 解释器碰到 ?> 结束标记时就简单地将其后内容原样输出（除非马上紧接换行 - 见 指令分隔符）直到碰到下一个开始标记；例外是处于条件语句中间时，此时 PHP 解释器会根据条件判断来决定哪些输出，哪些跳过。见下例。
使用条件结构：
```php
<?php if ($expression == true): ?>
  This will show if the expression is true.
<?php else: ?>
  Otherwise this will show.
<?php endif; ?>
```
上例中 PHP 将跳过条件语句未达成的段落，即使该段落位于 PHP 开始和结束标记之外。由于 PHP 解释器会在条件未达成时直接跳过该段条件语句块，因此 PHP 会根据条件来忽略之。
要输出大段文本时，跳出 PHP 解析模式通常比将文本通过 echo 或 print 输出更有效率。
注意:
此外注意如果将 PHP 嵌入到 XML 或 XHTML 中则需要使用 ==\<?php== ==\?>== 标记以保持符合标准。


## 指令分隔符
同 C 或 Perl 一样，PHP 需要在每个语句后用分号结束指令。一段 PHP 代码中的结束标记隐含表示了一个分号；在一个 PHP 代码段中的最后一行可以不用分号结束。如果后面还有新行，则代码段的结束标记包含了行结束。
示例 #1 包含末尾换行符的结束标记的例子
```php
<?php echo "Some text"; ?>
No newline
<?= "But newline now" ?>
```

以上示例会输出：

```php
Some textNo newline
But newline now
```
进入和退出 PHP 解析的例子：

```php
<?php
    echo 'This is a test';
?>
<?php echo 'This is a test' ?>
<?php echo 'We omitted the last closing tag';
```
注意:
文件末尾的 PHP 代码段结束标记可以不要，有些情况下当使用 include 或者 require 时省略掉会更好些，这样不期望的空白符就不会出现在文件末尾，之后仍然可以输出响应标头。在使用输出缓冲时也很便利，就不会看到由包含文件生成的不期望的空白符。


## 注释
PHP 支持 C，C++ 和 Unix Shell 风格（Perl 风格）的注释。例如:
```php
<?php
    echo 'This is a test'; // 这是单行 c++ 样式注释
    /* 这是一条多行注释
       另一行也是注释 */
    echo 'This is yet another test';
    echo 'One Final Test'; # 这是单行 shell 风格的注释
?>
```
单行注释仅仅注释到行末或者当前的 PHP 代码块，视乎哪个首先出现。这意味着在 // ... ?> 或者 # ... ?> 之后的 HTML 代码将被显示出来：?> 跳出了 PHP 模式并返回了 HTML 模式，// 或 # 并不能影响到这一点。

```php
<h1>This is an <?php # echo 'simple';?> example</h1>
<p>The header above will say 'This is an  example'.</p>
```
C 风格的注释在碰到第一个 */ 时结束。要确保不要嵌套 C 风格的注释。试图注释掉一大块代码时很容易出现该错误。


```php
<?php
 /*
    echo 'This is a test'; /* 这个注释会引发问题 */
 */
?>
```