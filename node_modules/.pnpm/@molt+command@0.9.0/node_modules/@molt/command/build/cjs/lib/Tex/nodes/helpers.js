"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyPadding = void 0;
const index_js_1 = require("../../Text/index.js");
const applyPadding = (value, padding, context) => {
    value =
        padding.topBetween && !context.index.isFirst
            ? index_js_1.Text.chars.newline.repeat(padding.topBetween) + value
            : value;
    value = padding.top ? index_js_1.Text.chars.newline.repeat(padding.top) + value : value;
    value = padding.left ? index_js_1.Text.indentBlock(value, index_js_1.Text.chars.space.repeat(padding.left)) : value;
    value = padding.bottom ? value + index_js_1.Text.chars.newline.repeat(padding.bottom) : value;
    value =
        padding.bottomBetween && !context.index.isLast
            ? value + index_js_1.Text.chars.newline.repeat(padding.bottomBetween)
            : value;
    value = padding.right
        ? index_js_1.Text.fromLines(index_js_1.Text.toLines(value).map((_) => _ + index_js_1.Text.chars.space.repeat(padding.right)))
        : value;
    return value;
};
exports.applyPadding = applyPadding;
//# sourceMappingURL=helpers.js.map