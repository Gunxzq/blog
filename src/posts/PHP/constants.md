---
date: 2025-04-11
order: 2
category:
  - PHP
tag:
  - PHP

# sticky: true
---

# 常量
可以使用 const 关键字或 define() 函数两种方法来定义一个常量。个常量一旦被定义，就不能再改变或者取消定义。
:::important
在 PHP 8.0.0 之前，使用 define() 定义的常量可能不区分大小写且可以包含保留字或非常规名称的常量。
这类常量可以通过 constant() 函数来获取名称，但是非常不推荐这种用法。
:::
1. 常量不需要使用 ==$== 来访问。
2. 如果常量名是动态的，也可以用函数 constant() 来获取常量的值。
3. 用 get_defined_constants() 可以获得所有已定义的常量列表。
4. 如果要检查是否定义了某常量，请使用 defined() 函数。
```php
define("CONSTANT", "Hello world.");
echo CONSTANT; // 输出 "Hello world."
echo Constant; // 抛出错误：未定义的常量 "Constant"
               // 在 PHP 8.0.0 之前，输出 "Constant" 并发出一个提示级别错误信息
// 简单的标量值
const CONSTANT = 'Hello World';
// .是替代性的 字符连接符号
const ANOTHER_CONST = CONSTANT.'; Goodbye World';
// 常量数组
define('ANIMALS', array(
    'dog',
    'cat',
    'bird'
));
```
:::important
和使用 define() 来定义常量相反的是，使用 const 关键字定义常量必须处于最顶端的作用域，因为用此方法是在编译时定义的。这就意味着不能在函数内，循环内以及 if 或 try/catch 语句之内用 const 来定义常量。
:::

## 预定义常量
PHP 向它运行的任何脚本提供了大量的预定义常量。不过很多常量都是由不同的扩展库定义的，只有在加载了这些扩展库时才会出现，或者动态加载后，或者在编译时已经包括进去了。


## 魔术常量
一些魔术常量会根据使用位置而变化。例如 \__LINE__ 的值取决于它在脚本中使用的行。所有这些“魔术”常量都在编译时解析，而常规常量则在运行时解析。这些特殊的常量不区分大小写，如下：
|名字|	说明|
|---|---|
|\__LINE__|	文件中的当前行号。|
|\__FILE__|	文件的完整路径和文件名。如果用在被包含文件中，则返回被包含的文件名。|
|\__DIR__|	文件所在的目录。如果用在被包括文件中，则返回被包括的文件所在的目录。它等价于 dirname(\__FILE__)。除非是根目录，否则目录中名不包括末尾的斜杠。|
|\__FUNCTION__|	当前函数的名称。匿名函数则为 {closure}。|
|\__CLASS__|	当前类的名称。类名包括其被声明的作用域（例如 Foo\Bar）。当用在 trait 方法中时，\__CLASS__ 是调用 trait 方法的类的名字。|
|\__TRAIT__|	Trait 的名字。Trait 名包括其被声明的作用域（例如 Foo\Bar）。|
|\__METHOD__|	类的方法名。|
|\__PROPERTY__|	仅在属性挂钩内有效。等同于属性的名称。|
|\__NAMESPACE__|	当前命名空间的名称。|
|ClassName::class|	完整的类名。|