# Lia

[![Build Status](https://travis-ci.org/cupools/lia.svg?branch=master)](https://travis-ci.org/cupools/lia)
[![Coverage Status](https://coveralls.io/repos/github/cupools/lia/badge.svg?branch=master)](https://coveralls.io/github/cupools/lia?branch=master)

`Lia` 通过 `sprite_conf.js` 的配置命中图片资源，然后输出精灵图片和样式文件到指定文件夹。

如果你更倾向于基于样式文件创建精灵图片，也许你会喜欢 [Emilia](https://github.com/cupools/emilia)

## 特点
- 支持 `rem` 和数值大小转换
- 支持一次性输出多个精灵图片和样式文件
- 支持监听文件改动并按需编译
- 支持在当前文件夹快速创建精灵图片，可用于创建组帧图片的场景
- 支持自定义模板输出图片坐标信息，可以是 SCSS, JSON, JS 或者任意格式类型

## 使用

#### Step 0
```bash
npm i -g lia
```

```bash
$ lia -h

  Usage: lia [command]

  Commands:

    init                   Create sprite_conf.js
    here                   Build sprite pictures in current directory
    -w, watch              Monitor file changes and incremental recompilation
    -h, help               Output usage information
```

#### Step 1


```bash
$ lia init
[info]: Created sprite_conf.js
```

#### Step 2

```bash
$ lia
[info]: Created build/sprite.png
[info]: Created build/sprite.css
```

然后就搞定啦。

我们在这个过程中需要关注的只有 `sprite_conf.js`。当执行 `lia init`，初始化配置如下：

```js
// sprite_conf.js
module.exports = [{
    src: ['**/sprite-*.png'],
    image: 'build/sprite.png',
    style: 'build/sprite.css',
    prefix: '',
    cssPath: './',
    unit: 'px',
    convert: 1,
    blank: 0,
    padding: 10,
    algorithm: 'binary-tree',
    tmpl: '',
    wrap: ''
}];
```

在上面的示例中，输出的样式文件和精灵图片如下：

```css
/* build/sprite.css */
.sprite-icon0 {
    width: 256px;
    height: 256px;
    background: url(./sprite.png) no-repeat;
    background-size: 522px 366px;
    background-position: 0px 0px;
}
.sprite-icon1 {
    width: 256px;
    height: 256px;
    background: url(./sprite.png) no-repeat;
    background-size: 522px 366px;
    background-position: -266px 0px;
}
.sprite-icon2 {
    width: 100px;
    height: 100px;
    background: url(./sprite.png) no-repeat;
    background-size: 522px 366px;
    background-position: 0;
}
```

![sprites demo](docs/sprites.png)

在得到了样式文件和精灵图片之后，可以通过 `@extend` 或者直接通过选择器使用。

## 参数
### src
- 类型: `Array`
- 描述: 图片路径, 使用 [glob-patterns](https://github.com/isaacs/node-glob)
- 默认: ['\*\*/sprite-*.png']

### image
- 类型: `String`
- 描述: 精灵图片的输出路径
- 默认: 'build/sprite.png'

### style
- 类型: `String`
- 描述: 样式文件的输出路径，可以是 `css`, `scss`，也可以配合 [tmpl](#tmpl) 和 [wrap](#wrap) 输出 `js`, `json` 或者其他任意格式类型的文件
- 默认: 'build/sprite.css'

### prefix
- 类型: `String`
- 描述: 选择器前缀
- 默认: ''

### cssPath
- 类型: `String`
- 描述: 图片的 url 前缀
- 默认: '../images/'

### unit
- 类型: `String`
- 描述: CSS 使用的单位
- 默认: 'px'

### convert
- 类型: `Number`
- 描述: 缩放的数值大小，可以用在 `rem` 或者 Retina 场景
- 默认: 1

### blank
- 类型: `Number`
- 描述: 在背景图的边缘留一点空白，避免 `rem` 小数值计算造成的图片显示不全的问题
- 默认: 0

### padding
- 类型: `Number`
- 描述: 图片之间的间距
- 默认: 10

### algorithm
- 类型: `String`
- 描述: 精灵图片的排序算法
- value: ['top-down' | 'left-right' | 'diagonal' | 'alt-diagonal' | 'binary-tree']
- 默认: 'binary-tree'

### tmpl
- 类型: `String`
- 描述: 模板文件的路径，用来输出各种格式类型的文件。其中可用的变量有：`name`, `imageName`, `totalWidth`, `width`, `totalHeight`, `height`, `x`, `y`, `unit`, `cssPath`, `image`, `selector`。使用 ES6 template 语法
- 默认: ''

### wrap
- 类型: `String`
- 描述: 用来弥补 [tmpl](#tmpl) 的不足的字符串, 比如 <code>module.exports=[${content}];</code>。其中可用的变量有：`content`, `totalWidth`, `totalHeight`, `imageName`。使用 ES6 template 语法
- 默认: ''

## 示例

### 在当前文件夹快速创建精灵图片

```bash
$ lia here
[info]: Created sprite-keyframes.png
```

当前文件夹中的所有图片将会被合并输出一张精灵图片，使用 `top-down` 排序，padding 为 10。不输出样式文件。

From:

![sprite icon](docs/01.png) ![+](docs/plus.png)
![sprite icon](docs/02.png) ![+](docs/plus.png)
![sprite icon](docs/03.png)

To:

![sprite keyframes](docs/sprites-keyframes.png)

### 2. 监听文件变动
`sprite_conf.js` 的内容如下：

```js
// sprite_conf
module.exports = [{
    src: ['animal/*.png'],
    image: './sprites/sp-animal.png',
    style: './sprites/sp-animal.scss',
    cssPath: './',
    unit: 'px',
}, {
    src: ['icon/*.png'],
    image: './sprites/sp-icon.png',
    style: './sprites/sp-icon.scss',
    cssPath: './',
    unit: 'px',
}];
```

执行 `lia watch`，结果如下：

```bash
$ lia -w
[info]: Created ./sprites/sp-animal.png
[info]: Created ./sprites/sp-animal.scss
[info]: Created ./sprites/sp-icon.png
[info]: Created ./sprites/sp-icon.scss
[info]: Finish in 1.217s. Waiting...
[info]: Created ./sprites/sp-animal.png
[info]: Created ./sprites/sp-animal.scss
[info]: Finish in 0.532s. Waiting...
```

### 3. 自定义模板

`Lia` 支持将精灵图的坐标信息通过自定义模板输出为任意格式的文件。这个功能在 Canvas 动画或者其他使用场景可能会有帮助。

`sprite_conf.js` 配置如下：

```js
// sprite_conf.js
module.exports = [{
    src: ['images/animal/*.png'],
    image: 'build/sprite.png',
    style: 'build/sprite.js',
    unit: 'px',
    tmpl: './obj.tmpl',
    wrap: 'module.exports={name: \'${imageName}\', totalWidth: ${totalWidth}, totalHeight: ${totalWidth}, data: [${content}]}'
}];
```

模板文件 `obj.tmpl` 如下：

```js
// obj.tmpl
{
    name: '${name}',
    width: ${width},
    height: ${height},
    offset: {
        x: ${x},
        y: ${y}
    }
},
```

在 CLI 中执行：

```bash
$ lia
[info]: Created build/sprite.png
[info]: Created build/sprite.js
```

最终会输出 `sprite.js` 和 `sprite.png` 如下：

```js
// sprite.js
module.exports={name: 'sprite.png', totalWidth: 451, totalHeight: 451, data: [{
    name: 'bird',
    width: 131,
    height: 210,
    offset: {
        x: 179,
        y: 0
    }
},{
    name: 'cat',
    width: 131,
    height: 178,
    offset: {
        x: 320,
        y: 0
    }
},{
    name: 'cow',
    width: 169,
    height: 219,
    offset: {
        x: 0,
        y: 0
    }
},]}
```

## 更新日志
- v1.2.0
    - 使用 [node-images](https://github.com/zhangyuanwei/node-images) 作为图片引擎，极大提高了编译速度
- v1.1.1
    - 兼容 Node v0.12
- v1.1.0
    - 修复了 Windows 平台下由于 `child_process.execFileSync` 的不恰当的使用导致的致命 Bug
    - 增加单元测试用例
- v1.0.0
    - 由 `Sprites` 更名为 `Lia`
    - 调整默认参数配置
- v0.2.1
    - 添加 `watch` 命令，允许监听文件改动
- v0.1.2
    - 添加 `here` 命令 (之前名为 `now`)，允许在当前文件夹快速创建精灵图
    - 修复滚雪球 Bug, 在编译中排除产出的精灵图片
- v0.1.1
    - 增加 `tmpl` 和 `wrap` 参数，允许将精灵图片的坐标信息输出为任意格式类型的文件
- v0.0.1: 
    - 基本功能

## License

Copyright (c) 2016 cupools

Licensed under the MIT license.
