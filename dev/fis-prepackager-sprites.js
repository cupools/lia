'use strict';

module.exports = function (ret, conf, settings, opt) {
    var Sprite = require('../main').default;

    var sprite = new Sprite();

    sprite.outputImage = function(options) {
        var outputPath = options.outputPath;
        var content = options.content;
        var opt = options.opt;

        var file = fis.file.wrap(outputPath);
        file.setContent(content);
        fis.compile(file);
        ret.pkg[opt.image] = file;
    };

    sprite.outputStyle = function(options) {
        var outputPath = options.outputPath;
        var content = options.content;
        var opt = options.opt;

        var file = fis.file.wrap(outputPath);
        file.setContent(content);
        fis.compile(file);
        console.log(file.getContent());
        ret.pkg[opt.style] = file;
    };

    sprite.run();
};