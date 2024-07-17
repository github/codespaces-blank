import { chalk } from './singletons/chalk.js';
export var Term;
(function (Term) {
    Term.colors = {
        mute: (text) => chalk.grey(text),
        dim: (text) => chalk.dim(chalk.grey(text)),
        accent: (text) => chalk.yellow(text),
        alert: (text) => chalk.red(text),
        alertBoldBg: (text) => chalk.bgRedBright(text),
        positiveBold: (text) => chalk.bold(Term.colors.positive(text)),
        positive: (text) => chalk.green(text),
        secondary: (text) => chalk.blue(text),
    };
})(Term || (Term = {}));
//# sourceMappingURL=term.js.map