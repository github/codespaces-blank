"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sample = void 0;
var purry_1 = require("./purry");
function sample() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return (0, purry_1.purry)(sampleImplementation, args);
}
exports.sample = sample;
function sampleImplementation(data, sampleSize) {
    if (sampleSize < 0) {
        throw new RangeError("sampleSize must cannot be negative: ".concat(sampleSize));
    }
    if (!Number.isInteger(sampleSize)) {
        throw new TypeError("sampleSize must be an integer: ".concat(sampleSize));
    }
    if (sampleSize >= data.length) {
        return data.slice();
    }
    if (sampleSize === 0) {
        return [];
    }
    var actualSampleSize = Math.min(sampleSize, data.length - sampleSize);
    var sampleIndices = new Set();
    while (sampleIndices.size < actualSampleSize) {
        var randomIndex = Math.floor(Math.random() * data.length);
        sampleIndices.add(randomIndex);
    }
    if (sampleSize === actualSampleSize) {
        return Array.from(sampleIndices)
            .sort(function (a, b) { return a - b; })
            .map(function (index) { return data[index]; });
    }
    return data.filter(function (_, index) { return !sampleIndices.has(index); });
}
