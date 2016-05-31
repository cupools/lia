# Sprites
根据配置输出精灵图和对应的样式文件，__支持 rem 和 px__

## 安装

```bash
npm i --save-dev git+ssh://git@git.ucweb.local:lyh106415/sprites.git
```

## 使用
### 1. 添加命令
在 `package.json` 中增加如下命令

```js
"scripts": {
    ...
    "sprites": "sprites"
},
```

### 2. 配置文件
在 `frontend` 目录下创建配置文件 `sprites_conf.js`, 执行命令 `npm run sprites init` 即可，格式如下：

```js
module.exports = [{
    src: ['./components/images/achieves/*.png'],
    image: './components/sprites/sprites_achieve.png',
    style: './components/sprites/sprites_achieve.less',
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

### 3. 产出图片和样式
控制台输入 `npm run sprites` 即可。有了图片和样式文件之后，是 mixin 还是直接引用随意。`selector` 的命名由图片名称和配置中的 `prefix` 决定

产出的样式文件如下：

```css
.sp-prize_01 {
    width: 1.28rem;
    height: 1.28rem;
    background: url(./sprites.png) no-repeat;
    background-size: 2.56rem 2.56rem;
    background-position: 0rem 0rem;
}
.sp-prize_02 {
    width: 1.28rem;
    height: 1.28rem;
    background: url(./sprites.png) no-repeat;
    background-size: 2.56rem 2.56rem;
    background-position: -1.28rem 0rem;
}
.sp-prize_03 {
    width: 1.28rem;
    height: 1.28rem;
    background: url(./sprites.png) no-repeat;
    background-size: 2.56rem 2.56rem;
    background-position: 0rem -1.28rem;
}
```

## 参数
### src
- 类型：Array
- 说明：图片路径，通过 [glob](https://github.com/isaacs/node-glob) 模块命中文件，语法见 [中文文档](http://www.cnblogs.com/liulangmao/p/4552339.html)
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
- 说明：输出样式文件或者 js 对象格式的模板文件路径。可用的变量有`name`, `imageName`, `totalWidth`, `width`, `totalHeight`, `height`, `x`, `y`, `unit`, `cssPath`, `image`, `selector`. 使用 ES6 template 的语法。
- 默认：''

### wrap
- 类型：String
- 说明：弥补 `tmpl` 参数的不足，类似 <code>module.exports=[${content}];</code>。可用的变量有`content`, 使用 ES6 template 的语法。
- 默认：''

## 更新日志

- v0.1.1: 添加 `tmpl` 和 `wrap` 参数，允许产出 json 及其他任意类型的精灵图数据格式
- v0.0.1: 基本功能