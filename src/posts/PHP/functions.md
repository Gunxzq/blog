---
date: 2025-04-11
order: 2
category:
  - PHP
tag:
  - PHP

# sticky: true
---

# 函数


## 函数参数
函数在实际调用之前，值参数( ==实参== )是从左向右求值的（及早求值），并将结果赋值给函数的参数( ==形参== )。
函数参数使用尾部逗号
```php
function takes_many_args(
    $first_arg,
    $second_arg,
    $a_very_long_argument_name,
    $arg_with_default = 5,
    // 在 8.0.0 之前，这个尾部的逗号是不允许的。
    $again = 'a default string', 
)
{}
```
### 引用传递
默认情况下，函数参数值通过值传递（因而即使在函数内部改变参数值，它并不会改变函数外部的值）。如果希望允许函数修改它的参数值，必须通过引用传递。
如果想要函数的参数值始终通过引用传递，可以在函数定义中该参数的前面加上符号 &：
```php
function add_some_extra(&$string)
{
    $string .= 'and something extra.';
}
$str = 'This is a string, ';
add_some_extra($str);
echo $str;    // 输出“This is a string, and something extra.”
```

### 默认参数
使用类似分配变量的语法定义参数的默认值。仅当参数未传递值时才使用默认值；==注意传递null不会分配默认值== 。
```php
unction makeyogurt($flavour, $container = "bowl")
{
    return "Making a $container of $flavour yogurt.\n";
}

echo makeyogurt("raspberry"); // "raspberry" 是 $flavour
```

### 可变数量的参数值列表
参数列表可能包含 ... 记号，表示该函数接受可变数量的参数值。参数值将作为 array 传递到指定变量中：
```php
function sum(...$numbers) {
    $acc = 0;
    foreach ($numbers as $n) {
        $acc += $n;
    }
    return $acc;
}

echo sum(1, 2, 3, 4);
```

### 命名参数(ph8)
PHP 8.0.0 开始引入了命名参数作为现有位置参数的扩展。命名参数允许根据参数名而不是参数位置向函数传参。这使得参数的含义自成体系，参数与顺序无关，并允许任意跳过默认值。
命名参数通过在参数名前加上冒号来传递。允许使用保留关键字作为参数名。
```php
// 参数名必须是一个标识符，不允许动态指定。
myFunction(paramName: $value);
array_foobar(array: $value);

// 不支持。
function_name($variableStoringParamName: $value);
```
命名参数也可以与位置参数相结合使用。此种情况下，命名参数必须在位置参数之后。也可以只指定一个函数的部分可选参数，而不考虑它们的顺序。
```php
htmlspecialchars($string, double_encode: false);
// 等价于
htmlspecialchars($string, ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML401, 'UTF-8', false);
```
自 PHP 8.1.0 起，可以在解包参数后面使用命名参数。命名参数不能覆盖已解包的参数。
```php
function foo($a, $b, $c = 3, $d = 4) {
  return $a + $b + $c + $d;
}

var_dump(foo(...[1, 2], d: 40)); // 46
var_dump(foo(...['b' => 2, 'a' => 1], d: 40)); // 46

var_dump(foo(...[1, 2], b: 20)); // Fatal error。命名参数 $b 覆盖之前的参数
```

## 可变函数
如果一个变量名后有圆括号，PHP 将寻找与变量的值同名的函数，并且尝试执行它。可变函数可以用来实现包括回调函数，函数表在内的一些用途。
```php
class Foo
{
    function Variable(){
        $name = 'Bar';
        $this->$name(); // 调用 Bar() 方法
    }

    function Bar(){
        echo "This is Bar";
    }
}

$foo = new Foo();
$funcname = "Variable";
$foo->$funcname();  // 调用 $foo->Variable()
```
当调用静态方法时，函数调用要比静态属性优先：
```php
class Foo
{
    static $variable = 'static property';
    static function Variable()
    {
        echo 'Method Variable called';
    }
}
echo Foo::$variable; // 打印 'static property'。在该作用域中需要 $variable。
$variable = "Variable";
Foo::$variable();  // 在该作用域中读取 $variable 调用 $foo->Variable()。
```

## 匿名函数
匿名函数（Anonymous functions），也叫闭包函数（closures），允许 临时创建一个没有指定名称的函数。最经常用作回调函数 callable参数的值。当然，也有其它应用的情况。
```php
$greet = function($name) {
    printf("Hello %s\r\n", $name);
};
$greet('World');
$greet('PHP');
```
闭包可以从父作用域中继承变量。 任何此类变量都应该用 use 语言结构传递进去。 PHP 7.1 起，不能传入此类变量： superglobals、 $this 或者和参数重名。 返回类型声明必须放在 use 子句的 后面 。
```php
$message = 'hello';
// 没有 "use"
$example = function () {
    var_dump($message);
};
$example();     //Notice: Undefined variable: message in /example.php on line 6 NULL

// 继承 $message
$example = function () use ($message) {
    var_dump($message);
};
$example();     //string(5) "hello"

// 当函数被定义而不是被调用的时候继承变量的值
$message = 'world';
$example();     //string(5) "hello"

// 重置 message
$message = 'hello';

// 通过引用继承
$example = function () use (&$message) {
    var_dump($message);
};
$example();     //string(5) "hello"

// 父级作用域改变的值反映在函数调用中
$message = 'world';
$example();     //string(5) "world"

// 闭包函数也可以接受常规参数
$example = function ($arg) use ($message) {
    var_dump($arg . ' ' . $message);
};
$example("hello");  string(11) "hello world"

// 返回类型在 use 子句的后面
$example = function () use ($message): string {
    return "hello $message";
};
var_dump($example());   //string(11) "hello world"
```