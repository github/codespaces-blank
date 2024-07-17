"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sliceString = void 0;
var sliceString = function (indexStart, indexEnd) {
    return function (data) {
        return data.slice(indexStart, indexEnd);
    };
};
exports.sliceString = sliceString;
