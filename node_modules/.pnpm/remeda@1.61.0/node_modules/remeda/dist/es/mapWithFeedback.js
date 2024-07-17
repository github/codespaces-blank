import { _reduceLazy } from "./_reduceLazy";
import { _toLazyIndexed } from "./_toLazyIndexed";
import { purry } from "./purry";
export function mapWithFeedback() {
    return purry(mapWithFeedbackImplementation(false), arguments, mapWithFeedback.lazy);
}
var mapWithFeedbackImplementation = function (indexed) {
    return function (items, reducer, initialValue) {
        var implementation = indexed
            ? mapWithFeedback.lazyIndexed
            : mapWithFeedback.lazy;
        return _reduceLazy(items, implementation(reducer, initialValue), indexed);
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
        return purry(mapWithFeedbackImplementation(true), arguments, mapWithFeedback.lazyIndexed);
    }
    mapWithFeedback.indexed = indexed;
    mapWithFeedback.lazy = lazyImplementation(false);
    mapWithFeedback.lazyIndexed = _toLazyIndexed(lazyImplementation(true));
})(mapWithFeedback || (mapWithFeedback = {}));
