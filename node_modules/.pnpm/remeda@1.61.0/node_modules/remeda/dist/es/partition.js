import { purry } from "./purry";
export function partition() {
    return purry(_partition(false), arguments);
}
var _partition = function (indexed) {
    return function (array, fn) {
        var ret = [[], []];
        for (var index = 0; index < array.length; index++) {
            var item = array[index];
            var matches = indexed ? fn(item, index, array) : fn(item);
            ret[matches ? 0 : 1].push(item);
        }
        return ret;
    };
};
(function (partition) {
    function indexed() {
        return purry(_partition(true), arguments);
    }
    partition.indexed = indexed;
})(partition || (partition = {}));
