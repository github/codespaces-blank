"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purry = void 0;
var _lazyDataLastImpl_1 = require("./_lazyDataLastImpl");
function purry(fn, args, lazyFactory) {
    var diff = fn.length - args.length;
    if (diff === 0) {
        return fn.apply(void 0, Array.from(args));
    }
    if (diff === 1) {
        return (0, _lazyDataLastImpl_1.lazyDataLastImpl)(fn, args, lazyFactory);
    }
    throw new Error("Wrong number of arguments");
}
exports.purry = purry;
