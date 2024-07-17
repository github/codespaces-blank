"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Term = void 0;
const chalk_js_1 = require("./singletons/chalk.js");
var Term;
(function (Term) {
    Term.colors = {
        mute: (text) => chalk_js_1.chalk.grey(text),
        dim: (text) => chalk_js_1.chalk.dim(chalk_js_1.chalk.grey(text)),
        accent: (text) => chalk_js_1.chalk.yellow(text),
        alert: (text) => chalk_js_1.chalk.red(text),
        alertBoldBg: (text) => chalk_js_1.chalk.bgRedBright(text),
        positiveBold: (text) => chalk_js_1.chalk.bold(Term.colors.positive(text)),
        positive: (text) => chalk_js_1.chalk.green(text),
        secondary: (text) => chalk_js_1.chalk.blue(text),
    };
})(Term || (exports.Term = Term = {}));
//# sourceMappingURL=term.js.map