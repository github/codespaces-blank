import { parseClientFieldName } from './FieldName.js';
import { parseClientOn } from './on.js';
export const parseClientFieldItem = (field) => {
    const on = parseClientOn(field);
    if (on)
        return on;
    return parseClientFieldName(field);
};
//# sourceMappingURL=FieldItem.js.map