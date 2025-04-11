---
date: 2025-04-10
order: 2
category:
  - PHP
tag:
  - PHP

# sticky: true
---

# 类型

## 类型系统
PHP 的类型系统支持各种原子类型，可以组合在一起创建更加复杂的类型。其中一些类型可以写成类型声明。
### 原子类型
1. 内置类型
  1. 标量类型：
    1. bool类型
    2. int类型
    3. float类型
    4. string类型
  2. array类型：引用类型
  3. object类型
  4. resource类型
  5. never类型
  6. void类型
  7. 相对类的类型：self、parent、static
  8. 单例类型：false和true
  9. 单值类型：null
2. 用户定义的类型：使用interface、class、枚举定义的自定义类型
  1. 接口
  2. 类
  3. 枚举
3. callable类型
### 复合类型
1. 交集类型:通过实现多个接口、泛型或类型约束来实现
```php
<?php
declare(strict_types=1);

// 定义两个接口
interface Flyable {
    public function fly(): void;
}

interface Swimmable {
    public function swim(): void;
}

// 实现交集的类（同时实现两个接口）
class Duck implements Flyable, Swimmable {
    public function fly(): void {
        echo "Duck is flying!";
    }

    public function swim(): void {
        echo "Duck is swimming!";
    }
}

// 使用交集类型（通过类型检查）
function checkCapabilities(object $object): void {
    if ($object instanceof Flyable && $object instanceof Swimmable) {
        echo "This object can both fly and swim!";
    } else {
        echo "Not a valid capability!";
    }
}

// 测试
$duck = new Duck();
checkCapabilities($duck); // 输出：This object can both fly and swim!
?>
```
2. 联合类型：接受多个不同类型的值，可接受的类型之间使用 ==| 符号== 连接。如果其中一种类型是交集类型，需要使用括号括起来，在 DNF 中写成：==T|(X&Y)== 。
```php
<?php
declare(strict_types=1);

class User
{
    // 定义属性，使用联合类型（string | int | null）
    public string|int|null $id;
    public string $name;
    public float|int $age; // age 可以是整数或浮点数

    // 构造函数，强制类型约束
    public function __construct(
        string|int|null $id,
        string $name,
        float|int $age
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->age = $age;
    }

    // 方法：根据 id 类型输出不同信息
    public function printId(): void
    {
        if (is_int($this->id)) {
            echo "ID (int): " . $this->id;
        } elseif (is_string($this->id)) {
            echo "ID (string): " . $this->id;
        } else {
            echo "ID is null";
        }
    }
}

// 使用示例
$user1 = new User(123, "Alice", 25);      // int 类型的 id
$user2 = new User("user_456", "Bob", 30.5); // string 类型的 id，float 类型的 age

$user1->printId(); // 输出：ID (int): 123
$user2->printId(); // 输出：ID (string): user_456
?>
```

### 类型别名
PHP 支持两种类型别名：mixed 和 iterable，分别对应 object|resource|array|string|float|int|bool|null 和 Traversable|array 的 联合类型。
注意: PHP 不支持用户定义类型别名。

## NULL
未定义和 unset() 的变量都将解析为值 null。
null 类型只有一个值，就是不区分大小写的常量 null。
```php
// 不区分大小写
<?php $var = NULL; ?>
```

## Boolean布尔类型
bool 仅有两个值，用于表达真（truth）值，不是 true 就是 false。同样的不区分大小写。
```php
<?php
$foo = True; // 设置 $foo 为 TRUE
?>
```

## int整型
Int 可以使用十进制，十六进制，八进制或二进制表示，前面可以加上可选的符号（- 或者 +）。 可以用负运算符 来表示一个负的 int。
```js
<?php
$a = 1234; // 十进制数
$a = 0123; // 八进制数 (等于十进制 83)
$a = 0o123; // 八进制数 (PHP 8.1.0 起)
$a = 0x1A; // 十六进制数 (等于十进制 26)
$a = 0b11111111; // 二进制数字 (等于十进制 255)
$a = 1_234_567; // 整型数值 (PHP 7.4.0 以后)
?>
```
PHP 不支持无符号的 int。int 值的字长可以用常量 PHP_INT_SIZE来表示， 最大值可以用常量 PHP_INT_MAX 来表示， 最小值可以用常量 PHP_INT_MIN 表示。

### 溢出
如果给定的一个数超出了 int 的范围，将会被解释为 float。同样如果执行的运算结果超出了 int 范围，也会返回 float。

### 整数除法
PHP 没有 int 除法取整运算符，要使用 intdiv() 实现。 1/2 产生出 float 0.5。 值可以舍弃小数部分，强制转换为 int，或者使用 round() 函数可以更好地进行四舍五入。
```php
<?php
var_dump(25/7);         // float(3.5714285714286) 
var_dump((int) (25/7)); // int(3)
var_dump(round(25/7));  // float(4) 
?>
```

## Float浮点型
浮点型（也叫浮点数 float，双精度数 double 或实数 real）可以用以下任一语法定义：
```php
<?php
$a = 1.234; 
$b = 1.2e3; 
$c = 7E-10;
$d = 1_234.567; // 从 PHP 7.4.0 开始支持
?>
```

### 比较
由于内部表达方式的原因，比较两个浮点数是否相等是有问题的。不过还是有迂回的方法来比较浮点数值的。
要测试浮点数是否相等，要使用一个仅比该数值大一丁点的最小误差值。该值也被称为机器极小值（epsilon）或最小单元取整数，是计算中所能接受的最小的差别值。
$a 和 $b 在小数点后五位精度内都是相等的。
```php
<?php
$a = 1.23456789;
$b = 1.23456780;
$epsilon = 0.00001;

if(abs($a-$b) < $epsilon) {
    echo "true";
}
?>
```
### NaN 
某些数学运算会产生一个由常量 NAN 所代表的结果。此结果代表着一个在浮点数运算中未定义或不可表述的值。任何拿此值与其它任何值（除了 true）进行的松散或严格比较的结果都是 false。
由于 NAN 代表着任何不同值，不应拿 NAN 去和其它值进行比较，包括其自身，应该用 is_nan() 来检查。

## string
一个字符串 string 就是由一系列的字符组成，其中每个字符等同于一个字节。这意味着 PHP 只能支持 256 的字符集，因此不支持 Unicode 。
一个字符串可以用 4 种方式表达：
1. 单引号
2. 双引号
3. heredoc 语法结构
4. nowdoc 语法结构

### 单引号
在单引号字符串中的 ==变量== 和 ==特殊字符== 的转义序列将不会被替换。
```php
<?php
echo 'this is a simple string';

// 可以断行
echo 'You can also have embedded newlines in
strings this way as it is
okay to do';

// 对单引号转义
echo 'Arnold once said: "I\'ll be back"';

// 反斜杠转义
echo 'You deleted C:\\*.*?';

// 输出： You deleted C:\*.*?
echo 'You deleted C:\*.*?';

// 输出： This will not expand: \n a newline
echo 'This will not expand: \n a newline';

// 输出： Variables do not $expand $either
echo 'Variables do not $expand $either';
?>
```

### 双引号
PHP会对双引号中的特殊字符进行解析,对于包含的变量，具备模板字符串的能力
|序列|含义|
|---|---|
|\n|换行|
|\r|	回车|
|\t|	水平制表符|
|\v|	垂直制表符|
|\e|	Escape|
|\f|	换页|
|\\\\ |	反斜线|
|\$|	美元标记|
|\\"|	双引号|
|\ |八进制|
|\x|十六进制|
|\u|Unicode|

### Heredoc结构
由 ==<<<== 标识符 ==内容== 标识符包裹的内容。
在 heredoc 结构中单引号不用被转义，但是上文中列出的转义序列还可以使用。变量将被替换，但在 heredoc 结构中含有复杂的变量时要像 string 一样格外小心。
```php
<?php
$name = 'MyName';

echo <<<EOT
My name is "$name". I am printing some.
Now, I am printing some.
This should print a capital 'A': \x41
EOT;
?>
// 输出
// My name is "MyName". I am printing some Foo.
// Now, I am printing some Bar2.
// This should print a capital 'A': A
```

### Nowdoc结构
类似于单引号，不会发生转义和插值。
```php
<?php
echo <<<'EOD'
Example of string spanning multiple lines
using nowdoc syntax. Backslashes are always treated literally,
e.g. \\ and \'.
EOD;
// 以上示例会输出：
Example of string spanning multiple lines
using nowdoc syntax. Backslashes are always treated literally,
e.g. \\ and \'.
```


## array数组
PHP 中的 array 实际上是一个有序映射。映射是一种把 values 关联到 keys 的类型。
:::important 声明
```php
// 关联数组
$array = ["foo" => "bar","bar" => "foo",];
// 键值只支持int和string，且转换后的键值后者覆盖前者
$array = array(1=> "a","1"  => "b",1.5  => "c",true => "d",);
// 未提供键值，为上一个+1
$array = array("a","b",6 => "c","d",);
// 对于负数键值也成立，PHP 8.3.0 之前，分配负整数 key n 会将下一个 key 分配给 0
$array = [];
$array[-5] = 1;
$array[] = 2;
```
:::


### 访问
使用 ==[]== 来访问键值对
```php
$arr = array(5 => 1, 12 => 2);
// 添加
$arr[] = 56;   
// 添加
$arr["x"] = 42; 

unset($arr[5]); // 从数组中删除元素
unset($arr);
```
最大整数键名目前不需要存在于 array 中。 它只要在上次 array 重新生成索引后曾经存在于 array 就行了
```php
<?php
// 创建一个简单的数组
$array = array(1, 2, 3, 4, 5);
print_r($array);

// 现在删除其中的所有元素，但保持数组本身不变:
foreach ($array as $i => $value) {
    unset($array[$i]);
}
print_r($array);

// 添加一个单元（注意新的键名是 5，而不是你可能以为的 0）
$array[] = 6;
print_r($array);

// 重新索引：
$array = array_values($array);
$array[] = 7;
print_r($array);
?>
```
### 数组解构
使用 []或者 list() 语言结构解包数组
```php
<?php
$source_array = ['foo', 'bar', 'baz'];

[$foo, $bar, $baz] = $source_array;

echo $foo;    // 打印 "foo"
echo $bar;    // 打印 "bar"
echo $baz;    // 打印 "baz"
?>
```
多维数组
```php
$source_array = [[1, 'John'],[2, 'Jane'],];

foreach ($source_array as [$id, $name]) {
    // 这里是 $id 和 $name 的逻辑
}
```
如果变量未提供，数组元素将会被忽略。数组解包始终从索引 0 开始。
```php
$source_array = ['foo', 'bar', 'baz'];

// 将索引 2 的元素分配给变量 $baz
[, , $baz] = $source_array;

echo $baz;    // 打印 "baz"
```
自 PHP 7.1.0 起，也可以解包关联数组。这在数字索引数组中更容易选择正确的元素，因为可以显式指定索引。
```PHP
$source_array = ['foo' => 1, 'bar' => 2, 'baz' => 3];

// 将索引 'baz' 处的元素分配给变量 $three
['baz' => $three] = $source_array;

echo $three;    // 打印 3

$source_array = ['foo', 'bar', 'baz'];

// 将索引 2 处的元素分配给变量 $baz
[2 => $baz] = $source_array;

echo $baz;    // 打印 "baz"
```
数组解包可以方便的用于两个变量交换。
```php
<?php
$a = 1;
$b = 2;

[$b, $a] = [$a, $b];

echo $a;    // 打印 2
echo $b;    // 打印 1
?>
```

### 数组展开
在 array 定义时，用 ... 前缀的一个 array 可以被展开到当前位置。 只有实现了 Traversable 的数组和对象才能被展开。
```php
<?php
// 使用简短的数组语法。
// 亦可用于 array() 语法
$arr1 = [1, 2, 3];
$arr2 = [...$arr1]; //[1, 2, 3]
$arr3 = [0, ...$arr1]; //[0, 1, 2, 3]
$arr4 = [...$arr1, ...$arr2, 111]; //[1, 2, 3, 1, 2, 3, 111]
$arr5 = [...$arr1, ...$arr1]; //[1, 2, 3, 1, 2, 3]

function getArr() {
  return ['a', 'b'];
}
$arr6 = [...getArr(), 'c' => 'd']; //['a', 'b', 'c' => 'd']
?>
```
key 为字符时，后面的字符键会覆盖之前的字符键；key 为 integer 时则会重新编号：
:::important 三种PHP标记
在 PHP 8.1 之前，带有 string 键的 array 无法解包
:::



### 拷贝
可以通过引用传递 array 的值来直接更改数组的值。
```php
<?php
foreach ($colors as &$color) {
    // $clolor
    $color = mb_strtoupper($color);
}
unset($color); /* 确保后面对$color 的写入不会修改最后一个数组元素 */

print_r($colors);
?>
```

## object
使用 ==class== 定义类， ==new== 关键字实例化为对象。
```php
class foo
{
    function do_foo()
    {
        echo "Doing foo."; 
    }
}

$bar = new foo;
$bar->do_foo();
```

## 枚举(PHP 8 >= 8.1.0)
枚举是在类、类常量基础上的约束层， 目标是提供一种能力：定义包含可能值的封闭集合类型。
```php
<?php
enum Suit
{
    case Hearts;
    case Diamonds;
    case Clubs;
    case Spades;
}

function do_stuff(Suit $s)
{
    // ...
}

do_stuff(Suit::Spades);
?>
```

## Resource 资源类型
资源 resource 是一种特殊变量，保存了到外部资源的一个引用。资源是通过专门的函数来建立和使用的。
资源类型变量保存有为打开文件、数据库连接、图形画布区域等的特殊句柄。

## Callback / Callable 类型
回调可以通过 callable 类型声明来表示。
一些函数如 call_user_func() 或 usort() 可以接受用户自定义的回调函数作为参数。回调函数不止可以是简单函数，还可以是对象的方法，包括静态类方法。

## Mixed
在类型理论中，mixed 是顶级类型。这意味着其它所有类型都是它的子类型。

## void
void 是仅用于返回类型，表示函数不返回值，但该函数仍可能会终止。因此，它不能成为联合类型声明的一部分。自 PHP 7.1.0 起可用。

## Never
never 是仅用于返回的类型，表示函数不会终止。这意味着它要么调用 exit()，要么抛出异常，要么无限循环。因此，它不能是联合类型声明的一部分。自 PHP 8.1.0 起可用。


## 可迭代c'c'c'c'cccccc
Iterable 是内置编译时 array|Traversable 的类型别名。从 PHP 7.1.0 到 PHP 8.2.0 之间的描述来看，iterable 是内置伪类型，充当上述类型别名，也可以用于类型声明。iterable 类型可用于 foreach 或在生成器中使用 yield from。