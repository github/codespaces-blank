"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapWithFeedback = void 0;
var _reduceLazy_1 = require("./_reduceLazy");
var _toLazyIndexed_1 = require("./_toLazyIndexed");
var purry_1 = require("./purry");
function mapWithFeedback() {
    return (0, purry_1.purry)(mapWithFeedbackImplementation(false), arguments, mapWithFeedback.lazy);
}
exports.mapWithFeedback = mapWithFeedback;
var mapWithFeedbackImplementation = function (indexed) {
    return function (items, reducer, initialValue) {
        var implementation = indexed
            ? mapWithFeedback.lazyIndexed
            : mapWithFeedback.lazy;
        return (0, _reduceLazy_1._reduceLazy)(items, implementation(reducer, initialValue), indexed);
    };
};
var lazyImplementation = function (indexed) {
    return function (reducer, initialValue) {
        var previousValue = initialValue;
        return function (value, index, items) {
            previousValue = indexed
                ? reducer(previousValue, value, index, items)
                : reducer(previousValue, value);
            return {
                done: false,
                hasNext: true,
                next: previousValue,
            };
        };
    };
};
(function (mapWithFeedback) {
    function indexed() {
        return (0, purry_1.purry)(mapWithFeedbackImplementation(true), arguments, mapWithFeedback.lazyIndexed);
    }
    mapWithFeedback.indexed = indexed;
    mapWithFeedback.lazy = lazyImplementation(false);
    mapWithFeedback.lazyIndexed = (0, _toLazyIndexed_1._toLazyIndexed)(lazyImplementation(true));
})(mapWithFeedback || (exports.mapWithFeedback = mapWithFeedback = {}));
