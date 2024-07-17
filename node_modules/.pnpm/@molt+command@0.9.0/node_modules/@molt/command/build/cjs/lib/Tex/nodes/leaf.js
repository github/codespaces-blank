"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Leaf = void 0;
const index_js_1 = require("../../Text/index.js");
const node_js_1 = require("./node.js");
class Leaf extends node_js_1.Node {
    constructor(value) {
        super();
        this.value = value;
    }
    render(context) {
        const lines = index_js_1.Text.lines(context.maxWidth ?? 1000, this.value);
        const value = lines.join(index_js_1.Text.chars.newline);
        const intrinsicWidth = Math.max(...lines.map((_) => index_js_1.Text.getLength(_)));
        const intrinsicHeight = lines.length;
        const valueColored = context.color ? context.color(value) : value;
        return {
            shape: {
                intrinsicWidth,
                intrinsicHeight,
                desiredWidth: null,
            },
            value: valueColored,
        };
    }
}
exports.Leaf = Leaf;
//# sourceMappingURL=leaf.js.map