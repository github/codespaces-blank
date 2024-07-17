import snakeCase from 'lodash.snakecase';
import stringLength from 'string-length';
export const line = (text = ``) => `${text}\n`;
export const getLength = stringLength;
export const mapLines = (text, fn) => {
    return fromLines(toLines(text).map(fn));
};
export const joinColumns = (cols, separator) => {
    const maxLineCountAmongColumns = Math.max(...cols.map((_) => _.length));
    const linesSpanningColumns = [];
    const colWidths = cols.map((col) => Math.max(...col.map((_) => getLength(_))));
    for (let lineNumber = 0; lineNumber < maxLineCountAmongColumns; lineNumber++) {
        const targetLinesAcrossColumns = cols.map((col) => col[lineNumber] ?? ``);
        const line = targetLinesAcrossColumns
            .map((line, i) => minSpan(`left`, colWidths[i] ?? 0, line))
            .join(separator);
        linesSpanningColumns.push(line);
    }
    return fromLines(linesSpanningColumns);
};
export const minSpan = (alignContent, width, content) => {
    return pad(alignContent === `left` ? `right` : `left`, Math.max(0, width - getLength(content)), chars.space, content);
};
export const padWithin = (side, size, char, text) => {
    const padSize = size - stringLength(text);
    if (padSize <= 0)
        return text;
    return pad(side, padSize, char, text);
};
export const pad = (side, size, char, text) => {
    return side === `left` ? char.repeat(size) + text : text + char.repeat(size);
};
export const underline = (string) => {
    return line(string) + chars.lineH.repeat(string.length);
};
export const joinListEnglish = (list) => {
    if (list.length === 0)
        return ``;
    if (list.length === 1)
        return list[0];
    if (list.length === 2)
        return `${list[0]} or ${list[1]}`;
    return `${list.slice(0, list.length - 1).join(`, `)} or ${list[list.length - 1]}`;
};
export const col = (params) => {
    return params;
};
export const row = (columns) => {
    const columnsSized = columns.map((_) => {
        return {
            lines: _.lines,
            width: _.width ?? _.lines.reduce((widthSoFar, line) => Math.max(widthSoFar, stringLength(line)), 0),
            separator: _.separator ?? defaultColumnSeparator,
        };
    });
    const lineCount = Math.max(...columns.map((_) => _.lines.length));
    let currentLine = 0;
    const lines = [];
    while (currentLine < lineCount) {
        const line = columnsSized
            .map((col) => ({
            content: minSpan(`left`, col.width, col.lines[currentLine] ?? ``),
            separator: col.separator,
        }))
            .reduce((line, col, currentLine) => (currentLine === 0 ? col.content : line + col.separator + col.content), ``);
        lines.push(line);
        currentLine++;
    }
    return lines.join(chars.newline);
};
export const toEnvarNameCase = (name) => snakeCase(name).toUpperCase();
export const lines = (width, text) => {
    const lines = text.split(`\n`);
    const linesFitted = lines.flatMap((text) => {
        const lines = [];
        let textToConsume = text;
        while (textToConsume.length > 0) {
            const result = visualStringTakeWords(textToConsume, width);
            const textLines = result.taken.replace(/\n$/, ``).split(chars.newline);
            lines.push(...textLines);
            textToConsume = result.remaining;
        }
        return lines;
    });
    return linesFitted;
};
export const chars = {
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
export const indentBlock = (text, symbol = `  `) => {
    return indentColumn(text.split(chars.newline), symbol).join(chars.newline);
};
export const fromLines = (column) => {
    return column.join(chars.newline);
};
export const toLines = (text) => {
    return text.split(chars.newline);
};
export const indentColumn = (column, symbolOrSymbolMaker = ` `) => {
    return column.map((line, index) => (typeof symbolOrSymbolMaker === `string` ? symbolOrSymbolMaker : symbolOrSymbolMaker(index)) + line);
};
export const indentBlockWith = (text, indenter) => {
    return indentColumnWith(text.split(chars.newline), indenter).join(chars.newline);
};
export const indentColumnWith = (column, indenter) => {
    return column.map((line, index) => indenter(line, index) + line);
};
export const defaultColumnSeparator = chars.space.repeat(3);
export const visualStringTake = (string, size) => {
    let taken = string.slice(0, size);
    let i = 0;
    while (stringLength(taken) < size) {
        if (taken.length === string.length)
            break;
        i++;
        taken = string.slice(0, size + i);
    }
    return taken;
};
export const maxWidth = (string) => {
    return Math.max(...toLines(string).map((_) => getLength(_)));
};
export const measure = (string) => {
    const lines = toLines(string);
    const maxWidth = Math.max(...lines.map((_) => getLength(_)));
    const height = lines.length;
    return {
        height,
        maxWidth,
    };
};
export const visualStringTakeWords = (string, size) => {
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
        if (stringLength(word) > size) {
            // TODO hyphen the word?
            words.shift();
            taken += String(word);
            break;
        }
        // Cannot take any more, taking another word would exceed limit:
        const nextString = taken ? `${taken} ${word}` : word;
        if (stringLength(nextString) > size) {
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
const joinWords = (words) => {
    return words.reduce((string, word, i) => {
        return i === 0 ? word : string + (string[string.length - 1] === chars.newline ? `` : ` `) + word;
    }, ``);
};
const splitWords = (string) => {
    const words = [];
    let currentWord = ``;
    let currentWordReady = false;
    for (const char of string.split(``)) {
        if (char === chars.space && currentWordReady) {
            words.push(currentWord);
            // If the next word is on a new line then do not disregard the leading space
            currentWord = currentWord[currentWord.length - 1] === chars.newline ? ` ` : ``;
            currentWordReady = false;
            continue;
        }
        if (char !== chars.space) {
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