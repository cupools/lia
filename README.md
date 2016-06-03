# Sprites
根据配置输出精灵图和对应的样式文件，__支持 rem 和 px__, 支持快速合并精灵图

## 安装

```bash
npm i -g git+ssh://git@git.ucweb.local:lyh106415/sprites.git
```

## 使用

```
$ sprites -h

Usage: 

sprites            build sprite images and variables follow sprites_conf.js
sprites init       create sprites_conf.js
sprites now        build sprite images in current directory
```
### 基础使用

```bash
$ sprites init
    [build]: sprites_conf.js done.
$ sprites
    [build]: ./components/sprites/sprites.png
    [build]: ./components/sprites/sprites.scss
```

其中，配置文件 sprites_conf.js 的内容如下：

```js
module.exports = [{
    src: ['./components/images/*.png'],
    image: './components/sprites/sprites.png',
    style: './components/sprites/sprites.scss',
    prefix: 'sp-',
    cssPath: './',
    unit: 'rem',
    convert: 100,
    blank: 2,
    padding: 10,
    algorithm: 'binary-tree',
    tmpl: '',
    wrap: ''
}];
```

输出的 sprites.scss 内容如下：

```css
.sp-body {
    width: 1.3rem;
    height: 1.3rem;
    background: url(./sprites.png) no-repeat;
    background-size: 2.7rem 2.7rem;
    background-position: 0rem 0rem;
}
.sp-foot {
    width: 1.3rem;
    height: 1.3rem;
    background: url(./sprites.png) no-repeat;
    background-size: 2.7rem 2.7rem;
    background-position: -1.4rem 0rem;
}
.sp-hand {
    width: 1.3rem;
    height: 1.3rem;
    background: url(./sprites.png) no-repeat;
    background-size: 2.7rem 2.7rem;
    background-position: 0rem -1.4rem;
}
```

在输出样式文件和图片之后，通过 @extend 或者直接使用都可以。

## 参数
### src
- 类型：Array
- 说明：图片路径，通过 [node-glob](https://github.com/isaacs/node-glob) 模块命中文件
- 默认：['./components/images/sprites-*.png']

### image
- 类型：String
- 说明：产出精灵图片路径
- 默认：'./components/sprites/sprites.png'

### style
- 类型：String
- 说明：产出样式文件路径，可以是 scss, less, styl, css, 配合 `tmpl` 和 `wrap` 参数还可以是 json, js 等等等
- 默认：'./components/sprites/sprites.scss'

### prefix
- 类型：String
- 说明：选择器前缀
- 默认：'sprites-'

### cssPath
- 类型：String
- 说明：样式文件与图片的相对路径
- 默认：'./'

### unit
- 类型：String
- 说明：数值单位，可以是 px 或者 rem
- 默认：'rem'

### convert
- 类型：Number
- 说明：rem 与 px 的转换大小
- 默认：100

### blank
- 类型：Number
- 说明：由于 rem 在精灵图使用过程中由于小数计算的问题经常出现图片边角欠缺，因此通过增加容器的宽高做优化
- 默认：0

### padding
- 类型：Number
- 说明：图片之间的间距
- 默认：10

### algorithm
- 类型：String
- 说明：图片排序算法
- 可选：top-down, left-right, diagonal, alt-diagonal, binary-tree
- 默认：'binary-tree'

### tmpl
- 类型：String
- 说明：输出样式文件或者 js 对象格式的模板文件路径。可用的变量有 `name`, `imageName`, `totalWidth`, `width`, `totalHeight`, `height`, `x`, `y`, `unit`, `cssPath`, `image`, `selector`。使用 ES6 template 的语法。
- 默认：''

### wrap
- 类型：String
- 说明：弥补 `tmpl` 参数的不足，类似 <code>module.exports=[${content}];</code>。可用的变量有 `content`, 使用 ES6 template 的语法。
- 默认：''

## 更新日志
- v0.1.2: 添加 `sprites now` 命令，在当前目录中匹配所有 .png 图片并输出 `top-down` 布局的精灵图，不输出样式文件
- v0.1.1: 添加 `tmpl` 和 `wrap` 参数，允许产出 json 及其他任意类型的精灵图数据格式
- v0.0.1: 基本功能