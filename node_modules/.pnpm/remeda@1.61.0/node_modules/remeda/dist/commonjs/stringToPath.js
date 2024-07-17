"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringToPath = void 0;
function stringToPath(path) {
    return _stringToPath(path);
}
exports.stringToPath = stringToPath;
function _stringToPath(path) {
    var _a;
    if (path.length === 0) {
        return [];
    }
    var match = (_a = /^\[(.+?)\](.*)$/u.exec(path)) !== null && _a !== void 0 ? _a : /^\.?([^.[\]]+)(.*)$/u.exec(path);
    if (match !== null) {
        var key = match[1], rest = match[2];
        return __spreadArray([key], _stringToPath(rest), true);
    }
    return [path];
}
