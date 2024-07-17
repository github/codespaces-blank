"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const utils_js_1 = require("../../lib/utils.js");
const create = (message) => new Error(`Alge User Mistake: ${(0, utils_js_1.ensurePeriod)(message)}`);
exports.create = create;
//# sourceMappingURL=UserMistake.js.map