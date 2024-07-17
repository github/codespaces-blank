"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._reduceLazy = void 0;
function _reduceLazy(array, lazy, isIndexed) {
    if (isIndexed === void 0) { isIndexed = false; }
    var out = [];
    for (var index = 0; index < array.length; index++) {
        var item = array[index];
        var result = isIndexed ? lazy(item, index, array) : lazy(item);
        if (result.hasMany === true) {
            out.push.apply(out, result.next);
        }
        else if (result.hasNext) {
            out.push(result.next);
        }
        if (result.done) {
            break;
        }
    }
    return out;
}
exports._reduceLazy = _reduceLazy;
