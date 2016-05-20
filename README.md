# Sprites
根据配置输出精灵图和对应的样式文件，__支持 rem__

## 安装

```bash
npm i --save-dev git+ssh://git@git.ucweb.local:lyh106415/sprites.git
```

## 使用
### 1. 配置文件
在 `frontend` 目录下创建配置文件 `sprites_conf.js`, 格式如下：

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
    algorithm: 'binary-tree'
}];
```
### 2. 添加命令
由于 FIS 缺少文件编译前的注入节点，因此通过 npm 调用。在 `package.json` 中增加如下命令

```js
"scripts": {
    ...
    "sprites": "node_modules/sprites/bin/sprites"
},
```
### 3. 产出图片和样式
控制台输入 `npm run sprites` 即可。有了图片和样式文件之后，是 mixin 还是直接引用随意。`selector` 的命名由图片名称和配置中的 `prefix` 决定

产出的如下样式文件：

```css
.sprite-prize_01 {
    width: 1.28rem;
    height: 1.28rem;
    background: url(./sprites.png) no-repeat;
    background-size: 2.56rem 2.56rem;
    background-position: 0rem 0rem;
}
.sprite-prize_02 {
    width: 1.28rem;
    height: 1.28rem;
    background: url(./sprites.png) no-repeat;
    background-size: 2.56rem 2.56rem;
    background-position: -1.28rem 0rem;
}
.sprite-prize_03 {
    width: 1.28rem;
    height: 1.28rem;
    background: url(./sprites.png) no-repeat;
    background-size: 2.56rem 2.56rem;
    background-position: 0rem -1.28rem;
}
```