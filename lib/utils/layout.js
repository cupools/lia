'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _layout = require('layout');

var _layout2 = _interopRequireDefault(_layout);

var _lodash = require('lodash.sortby');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TopDown = {
    sort: function sort(items) {
        return (0, _lodash2.default)(items, function (item) {
            return item.height;
        });
    },
    placeItems: function placeItems(items) {
        var y = 0;

        items.forEach(function (item) {
            item.x = 0;
            item.y = y;

            y += item.height;
        });

        return items;
    }
};

var LeftRight = {
    sort: function sort(items) {
        return (0, _lodash2.default)(items, function (item) {
            return item.width;
        });
    },
    placeItems: function placeItems(items) {
        var x = 0;

        items.forEach(function (item) {
            item.x = x;
            item.y = 0;

            x += item.width;
        });

        return items;
    }
};

_layout2.default.addAlgorithm('top-down', TopDown);
_layout2.default.addAlgorithm('left-right', LeftRight);

exports.default = _layout2.default;