"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathOr = void 0;
var purry_1 = require("./purry");
function pathOr() {
    return (0, purry_1.purry)(_pathOr, arguments);
}
exports.pathOr = pathOr;
function _pathOr(data, path, defaultValue) {
    var current = data;
    for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
        var prop = path_1[_i];
        if (current === null || current === undefined) {
            break;
        }
        current = current[prop];
    }
    return current !== null && current !== void 0 ? current : defaultValue;
}
