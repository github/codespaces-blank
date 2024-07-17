"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debounce = void 0;
function debounce(func, _a) {
    var waitMs = _a.waitMs, _b = _a.timing, timing = _b === void 0 ? "trailing" : _b, maxWaitMs = _a.maxWaitMs;
    if (maxWaitMs !== undefined && waitMs !== undefined && maxWaitMs < waitMs) {
        throw new Error("debounce: maxWaitMs (".concat(maxWaitMs, ") cannot be less than waitMs (").concat(waitMs, ")"));
    }
    var coolDownTimeoutId;
    var maxWaitTimeoutId;
    var latestCallArgs;
    var result;
    var handleInvoke = function () {
        if (latestCallArgs === undefined) {
            return;
        }
        if (maxWaitTimeoutId !== undefined) {
            var timeoutId = maxWaitTimeoutId;
            maxWaitTimeoutId = undefined;
            clearTimeout(timeoutId);
        }
        var args = latestCallArgs;
        latestCallArgs = undefined;
        result = func.apply(void 0, args);
    };
    var handleCoolDownEnd = function () {
        if (coolDownTimeoutId === undefined) {
            return;
        }
        var timeoutId = coolDownTimeoutId;
        coolDownTimeoutId = undefined;
        clearTimeout(timeoutId);
        if (latestCallArgs !== undefined) {
            handleInvoke();
        }
    };
    var handleDebouncedCall = function (args) {
        latestCallArgs = args;
        if (maxWaitMs !== undefined && maxWaitTimeoutId === undefined) {
            maxWaitTimeoutId = setTimeout(handleInvoke, maxWaitMs);
        }
    };
    return {
        call: function () {
            var _a;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (coolDownTimeoutId === undefined) {
                if (timing === "trailing") {
                    handleDebouncedCall(args);
                }
                else {
                    result = func.apply(void 0, args);
                }
            }
            else {
                if (timing !== "leading") {
                    handleDebouncedCall(args);
                }
                var timeoutId = coolDownTimeoutId;
                coolDownTimeoutId = undefined;
                clearTimeout(timeoutId);
            }
            coolDownTimeoutId = setTimeout(handleCoolDownEnd, (_a = waitMs !== null && waitMs !== void 0 ? waitMs : maxWaitMs) !== null && _a !== void 0 ? _a : 0);
            return result;
        },
        cancel: function () {
            if (coolDownTimeoutId !== undefined) {
                var timeoutId = coolDownTimeoutId;
                coolDownTimeoutId = undefined;
                clearTimeout(timeoutId);
            }
            if (maxWaitTimeoutId !== undefined) {
                var timeoutId = maxWaitTimeoutId;
                maxWaitTimeoutId = undefined;
                clearTimeout(timeoutId);
            }
            latestCallArgs = undefined;
        },
        flush: function () {
            handleCoolDownEnd();
            return result;
        },
        get isPending() {
            return coolDownTimeoutId !== undefined;
        },
        get cachedValue() {
            return result;
        },
    };
}
exports.debounce = debounce;
