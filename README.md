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

sprites              Build sprite images and variables follow sprites_conf.js
sprites init         Create sprites_conf.js
sprites now          Build sprite images in current directory
sprites -w, watch    Rebuild sprite images and variables on changes
sprites -h, help     Output usage information
```

第一次使用，需要初始化配置文件，而后再根据配置文件内容产出图片和样式文件

```bash
$ sprites init
[info]: Created sprites_conf.js
$ sprites
[info]: Created ./components/sprites/sprites.png
[info]: Created ./components/sprites/sprites.scss
```

其中，初始化配置文件 sprites_conf.js 的内容如下：

```js
module.exports = [{
    src: ['./components/images/*.png'],
    image: './components/sprites/sprites.png',
    style: './components/sprites/sprites.scss',
    prefix: 'sprites-',
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
.sprites-bird {
    width: 1.31rem;
    height: 2.1rem;
    background: url(./sprites.png) no-repeat;
    background-size: 4.51rem 2.19rem;
    background-position: -1.79rem 0rem;
}
.sprites-cat {
    width: 1.31rem;
    height: 1.78rem;
    background: url(./sprites.png) no-repeat;
    background-size: 4.51rem 2.19rem;
    background-position: -3.2rem 0rem;
}
.sprites-cow {
    width: 1.69rem;
    height: 2.19rem;
    background: url(./sprites.png) no-repeat;
    background-size: 4.51rem 2.19rem;
    background-position: 0rem 0rem;
}
```

![sprites demo](docs/sprites.png)

在得到样式文件和图片之后，通过 @extend 或者直接使用随意。

## 示例

### 1. 直接产出组帧图片
```bash
$ sprites now
[info]: Created sprites-keyframes.png
```
当前文件夹的所有图片

![sprite icon](docs/01.png) ![+](docs/plus.png)
![sprite icon](docs/02.png) ![+](docs/plus.png)
![sprite icon](docs/03.png)

输出为 `top-down` 布局的精灵图，间距10px

![sprite keyframes](docs/sprites-keyframes.png)

### 2. 监听变动
```js
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

```bash
$ sprites -w
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

Sprites 允许通过自定义模板输出各种类型的文件，可以是 js, json 等等等，而不局限于 css, scss, 以此满足 canvas 动画和其他各种使用场景。

配置文件

```js
// sprites_conf.js
module.exports = [{
    src: ['./components/images/*.png'],
    image: './components/sprites/sprites.png',
    style: './components/sprites/sprites.js',
    unit: 'px',
    tmpl: './obj.tmpl',
    wrap: 'module.exports={name: \'${imageName}\', totalWidth: ${totalWidth}, totalHeight: ${totalWidth}, data: [${content}]}'
}];
```

模板文件

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

运行命令

```bash
$ sprites
[info]: Created ./components/sprites/sprites.png
[info]: Created ./components/sprites/sprites.js
```

输出文件

```js
// sprites.js
module.exports={name: 'sprites.png', totalWidth: 451, totalHeight: 451, data: [{
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

## 参数
### src
- 类型：Array
- 说明：图片路径，通过 [node-glob](https://github.com/isaacs/node-glob) 模块命中文件
- 默认：['./components/images/*.png']

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
- 说明：单位缩放倍数，可以是 px 和 rem 的转换大小，也可以是 Retina 情况下的缩放大小
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
- 说明：弥补 `tmpl` 参数的不足，类似 <code>module.exports=[${content}];</code>。可用的变量有 `content`, `totalWidth`, `totalHeight`, `imageName`, 使用 ES6 template 的语法。
- 默认：''

## 更新日志
- v0.2.1: 添加 `sprites watch` 命令，允许监听文件改动
- v0.1.2: 添加 `sprites now` 命令，在当前目录中匹配所有 .png 图片并输出 `top-down` 布局的精灵图，不输出样式文件；修复滚雪球 bug
- v0.1.1: 添加 `tmpl` 和 `wrap` 参数，允许产出 json 及其他任意类型的精灵图数据格式
- v0.0.1: 基本功能