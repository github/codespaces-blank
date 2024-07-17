export function pipe(input) {
    var _a;
    var operations = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        operations[_i - 1] = arguments[_i];
    }
    var output = input;
    var lazyOperations = operations.map(function (op) {
        return "lazy" in op ? prepareLazyOperation(op) : undefined;
    });
    var operationIndex = 0;
    while (operationIndex < operations.length) {
        var lazyOperation = lazyOperations[operationIndex];
        if (lazyOperation === undefined || !isIterable(output)) {
            var operation = operations[operationIndex];
            output = operation(output);
            operationIndex += 1;
            continue;
        }
        var lazySequence = [];
        for (var index = operationIndex; index < operations.length; index++) {
            var lazyOp = lazyOperations[index];
            if (lazyOp === undefined) {
                break;
            }
            lazySequence.push(lazyOp);
            if (lazyOp.isSingle) {
                break;
            }
        }
        var accumulator = [];
        var iterator = output[Symbol.iterator]();
        while (true) {
            var result = iterator.next();
            if ((_a = result.done) !== null && _a !== void 0 ? _a : false) {
                break;
            }
            var shouldExitEarly = _processItem(result.value, accumulator, lazySequence);
            if (shouldExitEarly) {
                break;
            }
        }
        var isSingle = lazySequence[lazySequence.length - 1].isSingle;
        output = isSingle ? accumulator[0] : accumulator;
        operationIndex += lazySequence.length;
    }
    return output;
}
function _processItem(item, accumulator, lazySequence) {
    var _a;
    if (lazySequence.length === 0) {
        accumulator.push(item);
        return false;
    }
    var currentItem = item;
    var lazyResult = { done: false, hasNext: false };
    var isDone = false;
    for (var operationsIndex = 0; operationsIndex < lazySequence.length; operationsIndex++) {
        var lazyFn = lazySequence[operationsIndex];
        var isIndexed = lazyFn.isIndexed, index = lazyFn.index, items = lazyFn.items;
        items.push(currentItem);
        lazyResult = isIndexed
            ? lazyFn(currentItem, index, items)
            : lazyFn(currentItem);
        lazyFn.index += 1;
        if (lazyResult.hasNext) {
            if ((_a = lazyResult.hasMany) !== null && _a !== void 0 ? _a : false) {
                for (var _i = 0, _b = lazyResult.next; _i < _b.length; _i++) {
                    var subItem = _b[_i];
                    var subResult = _processItem(subItem, accumulator, lazySequence.slice(operationsIndex + 1));
                    if (subResult) {
                        return true;
                    }
                }
                return false;
            }
            currentItem = lazyResult.next;
        }
        if (!lazyResult.hasNext) {
            break;
        }
        if (lazyResult.done) {
            isDone = true;
        }
    }
    if (lazyResult.hasNext) {
        accumulator.push(currentItem);
    }
    if (isDone) {
        return true;
    }
    return false;
}
function prepareLazyOperation(op) {
    var lazy = op.lazy, lazyArgs = op.lazyArgs;
    var fn = lazy.apply(void 0, (lazyArgs !== null && lazyArgs !== void 0 ? lazyArgs : []));
    return Object.assign(fn, {
        isIndexed: lazy.indexed,
        isSingle: lazy.single,
        index: 0,
        items: [],
    });
}
function isIterable(something) {
    return (typeof something === "string" ||
        (typeof something === "object" &&
            something !== null &&
            Symbol.iterator in something));
}
