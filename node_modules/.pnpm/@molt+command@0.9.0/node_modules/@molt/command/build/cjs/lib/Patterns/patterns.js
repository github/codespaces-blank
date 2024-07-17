"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emoji = exports.ipv6 = exports.ipv4 = exports.dateTime = exports.email = exports.uuid = exports.cuid2 = exports.ulid = exports.cuid = void 0;
exports.cuid = /^c[^\s-]{8,}$/i;
/**
 * @see https://github.com/ulid/javascript
 */
exports.ulid = /[0-9A-HJKMNP-TV-Z]{26}/;
exports.cuid2 = /^[a-z][a-z0-9]*$/;
/**
 * @see https://stackoverflow.com/a/46181/1550155
 */
exports.uuid = /^([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports.email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|([^-]([a-zA-Z0-9-]*\.)+[a-zA-Z]{2,}))$/;
/**
 * Adapted from https://stackoverflow.com/a/3143231
 */
const dateTime = (args) => {
    if (args.precision) {
        if (args.offset) {
            return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${args.precision}}(([+-]\\d{2}(:?\\d{2})?)|Z)$`);
        }
        else {
            return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${args.precision}}Z$`);
        }
    }
    else if (args.precision === 0) {
        if (args.offset) {
            return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(([+-]\\d{2}(:?\\d{2})?)|Z)$`);
        }
        else {
            return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$`);
        }
    }
    else {
        if (args.offset) {
            /**
             * @see https://regex101.com/r/MrD2xO/1
             */
            return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(([+-]\\d{2}(:?\\d{2})?)|Z)$`);
        }
        else {
            /**
             * @see https://regex101.com/r/2XwvdZ/1
             */
            return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?Z$`);
        }
    }
};
exports.dateTime = dateTime;
/**
 * @see https://github.com/colinhacks/zod/blob/28c19273658b164c53c149785fa7a8187c428ad4/src/types.ts#L550C19-L550C43
 */
exports.ipv4 = /^(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))$/;
/**
 * @see https://github.com/colinhacks/zod/blob/28c19273658b164c53c149785fa7a8187c428ad4/src/types.ts#L550C19-L550C43
 */
exports.ipv6 = /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/;
/**
 * @see https://thekevinscott.com/emojis-in-javascript/#writing-a-regular-expression
 */
exports.emoji = /^(\p{Extended_Pictographic}|\p{Emoji_Component})+$/u;
//# sourceMappingURL=patterns.js.map