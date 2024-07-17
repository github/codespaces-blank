"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.List = void 0;
const index_js_1 = require("../../Text/index.js");
const block_js_1 = require("./block.js");
const helpers_js_1 = require("./helpers.js");
const leaf_js_1 = require("./leaf.js");
const node_js_1 = require("./node.js");
class List extends node_js_1.Node {
    constructor(items) {
        const items_ = items?.map((_) => (typeof _ === `string` ? new block_js_1.Block(new leaf_js_1.Leaf(_)) : _)) ?? [];
        super();
        this.items = items_.filter((_) => _ !== null);
        this.parameters = {};
    }
    setParameters(parameters) {
        this.parameters = parameters;
        return this;
    }
    render(context) {
        const bullet = {
            graphic: this.parameters.bullet?.graphic ?? `*`,
            align: {
                horizontal: this.parameters.bullet?.align?.horizontal ?? `left`,
            },
        };
        const bullets = ` `
            .repeat(this.items.length)
            .split(` `)
            .map((_, index) => (typeof bullet.graphic === `function` ? bullet.graphic(index) : bullet.graphic));
        const gutterWidth = Math.max(...bullets.map((_) => index_js_1.Text.getLength(_)));
        const gutterWidthWithSpacing = gutterWidth + 1;
        const context_ = {
            ...context,
            maxWidth: (context.maxWidth ?? 1000) - gutterWidthWithSpacing,
        };
        const items = this.items.map((item) => item.render(context_).value);
        let value = items
            .map((_, index) => {
            return index_js_1.Text.joinColumns([[index_js_1.Text.minSpan(bullet.align.horizontal, gutterWidth, bullets[index])], index_js_1.Text.toLines(_)], ` `);
        })
            .join(index_js_1.Text.chars.newline);
        if (this.parameters.padding) {
            value = (0, helpers_js_1.applyPadding)(value, this.parameters.padding, context);
        }
        const lines = items.flatMap(index_js_1.Text.toLines);
        const intrinsicWidth = Math.max(...lines.map((_) => index_js_1.Text.getLength(_)));
        const intrinsicHeight = lines.length;
        return {
            shape: {
                intrinsicWidth,
                intrinsicHeight,
                desiredWidth: null,
            },
            value: value,
        };
    }
}
exports.List = List;
//# sourceMappingURL=list.js.map