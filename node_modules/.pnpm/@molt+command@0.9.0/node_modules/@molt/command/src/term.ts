import { chalk } from './singletons/chalk.js'

export namespace Term {
  export const colors = {
    mute: (text: string) => chalk.grey(text),
    dim: (text: string) => chalk.dim(chalk.grey(text)),
    accent: (text: string) => chalk.yellow(text),
    alert: (text: string) => chalk.red(text),
    alertBoldBg: (text: string) => chalk.bgRedBright(text),
    positiveBold: (text: string) => chalk.bold(colors.positive(text)),
    positive: (text: string) => chalk.green(text),
    secondary: (text: string) => chalk.blue(text),
  }
}
