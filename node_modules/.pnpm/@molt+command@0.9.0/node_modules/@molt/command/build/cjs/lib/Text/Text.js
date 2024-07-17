"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.visualStringTakeWords = exports.measure = exports.maxWidth = exports.visualStringTake = exports.defaultColumnSeparator = exports.indentColumnWith = exports.indentBlockWith = exports.indentColumn = exports.toLines = exports.fromLines = exports.indentBlock = exports.chars = exports.lines = exports.toEnvarNameCase = exports.row = exports.col = exports.joinListEnglish = exports.underline = exports.pad = exports.padWithin = exports.minSpan = exports.joinColumns = exports.mapLines = exports.getLength = exports.line = void 0;
const lodash_snakecase_1 = __importDefault(require("lodash.snakecase"));
const string_length_1 = __importDefault(require("string-length"));
const line = (text = ``) => `${text}\n`;
exports.line = line;
exports.getLength = string_length_1.default;
const mapLines = (text, fn) => {
    return (0, exports.fromLines)((0, exports.toLines)(text).map(fn));
};
exports.mapLines = mapLines;
const joinColumns = (cols, separator) => {
    const maxLineCountAmongColumns = Math.max(...cols.map((_) => _.length));
    const linesSpanningColumns = [];
    const colWidths = cols.map((col) => Math.max(...col.map((_) => (0, exports.getLength)(_))));
    for (let lineNumber = 0; lineNumber < maxLineCountAmongColumns; lineNumber++) {
        const targetLinesAcrossColumns = cols.map((col) => col[lineNumber] ?? ``);
        const line = targetLinesAcrossColumns
            .map((line, i) => (0, exports.minSpan)(`left`, colWidths[i] ?? 0, line))
            .join(separator);
        linesSpanningColumns.push(line);
    }
    return (0, exports.fromLines)(linesSpanningColumns);
};
exports.joinColumns = joinColumns;
const minSpan = (alignContent, width, content) => {
    return (0, exports.pad)(alignContent === `left` ? `right` : `left`, Math.max(0, width - (0, exports.getLength)(content)), exports.chars.space, content);
};
exports.minSpan = minSpan;
const padWithin = (side, size, char, text) => {
    const padSize = size - (0, string_length_1.default)(text);
    if (padSize <= 0)
        return text;
    return (0, exports.pad)(side, padSize, char, text);
};
exports.padWithin = padWithin;
const pad = (side, size, char, text) => {
    return side === `left` ? char.repeat(size) + text : text + char.repeat(size);
};
exports.pad = pad;
const underline = (string) => {
    return (0, exports.line)(string) + exports.chars.lineH.repeat(string.length);
};
exports.underline = underline;
const joinListEnglish = (list) => {
    if (list.length === 0)
        return ``;
    if (list.length === 1)
        return list[0];
    if (list.length === 2)
        return `${list[0]} or ${list[1]}`;
    return `${list.slice(0, list.length - 1).join(`, `)} or ${list[list.length - 1]}`;
};
exports.joinListEnglish = joinListEnglish;
const col = (params) => {
    return params;
};
exports.col = col;
const row = (columns) => {
    const columnsSized = columns.map((_) => {
        return {
            lines: _.lines,
            width: _.width ?? _.lines.reduce((widthSoFar, line) => Math.max(widthSoFar, (0, string_length_1.default)(line)), 0),
            separator: _.separator ?? exports.defaultColumnSeparator,
        };
    });
    const lineCount = Math.max(...columns.map((_) => _.lines.length));
    let currentLine = 0;
    const lines = [];
    while (currentLine < lineCount) {
        const line = columnsSized
            .map((col) => ({
            content: (0, exports.minSpan)(`left`, col.width, col.lines[currentLine] ?? ``),
            separator: col.separator,
        }))
            .reduce((line, col, currentLine) => (currentLine === 0 ? col.content : line + col.separator + col.content), ``);
        lines.push(line);
        currentLine++;
    }
    return lines.join(exports.chars.newline);
};
exports.row = row;
const toEnvarNameCase = (name) => (0, lodash_snakecase_1.default)(name).toUpperCase();
exports.toEnvarNameCase = toEnvarNameCase;
const lines = (width, text) => {
    const lines = text.split(`\n`);
    const linesFitted = lines.flatMap((text) => {
        const lines = [];
        let textToConsume = text;
        while (textToConsume.length > 0) {
            const result = (0, exports.visualStringTakeWords)(textToConsume, width);
            const textLines = result.taken.replace(/\n$/, ``).split(exports.chars.newline);
            lines.push(...textLines);
            textToConsume = result.remaining;
        }
        return lines;
    });
    return linesFitted;
};
exports.lines = lines;
exports.chars = {
    arrowRight: `→`,
    borders: {
        vertical: `│`,
        horizontal: `─`,
        leftTop: `┌`,
        leftBottom: `└`,
        rightTop: `┐`,
        rightBottom: `┘`,
    },
    lineH: `─`,
    lineHBold: `━`,
    x: `✕`,
    check: `✓`,
    newline: `\n`,
    space: ` `,
    pipe: `|`,
};
const indentBlock = (text, symbol = `  `) => {
    return (0, exports.indentColumn)(text.split(exports.chars.newline), symbol).join(exports.chars.newline);
};
exports.indentBlock = indentBlock;
const fromLines = (column) => {
    return column.join(exports.chars.newline);
};
exports.fromLines = fromLines;
const toLines = (text) => {
    return text.split(exports.chars.newline);
};
exports.toLines = toLines;
const indentColumn = (column, symbolOrSymbolMaker = ` `) => {
    return column.map((line, index) => (typeof symbolOrSymbolMaker === `string` ? symbolOrSymbolMaker : symbolOrSymbolMaker(index)) + line);
};
exports.indentColumn = indentColumn;
const indentBlockWith = (text, indenter) => {
    return (0, exports.indentColumnWith)(text.split(exports.chars.newline), indenter).join(exports.chars.newline);
};
exports.indentBlockWith = indentBlockWith;
const indentColumnWith = (column, indenter) => {
    return column.map((line, index) => indenter(line, index) + line);
};
exports.indentColumnWith = indentColumnWith;
exports.defaultColumnSeparator = exports.chars.space.repeat(3);
const visualStringTake = (string, size) => {
    let taken = string.slice(0, size);
    let i = 0;
    while ((0, string_length_1.default)(taken) < size) {
        if (taken.length === string.length)
            break;
        i++;
        taken = string.slice(0, size + i);
    }
    return taken;
};
exports.visualStringTake = visualStringTake;
const maxWidth = (string) => {
    return Math.max(...(0, exports.toLines)(string).map((_) => (0, exports.getLength)(_)));
};
exports.maxWidth = maxWidth;
const measure = (string) => {
    const lines = (0, exports.toLines)(string);
    const maxWidth = Math.max(...lines.map((_) => (0, exports.getLength)(_)));
    const height = lines.length;
    return {
        height,
        maxWidth,
    };
};
exports.measure = measure;
const visualStringTakeWords = (string, size) => {
    const words = splitWords(string);
    let taken = ``;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        // There are no words (empty string)
        if (words.length === 0) {
            break;
        }
        const word = String(words[0]);
        // single word is too long for asked take
        if ((0, string_length_1.default)(word) > size) {
            // TODO hyphen the word?
            words.shift();
            taken += String(word);
            break;
        }
        // Cannot take any more, taking another word would exceed limit:
        const nextString = taken ? `${taken} ${word}` : word;
        if ((0, string_length_1.default)(nextString) > size) {
            break;
        }
        words.shift();
        taken += (taken.length ? ` ` : ``) + word;
    }
    const remaining = joinWords(words);
    const result = {
        taken,
        remaining,
    };
    return result;
};
exports.visualStringTakeWords = visualStringTakeWords;
const joinWords = (words) => {
    return words.reduce((string, word, i) => {
        return i === 0 ? word : string + (string[string.length - 1] === exports.chars.newline ? `` : ` `) + word;
    }, ``);
};
const splitWords = (string) => {
    const words = [];
    let currentWord = ``;
    let currentWordReady = false;
    for (const char of string.split(``)) {
        if (char === exports.chars.space && currentWordReady) {
            words.push(currentWord);
            // If the next word is on a new line then do not disregard the leading space
            currentWord = currentWord[currentWord.length - 1] === exports.chars.newline ? ` ` : ``;
            currentWordReady = false;
            continue;
        }
        if (char !== exports.chars.space) {
            currentWordReady = true;
        }
        currentWord += char;
    }
    if (currentWord.length > 0) {
        words.push(currentWord);
    }
    return words;
};
//# sourceMappingURL=Text.js.map