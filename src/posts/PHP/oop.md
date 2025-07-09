---
date: 2025-04-22
order: 2
category:
  - PHP
tag:
  - PHP

# sticky: true
---

# class
自 PHP 8.4.0 起，弃用使用单个下划线 _ 作为类名。一个类可以包含有属于自己的 常量，变量（称为“属性”）以及函数（称为“方法”）。
```php
<?php
class SimpleClass
{
    // 声明属性
    public $var = 'a default value';

    // 声明方法
    public function displayVar() {
        echo $this->var;
    }
}
?>
```
当一个方法在类定义内部被调用时，有一个可用的伪变量 $this。$this 是一个到当前对象的引用。

### new实例化
如果一个变量包含一个类名的 string 和 new 时，将创建该类的一个新实例。 如果该类属于一个命名空间，则必须使用其完整名称。如果没有参数要传递给类的构造函数，类名后的括号则可以省略掉。


### 属性和方法
类的属性和方法存在于不同的“命名空间”中，这意味着同一个类的属性和方法可以使用同样的名字。
如果你的类属性被分配给一个 匿名函数 你将无法直接调用它。因为访问类属性的优先级要更高，在此场景下需要用括号包裹起来调用。
```php
class Foo
{
    public $bar;

    public function __construct() {
        $this->bar = function() {
            return 42;
        };
    }
}

$obj = new Foo();

echo ($obj->bar)(), PHP_EOL;
```

### 构造函数
PHP 允许开发者在一个类中定义一个方法作为构造函数（ ==本质上他只是个普通函数== ）。
具有构造函数的类会在每次创建新对象时先调用此方法，所以非常适合在使用对象之前做一些初始化工作。
::: important
如果子类中定义了构造函数则不会隐式调用其父类的构造函数。要执行父类的构造函数，需要在子类的构造函数中调用 **parent::__construct()**。如果子类没有定义构造函数则会如同一个普通的类方法一样从父类继承（假如没有被定义为 **private** 的话）。
:::
```php
class BaseClass {
    function __construct() {
        print "In BaseClass constructor\n";
    }
}

class SubClass extends BaseClass {
    function __construct() {
        parent::__construct();
        print "In SubClass constructor\n";
    }
}

class OtherSubClass extends BaseClass {
    // 继承 BaseClass 的构造函数
}

// In BaseClass constructor
$obj = new BaseClass();

// In BaseClass constructor
// In SubClass constructor
$obj = new SubClass();

// In BaseClass constructor
$obj = new OtherSubClass();
```

## 继承
一个类可以在声明中用 extends 关键字继承另一个类的方法和属性。PHP 不支持多重继承，一个类只能继承一个基类。

被继承的方法和属性可以通过用同样的名字重新声明被覆盖。但是如果父类定义方法或者常量时使用了 final，则不可被覆盖。可以通过 parent:: 来访问被覆盖的方法或属性。

:::important
从 PHP 8.1.0 起，常量可以声明为 final。
:::

```php
class ExtendClass extends SimpleClass
{
    // 同样名称的方法，将会覆盖父类的方法
    function displayVar()
    {
        echo "Extending class\n";
        parent::displayVar();
    }
}

$extended = new ExtendClass();
$extended->displayVar();
```
### 签名覆盖规则
当覆盖（override）方法时，签名必须兼容父类方法。强制参数可以改为可选参数；添加的新参数只能是可选；放宽可见性而不是继续限制。
==除了构造方法和私有方法==

## readonly
自 PHP 8.2.0 起，可以使用 readonly 修饰符来标记类。将类标记为 readonly 只会向每个声明的属性添加 readonly 修饰符并禁止创建动态属性。
:::important
无类型的属性和静态属性不能用 readonly 修饰符
:::

## ::class
使用 ClassName::class 可以获取包含类 ClassName 的完全限定名称。这对使用了 ==命名空间== 的类尤其有用。
```php
namespace NS {
    class ClassName {
    }

    echo ClassName::class;
}
```
自 PHP 8.0.0 起，::class 也可用于对象。
```php
namespace NS {
    class ClassName {
    }
}
$c = new ClassName();
print $c::class;
```

## ?>访问符
自 PHP 8.0.0 起，类属性和方法可以通过 "nullsafe" 操作符访问： ?->。
 对象引用解析（dereference）为 null 时不抛出异常，而是返回 null。 并且如果是链式调用中的一部分，剩余链条会直接跳过。
```php
// 自 PHP 8.0.0 起可用
$result = $repository?->getUser(5)?->name;

// 上边那行代码等价于以下代码
if (is_null($repository)) {
    $result = null;
} else {
    $user = $repository->getUser(5);
    if (is_null($user)) {
        $result = null;
    } else {
        $result = $user->name;
    }
}
```

## 属性
类的变量成员叫做属性，或者叫字段。
属性开头至少使用一个修饰符（比如 访问控制（可见性）、静态（static）关键字或者自 PHP 8.1.0 起支持的 readonly）， 除了 readonly 属性之外都是可选的，然后自 PHP 7.4 起可以跟一个类型声明，然后跟一个普通的变量声明来组成。属性中的变量可以初始化，但是初始化的值必须是 常量值。
:::important
没有声明访问控制（可见性）修饰符的属性将默认声明为public。
:::


### ->
->（对象运算符）：$this->property（其中 property 是该属性名）这种方式来访问非静态属性。
静态属性则是用 ::（双冒号）：self::$property 来访问。


### 类型声明
从 PHP 7.4.0 开始，属性定义可以包含类型声明，但 callable 除外。

```php
class User
{
    public int $id;
    public ?string $name;

    public function __construct(int $id, ?string $name)
    {
        $this->id = $id;
        $this->name = $name;
    }
}

$user = new User(1234, null);

var_dump($user->id);
var_dump($user->name);
```

### 只读(地址)
自 PHP 8.1.0 起，可以使用 readonly 修饰符声明属性，防止初始化后修改属性。
不支持静态属性，且必须在他的声明作用域内初始化。
然而，只读属性并不会妨碍内部可变性。存储在只读属性中的对象（或资源）仍然可以在内部修改：
```php
class Test {
    public function __construct(public readonly object $obj) {}
}
$test = new Test(new stdClass);
// 内部可变正常。
$test->obj->foo = 1;
// 赋值异常。
$test->obj = new stdClass;
```

### 动态属性
如果尝试在 object 上赋值不存在的属性，PHP 将会自动创建相应的属性。动态创建的属性将仅能在此类实例上使用。
::: important
自 PHP 8.2.0 起弃用动态属性。建议更改为属性声明。要处理任意属性名称，类应该实现魔术方法 __get() 和 __set()。最后可以使用 #[\AllowDynamicProperties] 注解标记此类。
:::

## 属性钩子（拦截器、代理
属性钩子是拦截和覆盖属性的读写行为的一种方法。 这个功能有两个目的：
1. 它允许直接使用属性，而不需要get和set方法， 同时为将来添加其他行为留有余地。 这使得大多数样板get/set方法变得不必要， 即使不使用钩子
2. 它允许不需要存储就能描述对象的属性 直接一个值。
在非静态属性上有两个钩子： get 和 set 。 它们分别允许重写属性的读和写行为。 钩子可用于类型化和非类型化属性。

::: important
属性挂钩是在PHP 8.4中引入的。属性挂钩与 readonly 属性不兼容。
:::

```php
class Example
{
    private bool $modified = false;

    public string $foo = 'default value' {
        get {
            if ($this->modified) {
                return $this->foo . ' (modified)';
            }
            return $this->foo;
        }
        set(string $value) {
            $this->foo = strtolower($value);
            $this->modified = true;
        }
    }
}

$example = new Example();
$example->foo = 'changed';
print $example->foo;
```

## 类常量
类常量的默认可见性是 public。
::: important
类常量可以通过子类重新定义。PHP 8.1.0 起，如果类常量定义为 final，则不能被子类重新定义。
:::
```php
class MyClass
{
    const CONSTANT = 'constant value';
    function showConstant() {
        echo  self::CONSTANT . "\n";
    }
}

echo MyClass::CONSTANT . "\n";

$classname = "MyClass";
echo $classname::CONSTANT . "\n";

$class = new MyClass();
$class->showConstant();

echo $class::CONSTANT."\n";
```
::: important
自 PHP 8.3.0 起，可以使用变量动态获取类常量。
:::
```php
class Foo {
    public const BAR = 'bar';
    private const BAZ = 'baz';
}

$name = 'BAR';
echo Foo::{$name}, PHP_EOL; // bar
```


## 类自动引入
==spl_autoload_register()== 函数可以注册任意数量的自动加载器，当使用尚未被定义的类（class）和接口（interface）时自动去加载。通过注册自动加载器，脚本引擎在 PHP 出错失败前有了最后一个机会加载所需的类。
像 class 一样的结构都可以以相同方式自动加载。包括类、接口、trait 和枚举。
::: important
PHP 8.0.0 之前，可以使用 ==__autoload()== 自动加载类和接口。然而，它是 ==spl_autoload_register()== 的一种不太灵活的替代方法，并且 ==__autoload()== 在 PHP 7.2.0 起弃用，在 PHP 8.0.0 起移除。
:::

```php
spl_autoload_register(function ($class_name) {
    require_once $class_name . '.php';
});

$obj  = new MyClass1();
$obj2 = new MyClass2();
```

