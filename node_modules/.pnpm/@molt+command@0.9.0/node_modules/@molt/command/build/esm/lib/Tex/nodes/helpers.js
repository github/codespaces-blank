import { Text } from '../../Text/index.js';
export const applyPadding = (value, padding, context) => {
    value =
        padding.topBetween && !context.index.isFirst
            ? Text.chars.newline.repeat(padding.topBetween) + value
            : value;
    value = padding.top ? Text.chars.newline.repeat(padding.top) + value : value;
    value = padding.left ? Text.indentBlock(value, Text.chars.space.repeat(padding.left)) : value;
    value = padding.bottom ? value + Text.chars.newline.repeat(padding.bottom) : value;
    value =
        padding.bottomBetween && !context.index.isLast
            ? value + Text.chars.newline.repeat(padding.bottomBetween)
            : value;
    value = padding.right
        ? Text.fromLines(Text.toLines(value).map((_) => _ + Text.chars.space.repeat(padding.right)))
        : value;
    return value;
};
//# sourceMappingURL=helpers.js.map