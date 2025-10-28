

TypeScript 内置工具类型 [​](#typescript-内置工具类型)
=========================================

TypeScript 提供了以下几种实用工具类型来帮助常见的类型转换

`Awaited<Type>` 获取 `Promise` 返回值类型 [​](#awaited-type-获取-promise-返回值类型)
----------------------------------------------------------------------

`Awaited<Type>` 可以用来获取 `Promise` 返回值类型

```ts

    type Awaited<T> = T extends Promise<infer U> ? U : T

``` 

> 举 🌰

```ts

    type result = Awaited<Promise<string>>
    // 结果：string

```

`Partial<Type>` 可选 [​](#partial-type-可选)
----------------------------------------

`Partial<Type>` 用于将 `Type` 中的所有属性设置为可选

```ts

    type Partial<T> = {
      [P in keyof T]?: T[P]
    }

```

> 举 🌰

```ts

    type result = Partial<{ name: string; age: number }>
    // 结果：{ name?: string; age?: number }

```

`Required<Type>` 必选 [​](#required-type-必选)
------------------------------------------

`Required<Type>` 用于将 `Type` 中的所有属性设置为必选

```ts

    type Required<T> = {
      [P in keyof T]-?: T[P]
    }
``` 

> 举 🌰

```ts

    type result = Required<{ name?: string; age?: number }>
    // 结果：{ name: string; age: number }

``` 

`Readonly<Type>` 只读 [​](#readonly-type-只读)
------------------------------------------

`Readonly<Type>` 用于将 `Type` 中的所有属性设置为只读（被 `readonly` 所修饰）

```ts

    type Readonly<T> = {
      readonly [P in keyof T]: T[P]
    }

``` 

> 举 🌰

```ts

    type result = Readonly<{ name: string; age: number }>
    // 结果：{ readonly name: string; readonly age: number }

```  

`Record<Keys, Type>` 构造对象 [​](#record-keys-type-构造对象)
-----------------------------------------------------

`Record<Keys, Type>` 用于构造一个由 `Keys` 中的属性决定 `Type` 中属性类型的对象

```ts

    type Record<K extends keyof any, T> = {
      [P in K]: T
    }

```  

> 举 🌰

```ts

    type result = Record<'a' | 'b', string>
    // 结果：{ a: string; b: string }

```
`Pick<Type, Keys>` 选取 [​](#pick-type-keys-选取)
---------------------------------------------

`Pick<Type, Keys>` 用于从类型 `Type` 中选取指定的几个字段 `Keys` 组合成一个新的类型

```ts

    type Pick<T, K extends keyof T> = {
      [P in K]: T[P]
    }

```

> 举 🌰

```ts

    type result = Pick<{ name: string; age: number }, 'name'>
    // 结果：{ name: string }

```  

`Exclude<UnionType, ExcludedMembers>` 排除 [​](#exclude-uniontype-excludedmembers-排除)
-----------------------------------------------------------------------------------

`Exclude<UnionType, ExcludedMembers>` 用于从联合类型 `UnionType` 中排除指定的几个成员 `ExcludedMembers`（即取 `UnionType` 对于 `ExcludedMembers` 的差集），来构造一个新的类型

```ts

    type Exclude<T, U> = T extends U ? never : T

``` 

> 举 🌰

```ts

    type result = Exclude<'name' | 'age' | 'sex', 'sex' | 'address'>
    // 结果：'name' | 'age'

```  

`Omit<Type, Keys>` 移除 [​](#omit-type-keys-移除)
---------------------------------------------

`Omit<Type, Keys>` 用于从类型 `Type` 中移除指定的几个字段 `Keys`

```ts

    type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>

``` 

> 举 🌰

```ts

    type result = Omit<{ name: string; age: number }, 'name'>
    // 结果：{ age: number }

``` 

`Extract<Type, Union>` 提取 [​](#extract-type-union-提取)
-----------------------------------------------------

`Extract<Type, Union>` 用于从联合类型 `Type` 中提取可赋值给 `Union` 的类型

```ts

    type Extract<T, U> = T extends U ? T : never

```

> 举 🌰

```ts

    type result = Extract<'name' | 'age' | 'sex', 'sex' | 'address'>
    // 结果：'sex'

```
`NonNullable<Type>` 排除 `null` 和 `undefined` [​](#nonnullable-type-排除-null-和-undefined)
--------------------------------------------------------------------------------------

`NonNullable<Type>` 用于从类型 `Type` 中排除 `null` 和 `undefined`

```ts

    type NonNullable<T> = T & {}

``` 

> 举 🌰

```ts

    type result = NonNullable<string | null | undefined>
    // 结果：string

```  

`Parameters<Type>` 获取函数参数类型 [​](#parameters-type-获取函数参数类型)
----------------------------------------------------------

`Parameters<Type>` 用于获取函数 `Type` 的参数类型组成的元组类型

```ts

    type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never

```

> 举 🌰

```ts

    type result = Parameters<(name: string, age: number) => void>
    // 结果：[name: string, age: number]

```
`ConstructorParameters<Type>` 获取构造函数参数类型 [​](#constructorparameters-type-获取构造函数参数类型)
------------------------------------------------------------------------------------

`ConstructorParameters<Type>` 用于获取构造函数 `Type` 的参数类型组成的元组类型

```ts

    type ConstructorParameters<T extends abstract new (...args: any) => any> = T extends abstract new (
      ...args: infer P
    ) => any
      ? P
      : never
``` 

> 举 🌰

```ts

    type result = ConstructorParameters<new (name: string, age: number) => void>
    // 结果：[name: string, age: number]

```

`ReturnType<Type>` 获取函数返回值类型 [​](#returntype-type-获取函数返回值类型)
------------------------------------------------------------

`ReturnType<Type>` 用于获取函数 `Type` 的返回值类型

```ts

    type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any

```

> 举 🌰

```ts

    type result = ReturnType<() => string>
    // 结果：string

``` 

`InstanceType<Type>` 获取构造函数实例类型 [​](#instancetype-type-获取构造函数实例类型)
------------------------------------------------------------------

`InstanceType<Type>` 用于获取构造函数 `Type` 的实例类型

```ts

    type InstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (
      ...args: any
    ) => infer R
      ? R
      : any

```
> 举 🌰

```ts

    interface Example {
      fn(a: string): string
    }
    
    interface ExampleConstructor {
      new (a: string, b: number): Example
    }
    
    type result = InstanceType<ExampleConstructor>
    // 结果：Example

```

`ThisParameterType<Type>` 提取函数的 `this` 类型 [​](#thisparametertype-type-提取函数的-this-类型)
------------------------------------------------------------------------------------

`ThisParameterType<Type>` 用于提取函数 `Type` 的 `this` 参数类型

```ts

    type ThisParameterType<T> = T extends (this: infer U, ...args: never) => any ? U : unknown

``` 

> 举 🌰

```ts

    function toHex(this: Number) {
      return this.toString(16)
    }
    
    function numberToString(n: ThisParameterType<typeof toHex>) {
      return toHex.apply(n)
    }
```

`OmitThisParameter<Type>` 忽略 `this` 参数类型 [​](#omitthisparameter-type-忽略-this-参数类型)
----------------------------------------------------------------------------------

`OmitThisParameter<Type>` 用于忽略函数 `Type` 的 `this` 参数类型

```ts

    type OmitThisParameter<T> = unknown extends ThisParameterType<T>
      ? T
      : T extends (...args: infer A) => infer R
      ? (...args: A) => R
      : T

```  

> 举 🌰

```ts

    function toHex(this: Number) {
      return this.toString(16)
    }
    
    const fiveToHex: OmitThisParameter<typeof toHex> = toHex.bind(5)
    
    console.log(fiveToHex())

``` 

`ThisType<Type>` 设置 `this` 参数类型 [​](#thistype-type-设置-this-参数类型)
----------------------------------------------------------------

`ThisType<Type>` 可以在对象字面量中键入 `this`，并提供通过上下文类型控制 `this` 类型的便捷方式，其只有在 `--noImplicitThis` 的选项下才有效

```ts

    interface ThisType<T> {}

```

> 举 🌰

```ts

    type ObjectDescriptor<D, M> = {
      data?: D
      methods?: M & ThisType<D & M> // Type of 'this' in methods is D & M
    }
    
    function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
      let data: object = desc.data || {}
      let methods: object = desc.methods || {}
      return { ...data, ...methods } as D & M
    }
    
    let obj = makeObject({
      data: { x: 0, y: 0 },
      methods: {
        moveBy(dx: number, dy: number) {
          this.x += dx // Strongly typed this
          this.y += dy // Strongly typed this
        },
      },
    })
    
    obj.x = 10
    obj.y = 20
    obj.moveBy(5, 5)

```

字符串操作类型 [​](#字符串操作类型)
---------------------

一组用于操作字符串的类型

### `Uppercase<StringType>` 将字符串转换为大写 [​](#uppercase-stringtype-将字符串转换为大写)

`Uppercase<StringType>` 将字符串转换为大写

> 举 🌰

```ts

    type result = Uppercase<'maomao'>
    // 结果：'MAOMAO'

``` 

### `Lowercase<StringType>` 将字符串转换为小写 [​](#lowercase-stringtype-将字符串转换为小写)

`Lowercase<StringType>` 将字符串转换为小写

> 举 🌰

```ts

    type result = Lowercase<'MAOMAO'>
    // 结果：'maomao'
```

### `Capitalize<StringType>` 将字符串首字母转换为大写 [​](#capitalize-stringtype-将字符串首字母转换为大写)

`Capitalize<StringType>` 将字符串首字母转换为大写

> 举 🌰

```ts

    type result = Uncapitalize<'maomao'>
    // 结果：'Maomao'

```

### `Uncapitalize<StringType>` 将字符串首字母转换为小写 [​](#uncapitalize-stringtype-将字符串首字母转换为小写)

`Uncapitalize<StringType>` 将字符串首字母转换为小写

> 举 🌰

```ts

    type result = Uncapitalize<'Maomao'>
    // 结果：'maomao'

```

* * *

相关资料

[Utility Types | TypeScript](https://www.typescriptlang.org/docs/handbook/utility-types.html)
