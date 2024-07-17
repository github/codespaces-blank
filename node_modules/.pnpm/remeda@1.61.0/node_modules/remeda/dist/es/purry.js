import { lazyDataLastImpl } from "./_lazyDataLastImpl";
export function purry(fn, args, lazyFactory) {
    var diff = fn.length - args.length;
    if (diff === 0) {
        return fn.apply(void 0, Array.from(args));
    }
    if (diff === 1) {
        return lazyDataLastImpl(fn, args, lazyFactory);
    }
    throw new Error("Wrong number of arguments");
}
