export function once(fn) {
    var called = false;
    var ret;
    return function () {
        if (!called) {
            ret = fn();
            called = true;
        }
        return ret;
    };
}
