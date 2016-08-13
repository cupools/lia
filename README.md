# Lia

[![Build Status](https://travis-ci.org/cupools/lia.svg?branch=master)](https://travis-ci.org/cupools/lia)
[![Coverage Status](https://coveralls.io/repos/github/cupools/lia/badge.svg?branch=master)](https://coveralls.io/github/cupools/lia?branch=master)

`Lia` finds image resources according to `sprite_conf.js`, then builds sprite pictures and output stylesheet files to specify directory.

If you are tend to build sprite pictures according to stylesheet, maybe you like [Emilia](https://github.com/cupools/emilia).

[中文文档](README.zh-CN.md)

## Features
- Supports `rem` as well as numerical conversion.
- Output multiple sprite pictures and stylesheet files in once time.
- Monitor file changes and incremental recompilation.
- Create sprites picture in current folder easily. May be useful for css or canvas keyframes animation.
- Support custom template for coordinates infomation. It means scss, js and any format you want can be build.

## Getting started

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

And it works.

What we should be care about is `sprite_conf.js`. When `lia init`, it looks like:

```js
// sprite_conf.js
module.exports = [{
    src: ['*.png'],
    image: 'build/sprite.png',
    style: 'build/sprite.css',
    prefix: '',
    cssPath: './',
    unit: 'px',
    convert: 1,
    decimalPlaces: 6,
    blank: 0,
    padding: 10,
    algorithm: 'binary-tree',
    tmpl: '',
    quiet: false
}];
```

And in the example above, it results in:

```css
/* build/sprite.css */
.sprite-icon0 {
    width: 256px;
    height: 256px;
    background: url('./sprite.png') no-repeat;
    background-size: 522px 366px;
    background-position: 0px 0px;
}
.sprite-icon1 {
    width: 256px;
    height: 256px;
    background: url('./sprite.png') no-repeat;
    background-size: 522px 366px;
    background-position: -266px 0px;
}
.sprite-icon2 {
    width: 100px;
    height: 100px;
    background: url('./sprite.png') no-repeat;
    background-size: 522px 366px;
    background-position: 0;
}
```

![sprites demo](docs/sprites.png)

Having get those stylesheet files and sprite pictures, you can use it through `@extend` or directly use the selector. Whatever you like.

## Parameter
### src
- type: `Array`
- desc: origin image path, use [glob-patterns](https://github.com/isaacs/node-glob)
- default: ['*.png']

### image
- type: `String`
- desc: sprite picture output path
- default: 'build/sprite.png'

### style
- type: `String`
- desc: stylesheet file path, can be `css`, `scss`, or with [tmpl](#tmpl) to be `js`, `json`, and any format.
- default: 'build/sprite.css'

### prefix
- type: `String`
- desc: selector prefix
- default: ''

### cssPath
- type: `String`
- desc: image url path
- default: '../images/'

### unit
- type: `String`
- desc: css unit
- default: 'px'

### convert
- type: `Number`
- desc: numerical scale. Useful in `rem` and Retina pictures.
- default: 1

### decimalPlaces
- type: `Number`
- desc: the number of decimal places to be keep with `convert`
- default: 6

### blank
- type: `Number`
- desc: Create space in the edge of background container to avoid `rem` decimal calculation problem, which is common to cause background incomplete.
- default: 0

### padding
- type: `Number`
- desc: padding between images
- default: 10

### algorithm
- type: `String`
- desc: layout algorithm of sprite pictures. Uses [layout](https://www.npmjs.com/package/layout)
- value: ['top-down' | 'left-right' | 'diagonal' | 'alt-diagonal' | 'binary-tree']
- default: 'binary-tree'

### tmpl
- type: `String`
- desc: the path of template file, which is used to output not only stylesheet file. Uses [Ejs](https://github.com/tj/ejs).
- default: ''

## Example

### Easily build sprite pictures in current directory

```bash
$ lia here
[info]: Created sprite-keyframes.png
```

All the pictures in current directory will be output as a sprite picture in `left-right` layout order by filename, with padding `0`. It does not output stylesheet file.

From:

![sprite icon](docs/01.png) ![+](docs/plus.png)
![sprite icon](docs/02.png) ![+](docs/plus.png)
![sprite icon](docs/03.png)

To:

![sprite keyframes](docs/sprite-keyframe.png)

### 2. Monitor file change
The `sprite_conf.js` look like this.

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

And when run `lia watch`, it runs like this.

```bash
$ lia -w
[info]: Created ./sprites/sp-animal.png
[info]: Created ./sprites/sp-animal.scss
[info]: Created ./sprites/sp-icon.png
[info]: Created ./sprites/sp-icon.scss
[info]: Finish in 76ms. Waiting...
[info]: Created ./sprites/sp-animal.png
[info]: Created ./sprites/sp-animal.scss
[info]: Finish in 32ms. Waiting...
```

### 3. Custom template with

`Lia` supports output any format files with sprite coordinates by custom Ejs template. It may be helpful in canvas animation.


#### Context
The Ejs template has the follow context

```js
{
    basename: '', // sprite image's basename
    path: '', // sprites image's url
    realpath: '', // sprites image's realpath
    unit: '',
    size: {
        with: 0,
        height: 0
    },
    items: [{
        name: '', // origin image's basename
        size: {
            width: 0,
            height: 0
        },
        x: 0, // offset x
        y: 0 // offset y
    }, ...],
    _options: {}
}
```

And the default template can be found in [template.ejs](#)

#### Example

`sprite_conf.js` as follow.

```js
// sprite_conf.js
module.exports = [{
    src: ['test/fixtures/*.png'],
    image: 'test/tmp/sprite.png',
    style: 'test/tmp/sprite.js',
    tmpl: 'test/fixtures/template.ejs'
}];
```

Template file `template.ejs` as follow.

```js
// template.ejs
var opt = {
    width: <%= size.width %>,
    height: <%= size.height %>,
    src: '<%= realpath %>',
    count: <%= items.length %>,
    items: [
<% items.forEach((item, idx) => { -%>
    {
        index: <%= idx %>,
        name: '<%= item.name %>',
        width: <%= item.size.width %>,
        height: <%= item.size.height %>,
        x: <%= item.x %>
        y: <%= item.y %>
    },
<% }) -%>
    ]
}
```

Run in CLI.

```bash
$ lia
[info]: Created test/tmp/sprite.png
[info]: Created test/tmp/sprite.js
```

Then you get `sprite.js` and `sprite.png`

```js
// sprite.js
var opt = {
    width: 522,
    height: 256,
    src: '/Users/Lance/home/lia/test/tmp/sprite.png',
    count: 2,
    items: [
    {
        index: 0,
        name: '0',
        width: 256,
        height: 256,
        x: 0
        y: 0
    },
    {
        index: 1,
        name: '1',
        width: 256,
        height: 256,
        x: 266
        y: 0
    },
    ]
}
```

## Update
- v2.0.0
    - Easier and stronger template supports with `ejs`
    - Remove `option.wrap` and add `option.decimalPlaces`
    - Update default options
    - Stronger test coverage
- v1.2.2
    - Replace `Array.prototype.sort` with `lodash.sortby` to fix orders of sprite images, which may be wrong in `$lia here`
- v1.2.0
    - Use [node-images](https://github.com/zhangyuanwei/node-images) as image engine and thus greatly speed up compilation
- v1.1.1
    - Update for Node v0.12 support
- v1.1.0
    - Fix fatal bug cause by incorrect usage of `child_process.execFileSync` in windows
    - Add unit test
- v1.0.0
    - Rename from `Sprites` to `Lia`
    - Adjust default options
- v0.2.1
    - Add command `watch`, which be abled to monitor file changes
- v0.1.2
    - Add command `now` which named `here` currently, which be abled to build sprite picture in current folder
    - Fix snowball bug, sprite picture will be filter in compilation
- v0.1.1
    - Add parameter `tmpl` and `wrap`, which be abled to output json and any format file with sprit coordinats
- v0.0.1: 
    - Basic functions

## Test

```bash
npm i && npm test
```

## License

Copyright (c) 2016 cupools

Licensed under the MIT license.
