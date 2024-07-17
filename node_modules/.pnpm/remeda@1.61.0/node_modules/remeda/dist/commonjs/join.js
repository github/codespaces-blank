"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.join = void 0;
var purry_1 = require("./purry");
function join() {
    return (0, purry_1.purry)(joinImplementation, arguments);
}
exports.join = join;
var joinImplementation = function (data, glue) { return data.join(glue); };
