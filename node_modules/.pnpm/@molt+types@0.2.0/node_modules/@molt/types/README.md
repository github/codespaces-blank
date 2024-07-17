# @molt/types

⛑ Advanced Types for parsing CLI flags and more.

## Installation

```
npm add @molt/types
```

## Namespaces

### `FlagName`

The `FlagName` namespace provides a `Parse` type and some other utility types. `Parse` turns an expression of CLI flags into structured object type data _at the type level_.

#### Features

- Capture long flag
- Capture short flag
- Capture alias short flags
- Capture alias long flags
- Flexible syntax
  - Optional leading dashes `--`/`-`
  - Kebab/camel case agnostic `fooBar`/`foo-bar`
- Clear human-friendly error messages when parsing fails.
  - Catch name duplicate
  - Enforce reserved names
- Statically Normalize kebob case to camel case

#### API

`.parse`

#### Examples

```ts
// Errors

FlagName.Parse<''>
// Error: You must specify at least one name for your flag.
FlagName.Parse<'--foo-bar', { reservedNames: 'foo-bar'; usedNames: undefined }>
FlagName.Parse<'--foo-bar', { reservedNames: 'fooBar'; usedNames: undefined }>
// Error: The name "foo-bar" cannot be used because it is reserved.
FlagName.Parse<'--fooBar', { reservedNames: 'foo-bar'; usedNames: undefined }>
// Error: The name "fooBar" cannot be used because it is reserved.
FlagName.Parse<'-a', { usedNames: 'a'; reservedNames: undefined }>
// Error: The name "a" cannot be used because it is already used for another flag.
FlagName.Parse<'--v'>
//Error: A long flag must be two (2) or more characters but you have: '--v
FlagName.Parse<'-foo'>
// Error: A short flag must be exactly one (1) character but you have: '-foo'.
FlagName.Parse<'--foo --foo'>
// Error: Your alias "foo" is a duplicate.

```

```ts
import { FlagName } from '@molt/types'

const defineFlag = <Name>(
  name: FlagName.Errors.$Is<FlagName.Parse<Name>> extends true ? FlagName.Parse<Name> : Name
) => {
  // ...
}

defineFlag(``) // Static type error
defineFlag(`-`) // Static type error
defineFlag(`--`) // Static type error
defineFlag(`--a`) // Static type error
defineFlag(`-ab`) // Static type error
defineFlag(`--foo --foo`) // Static type error
defineFlag(`--foo-bar --fooBar`) // Static type error
defineFlag(`--version -`) // Static type error
defineFlag(`-v -v`) // Static type error
defineFlag(`--version`) // ok
defineFlag(`--version --ver`) // ok
defineFlag(`--version --ver -v`) // ok
defineFlag(`-v`) // ok
```
