"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
const helpers_js_1 = require("../../../helpers.js");
const index_js_1 = require("../../Text/index.js");
const node_js_1 = require("./node.js");
class Table extends node_js_1.Node {
    constructor(rows) {
        super();
        this.rows = rows ?? [];
        this.headers = [];
        this.parameters = {};
    }
    setParameters(parameters) {
        this.parameters = parameters;
        return this;
    }
    render(context) {
        const separators = {
            column: this.parameters.separators?.column ?? ` ${index_js_1.Text.chars.pipe} `,
            row: (width) => {
                const separator = this.parameters.separators?.row === undefined ? `-` : this.parameters.separators?.row;
                if (separator === null) {
                    return index_js_1.Text.chars.newline;
                }
                return `${index_js_1.Text.chars.newline}${separator.repeat(width)}${index_js_1.Text.chars.newline}`;
            },
        };
        const rows = this.rows.map((row) => {
            const total = row.length;
            const rowsInner = row.map((cell, index) => {
                const r1 = cell.render({
                    phase: `inner`,
                    color: context.color,
                    maxWidth: context.maxWidth,
                    height: context.height,
                    index: {
                        total,
                        isFirst: index === 0,
                        isLast: index === total - 1,
                        position: index,
                    },
                });
                return r1;
            });
            const maxCellHeight = Math.max(...rowsInner.map((_) => _.shape.intrinsicHeight));
            const rowsOuter = row.map((cell, index) => {
                const r2 = cell.render({
                    phase: `outer`,
                    color: context.color,
                    maxWidth: context.maxWidth,
                    height: maxCellHeight,
                    index: {
                        total,
                        isFirst: index === 0,
                        isLast: index === total - 1,
                        position: index,
                    },
                });
                return r2;
            });
            return rowsOuter.map((_) => _.value);
        });
        const headers = this.headers.map((cell) => cell.render(context).value);
        const rowsAndHeaders = this.headers.length > 0 ? [headers, ...rows] : rows;
        const maxWidthOfEachColumn = (0, helpers_js_1.invertTable)(rowsAndHeaders).map((col) => Math.max(...col.flatMap(index_js_1.Text.toLines).map((_) => index_js_1.Text.getLength(_))));
        const rowsWithCellWidthsNormalized = rowsAndHeaders.map((row) => {
            const maxNumberOfLinesAmongColumns = Math.max(...row.map(index_js_1.Text.toLines).map((lines) => lines.length));
            const row_ = row.map((col) => {
                const numberOfLines = index_js_1.Text.toLines(col).length;
                if (numberOfLines < maxNumberOfLinesAmongColumns) {
                    return col + index_js_1.Text.chars.newline.repeat(maxNumberOfLinesAmongColumns - numberOfLines);
                }
                return col;
            });
            const row__ = row_.map((col, i) => index_js_1.Text.mapLines(col, (line) => index_js_1.Text.padWithin(`right`, maxWidthOfEachColumn[i] ?? 0, ` `, line)));
            return row__;
        });
        const rowsWithCellsJoined = rowsWithCellWidthsNormalized.map((r) => index_js_1.Text.joinColumns(r.map(index_js_1.Text.toLines), separators.column));
        const width = Math.max(...rowsWithCellsJoined.flatMap(index_js_1.Text.toLines).map((_) => index_js_1.Text.getLength(_)));
        const value = rowsWithCellsJoined.join(separators.row(width));
        return {
            shape: {
                intrinsicWidth: 0,
                intrinsicHeight: 0,
                desiredWidth: 0,
            },
            value: value,
        };
    }
}
exports.Table = Table;
//# sourceMappingURL=table.js.map