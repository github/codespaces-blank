# alge 🌱

[![trunk](https://github.com/jasonkuhrt/alge/actions/workflows/trunk.yml/badge.svg)](https://github.com/jasonkuhrt/alge/actions/workflows/trunk.yml)
[![npm version](https://img.shields.io/npm/v/alge.svg)](https://www.npmjs.com/package/alge)

> Hey 👋, FYI here are some other TypeScript-first libraries I've created that might interest you:
>
> [`@molt/command`](https://github.com/jasonkuhrt/molt/tree/main/packages/@molt/command) for building simple scripts and command lines.

## TL;DR

Library for creating [Algebraic Data Types](https://en.wikipedia.org/wiki/Algebraic_data_type) in TypeScript. Pronounced "AL GEE" like [the plant](https://en.wikipedia.org/wiki/Algae) ([or whatever it is](https://www.indefenseofplants.com/blog/2018/2/20/are-algae-plants)). Schemas powered by [Zod](https://github.com/colinhacks/zod) <3.

An ADT is built like so:

```ts
import { Alge } from 'alge'
import { z } from 'zod'

const Length = z.number().positive()

//           o---------- ADT Controller
//           |            o--------- ADT Builder
export const Shape = Alge.data(`Shape`, {
  Rectangle: {
    width: Length,
    height: Length,
  },
  Circle: {
    radius: Length,
  },
  Square: {
    size: Length,
  },
})
```

Building an ADT returns a _controller_. Controllers are an API for your data, like constructors and type guards. Constructed data is nothing special, just good old JavaScript POJOs.

```ts
//    o--------- Member Instance
//    |        o--------- ADT Controller
//    |        |     o-------- Member Namespace
//    |        |     |      o-------- Constructor
//    |        |     |      |
const circle = Shape.Circle.create({ radius: 50 })
// { _tag: 'Circle', radius: 50 }

const square = Shape.Square.create({ size: 50 })
// { _tag: 'Square', size: 5 }

if (Shape.Circle.is(circle)) {
  console.log(`I Am Circle`)
}

const circleForTheOutsideWorld = Shape.Circle.to.json(circle)
// '{ "_tag": "Circle", "radius": 50 }'

const squareFromTheOutsideWorld = Shape.Square.from.json({ _tag: 'Square', size: 10 })
// { _tag: 'Square', size: 10 }
```

You can infer the static types from the controller:

```ts
type Shape = Alge.infer<typeof Shape>
```

You can pattern match on your constructed data:

```ts
const shape = Math.random() > 0.5 ? circle : square
const result = Alge.match(shape)
  .Circle({ radius: 13 }, () => `Got an unlucky circle!`)
  .Circle((circle) => `Got a circle of radius ${circle.radius}!`)
  .Square({ size: 13 }, () => `Got an unlucky square!`)
  .Square((square) => `Got a square of size ${square.size}!`)
  .done()
```

You can create individual records when you don't need full blown ADTs:

```ts
import { Alge } from 'alge'
import { z } from 'zod'

const Circle = Alge.record(`Circle`, { radius: z.number().positive() })
```

This is just a taster. Places you can go next:

1. [Install](#installation) and learn interactively (JSDoc is coming soon!)
1. A formal [features breakdown](#features)
1. [Code examples](/examples)
1. A simple [introduction to Algebraic Data Types](#about-algebraic-data-types) (for those unfamiliar)
1. A [video introduction](https://youtu.be/fLlVQSJx4AU) if you like that format

   [![Video Cover](docs/assets/cover.jpg)](https://youtu.be/JWvy7JXE6vw)

## Contents

<!-- toc -->

- [Installation](#installation)
- [Roadmap](#roadmap)
- [Features At a Glance](#features-at-a-glance)
- [About Algebraic Data Types](#about-algebraic-data-types)
  - [What?](#what)
  - [Why?](#why)

* [Features](#features)
  - [Records](#records)
    - [Definition (`.record`)](#definition-record)
    - [Construction (`.create`)](#construction-create)
    - [Input Defaults](#input-defaults)
    - [Input Transformation](#input-transformation)
    - [Input Validation](#input-validation)
    - [Update](#update)
    - [Metadata](#metadata)
    - [Chaining API](#chaining-api)
    - [Codecs](#codecs)
      - [Definition (`.codec`)](#definition-codec)
      - [Usage (`.to.`, `.from`)](#usage-to-from)
      - [Built In JSON](#built-in-json)
      - [OrThrow Decoders](#orthrow-decoders)
  - [Data (Algebraic Data Types)](#data-algebraic-data-types)
    - [Definition](#definition)
      - [Referencing Records](#referencing-records)
      - [Inline Records](#inline-records)
      - [Referencing Zod Objects](#referencing-zod-objects)
    - [Construction](#construction)
    - [Chaining API](#chaining-api-1)
    - [Identity (`.is`, `.is$`)](#identity-is-is)
    - [Codecs](#codecs-1)
      - [Definition (`.codec`)](#definition-codec-1)
      - [Usage (`to`, `from`)](#usage-to-from)
  - [Static Types](#static-types)
    - [Namespaces](#namespaces)
  - [String Literal Union Pattern Matching](#string-literal-union-pattern-matching)
    - [Tag Matchers](#tag-matchers)
    - [Done Versus Else](#done-versus-else)
  - [ADT Pattern Matching](#adt-pattern-matching)
    - [Tag Matchers](#tag-matchers-1)
    - [Value Matchers](#value-matchers)
    - [Mixing Matchers](#mixing-matchers)
    - [Done Versus Else](#done-versus-else-1)

<!-- tocstop -->

## Installation

```
npm add alge
```

## Roadmap

There is no timeline but there are priorities. Refer to the currently three [pinned issues](https://github.com/jasonkuhrt/alge/issues).

## Features At a Glance

- Use a "builder" API to define ADTs
  - Use Zod for schema definition
  - Define one or more codecs
- Use the "controller" API to work with data
  - Constructors
  - Type guards
  - Built in JSON codec
  - Automatic ADT level codecs (for codecs common across members)
- Pattern match on data
  - Use tag matchers
  - Use value matchers

## About Algebraic Data Types

Alge is a Type Script library for creating [Algebraic Data Types](https://en.wikipedia.org/wiki/Algebraic_data_type) (ADTs). This guide will take you from not knowing what ADTs are to why you might want to use Alge for them in your code.

### What?

Algebraic Data Types (ADTs for short) are a methodology of modelling data. They could appear in any context that is about defining and/or navigating the shape of data. One of their fundamental benefits is that they can express different states/inrecords/facts about/of data. They are the combination of two other concepts, _product types_ and _union types_.

A product type is like:

```ts
interface Foo {
  bar: string
  qux: number
}
```

A union type is like:

```ts
type Foo = 1 | 2 | 3
```

Basically, when the power of these two data modelling techniques are combined, we get something far greater than the sum of its parts: ADTs.

ADTs can particularly shine at build time. While dynamically typed programing languages ("scripting language", e.g. Ruby, JavaScript, Python, ...) can support ADTs at runtime, adding static type support into the mix increases the ADT value proposition. Then there are yet other more minor programing language features like pattern matching that if supporting ADTs make them feel that much more beneficial too.

References:

- [Wikipedia entry on ADTs](https://en.wikipedia.org/wiki/Algebraic_data_type)
- [Type Script documentation on discriminated unions](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions)

### Why?

Now that we have some understanding of _what_ ADTs are let's build some understanding about _why_ we might want to use them. To do this we'll work with an example.

Let's say we want to accept some user input about an npm package dependency version pin. It might come in the form of an exact version or a range of acceptable versions. How would we model this? Let's start without ADTs and then refactor with them to appreciate the difference. Let's assume that input parsing has been taken care of and so here we're only concerned with structured data modelling.

```ts
interface Pin {
  isExact: boolean
  patch?: number
  minor?: number
  major?: number
  release?: string
  build?: string
  range?: Array<{
    operator: `~` | `>=` | `...` // etc.
    patch: number
    minor: number
    major: number
    release?: string
    build?: string
  }>
}
```

This data modelling is flawed. There is out-of-band information about important data relationships. `release` and `build` are legitimately optional properties but `range` `patch` `minor` `major` all depend on the state of `isExact`. When `true` then `range` is undefined and the others are not, and vice-versa. In other words these configurations of the data are impossible:

```ts
const pin = {
  isExact: true,
  patch: 1,
  minor: 2,
  major: 3,
  range: [
    {
      operator: `~`,
      patch: 1,
      minor: 0,
      major: 0,
    },
  ],
}
```

```ts
const pin = {
  isExact: false,
  patch: 1,
  minor: 2,
  major: 3,
}
```

While these are possible:

```ts
const pin = {
  isExact: true,
  patch: 1,
  minor: 2,
  major: 3,
}
```

```ts
const pin = {
  isExact: true,
  patch: 1,
  minor: 2,
  major: 3,
  release: `beta`,
}
```

```ts
const pin = {
  isExact: false,
  range: [
    {
      operator: `~`,
      patch: 1,
      minor: 0,
      major: 0,
    },
  ],
}
```

But since our data modelling doesn't encode these _facts_ our code suffers. For example:

```ts
if (pin.isExact) {
  doSomething(pin.major!)
  //                       ^
}
```

Notice the `!`. Its us telling Type Script that `major` is definitely not undefined and so the type error can be ignored. In JS its even worse, as we wouldn't even be prompted to think about such cases, unless we remember to. Seems trivial in this case, but at scale day after day often with unfamiliar code a mistake will inevitably be made. Another approach could have been this:

```ts
if (pin.isExact) {
  if (!pin.major) throw new Error(`Bad pin data!`)
  doSomething(pin.major)
}
```

So, poor data modelling affects the quality of our code by our code either needing to deal with apparently possible states that are actually impossible OR by our code carefully ignoring those impossible states. Both solutions are terrible because they make code harder to read. There is more code, and the chance that wires about impossible and possible states will cross becomes a real possibility leading to potential runtime errors.

ADTs solve this. Let's refactor our Pin type into an ADT to see how!

```ts
type Pin = ExactPin | RangePin

interface ExactPin {
  tag: `ExactPin`
  patch: number
  minor: number
  major: number
  release?: string
  build?: string
}

interface RangePin {
  tag: `RangePin`
  values: Array<{
    operator: `~` | `>=` | `...` // etc.
    isExact: boolean
    patch: number
    minor: number
    major: number
    release?: string
    build?: string
  }>
}
```

Now we've encoded the possible states we cared about. Our code quality increases:

```ts
if (pin.tag === 'ExactPin') {
  doSomething(pin.major) // No problem, `pin` has been narrowed from `Pin` to `ExactPin`!
}
```

When a developer deals with values of `Pin` type they will have an immediately much better understanding of the possible states.

In fact every optional property in some data represents possibly different state representations and thus potentially a use case for an ADT. So for example we could go further with our above data modelling and define things like `ExactPreReleasePin` and `ExactPreReleaseBuildPin`:

```ts
interface ExactPreReleasePin {
  tag: `ExactPreReleasePin`
  patch: number
  minor: number
  major: number
  release: string
}
```

```ts
interface ExactPreReleaseBuildPin {
  tag: `ExactPreReleasePin`
  patch: number
  minor: number
  major: number
  release: string
  build: string
}
```

Of course like any technique there is a point where ADT modelling is probably overkill for your use-case. That said, that line might be further out than you think. For example while the above might seem excessive, it actually answers a question the previous data modelling left ambiguous which is the question of, is the following state possible?

```ts
const pin = {
  isExact: true,
  patch: 1,
  minor: 2,
  major: 3,
  build: `5`,
}
```

The answer is no! But without the ADT that _fact_ would have to managed by humans, rather than the machine.

At scale, having well modelled data can be a life saver. The up front verbosity pays dividends downstream for all the impossible branches removed from programs' possibility space. ADTs help you (or your consumers) focus on what _can actually happen_.

</br></br>

# Features

All code blocks below assume these imports:

```ts
import { Alge } from 'alge'
import { z } from 'zod'
```

## Records

### Definition (`.record`)

Use the Record Builder to define a record. At a minimum you specify the name and schema. Names should be in [pascal case](https://techterms.com/definition/pascalcase) to avoid name collisions with the Alge API (see below).

```ts
const Circle = Alge.record('Circle', {
  radius: z.number().positive(),
})
```

If you already have a Zod Object defined from somewhere else you can just pass it in:

```ts
const Circle = Alge.record('Circle', CircleSchema)
```

### Construction (`.create`)

Once you've defined a record with the Record Builder you get back a Record Controller. Use it to create instances of your record:

```ts
const circle = Circle.create({ radius: 10 })
// { _tag: 'circle', radius: 10 }
```

The `_tag` property is present to track the name of your record. you normally shouldn't have to interact directly with it.

### Input Defaults

Leverage Zod to get defaults for your properties ([zod docs](https://github.com/colinhacks/zod#default)):

```ts
const Circle = Alge.record('Circle', {
  radius: z.number().positive().default(0),
})

const circle = Circle.create()
// { _tag: 'circle', radius: 0 }
```

### Input Transformation

You can use zod to perform input transformations:

```ts
const Url = Alge.record('Url', {
  // ...
  path: z
    .string()
    .optional()
    .transform((path) => (path === undefined ? '/' : path.trim() === '' ? '/' : path.trim())),
})
```

### Input Validation

Input is validated via Zod. For example a negative number where only positives are accepted.

```ts
const circle = circle.create({ radius: -10 })
// throws
```

### Update

You can update records. Updating creates shallow copies of data. The validation, transformations, defaults etc. setup on the zod schema will re-run on the update function ensuring data integrity. Any errors there will be thrown.

```ts
const circleUpdated = circle.update(circle, { radius: 5 })
```

### Metadata

The controller gives you access to metadata about your record:

```ts
circle.name // 'Circle'
circle.schema // a Zod schema instance
```

### Chaining API

There is a chaining API available which is more verbose but also affords more features (see further down).

```ts
const Circle = Alge.record('Circle')
  .schema({
    radius: z.number().positive(),
  })
  .done()
```

Like in the shorthand form, if you already have a Zod Object defined from somewhere else you can just pass it in:

```ts
const Circle = Alge.record('Circle').schema(CircleSchema).done()
```

### Codecs

#### Definition (`.codec`)

You can define a named codec which allows your record to be encoded to/decoded from another representation.

The encoder (`to`) transforms your record into a string.

The decoder (`from`) transforms a string into your record, or `null` if the string is invalid.

```ts
const Circle = Alge.record('Circle')
  .schema({
    radius: z.number().positive().default(1),
  })
  .codec('graphic', {
    //    ^[1]
    to: (circle) => `(${circle.radius})`,
    from (string) => {
      const match = string.match(^/\((\d+)\)/$)
      return match ? { radius: radius[1]! } : null
    //               ^[2]
    }
  })
  .done()
```

Notes:

1. We give our codec a _name_. This name is used for the derived API (see "usage" below).
2. When returning the parsed data for our record we do _not_ need to deal with the `_tag` property.

#### Usage (`.to.`, `.from`)

Codecs are exposed under the `.from` and `.to` (decoders/encoders) properties:

```ts
const circle = Circle.create()
// { _tag: 'Circle', radius: 1 }

Circle.to.graphic(circle)
// (1)

Circle.from.graphic(`(1)`)
// { _tag: 'Circle', radius: 1 }

Circle.from.graphic(`()`)
// null
```

#### Built In JSON

All records have a JSON codec:

```ts
Circle.to.json(circle)
// '{ "_tag": "Circle", "radius": 1 }'

Circle.from.json('{ "_tag": "Circle", "radius": 1 }')
// { _tag: 'Circle', radius: 1 }
```

#### OrThrow Decoders

All decoders, JSON or your custom ones, have a variant of decode that will throw an `Error` when decoding fails:

```ts
Circle.from.graphicOrThrow(`()`)
// throws

Circle.from.jsonOrThrow(`bad`)
// throws
```

## Data (Algebraic Data Types)

The ADT Builder is an extension of the Record Builder and the ADT Controller it returns is an extension of the Record Controller.

### Definition

#### Referencing Records

Records can be passes into the Data Builder:

```ts
const Circle = Alge.record('Circle', { radius: z.number() })
const Square = Alge.record('Square', { size: z.number() })

const Shape = Alge.data('Shape', { Circle, Square })
```

#### Inline Records

Records can also be defined inline:

```ts
const Shape = Alge.data('Shape', {
  Circle: { radius: z.number() },
  Square: { size: z.number() },
})
```

#### Referencing Zod Objects

Existing Zod object schemas are also accepted:

```ts
const Circle = z.object({ radius: z.number() })
const Square = z.object({ size: z.number() })
const Shape = Alge.data('Shape', { Circle, Square })
```

### Construction

The ADT Controller contains one Record Controller for every record defined under a property of that records name. Use it just like you did before:

```ts
const circle = Shape.Circle.create({ radius: 1 })
// { _tag: 'Circle', radius: 1 }
const square = Shape.Square.create({ size: 2 })
// { _tag: 'Square', size: 2 }
```

### Chaining API

As with records before there is a chaining API for ADTs that is more verbose but has additional features.

```ts
const Shape = Alge.data('shape').record(Circle).record(Square).done()
```

As with the shorthand your existing Zod objects can be passed in:

```ts
const CircleSchema = z.object({ radius: z.number() })
const SquareSchema = z.object({ size: z.number() })
const Shape = Alge.data('shape')
  .record('Circle')
  .schema(CircleSchema)
  .record('Square')
  .schema(SquareSchema)
  .done()
```

### Identity (`.is`, `.is$`)

Use the `.is` Record Controller method as a TypeScript type guard. It checks if the given value is that record or not:

```ts
const onlyCircle = (shape: Shape): null | Shape.Circle => {
  return Shape.Circle.is(shape) ? shape : null
}
```

When you're working with unknown values there is the `.$is` method which takes `unknown` input. It is less type safe than `.is` so avoid `.is$` when you can:

```ts
const onlyCircle = (someValue: unknown): null | Shape.Circle => {
  return Shape.Circle.$is(someValue) ? someValue : null
}
```

### Codecs

When a codec of some name is defined for every record in an ADT then something special happens. The ADT gets access to a generalized version of the codec with these features:

1. A generalized decoder that will take a string and return a record instance of the first record decoder to return non-null. The static type is a union of all the records in the ADT (plus `null`).
2. A generalized encoder that will dispatch automatically to the correct Record encoder based on the passed in record's `_tag` value.

#### Definition (`.codec`)

Here is an example of defining a custom codec for each record in an ADT.

```ts
const circlePattern = /^\(( *)\)$/
const squarePattern = /^\[( *)\]$/

const shape = Alge.data('Shape')
  .record(`Circle`)
  .schema({
    radius: z.number(),
  })
  .codec('graphic', {
    to: (circle) => `(${' '.repeat(circle.radius)})`,
    from: (string) => {
      const match = string.exec(circleString)
      return match ? { radius: match[1]!.length } : null
    },
  })
  .record(`square`)
  .schema({
    size: z.number(),
  })
  .codec('graphic', {
    to: (square) => `[${' '.repeat(square.size)}]`,
    from: (string) => {
      const match = squarePattern.exec(string)
      return match ? { size: match[1]!.length } : null
    },
  })
  .done()
```

#### Usage (`to`, `from`)

```ts
const circle = Shape.Circle.create({ radius: 3 })
// { _tag: 'circle', radius: 3 }
const circleString = Shape.Circle.to.graphic(circle)
// '(   )'
const circle2 = Shape.Circle.from.graphic(circleString)
// { _tag: 'circle', radius: 3 }
const circle3 = Shape.Circle.from.graphic('(]')
// null
const shape1 = shape.from.graphic('()')
// type: circle | square | null
// value: { _tag: 'circle', radius: 0 }
const shape2 = Shape.from.graphic('[]')
// type: circle | square | null
// value: { _tag: 'square', size: 0 }
const shape3 = Shape.from.graphic('!')
// type: circle | square | null
// value: null
const shape4 = Shape.from.graphicOrThrow('!')
// type: circle | square
// value: throws
```

As mentioned all records have a JSON codec, thus all ADTs have a generalized one.

```ts
const circleJson = Shape.to.json(circle)
// '{ "_tag": "circle", "radius": 50 }'
const circle2 = shape.from.json(circleJson)
// { "_tag": "circle", "radius": 50 }
```

## Static Types

Often you will write code (e.g. your own functions) that need to be typed with your adt. alge has "type functions" for this which leverages typescript inference.

For adts there is `alge.Infer`. it return an object with a property _per_ record of the adt _as well as_ a special property `*` which is _a union of all records_.

```ts
type Shape = Alge.Infer<typeof shape>
/*
{
  Circle: { _tag: 'Circle', radius: number }
  Square: { _tag: 'Square', size: number }
  '*':    | { _tag: 'Circle', radius: number }
          | { _tag: 'Square', size: number }
}
*/

const doSomething = (shape: Shape['*']): null | Shape['circle'] => {
  // todo
}
```

For lone records there is `alge.InferRecord`.

```ts
type Circle = Alge.InferRecord<typeof Circle>

const doSomething = (circle: Circle) => {
  // todo
}
```

### Namespaces

When working with inferred adt types, if you prefer to work with namespaces rather than objects to reference types you can use the following pattern:

```ts
type ShapeInferred = Alge.Infer<typeof Shape>

type Shape = ShapeInferred['*']

namespace Shape {
  export type Circle = ShapeInferred['Circle']
  export type Square = ShapeInferred['Square']
}

const doSomething = (shape: Shape): null | Shape.Circle => {
  // todo
}
```

## String Literal Union Pattern Matching

Use `.match` to dispatch code execution based on data patterns. Among other things you can match on unions of string literals. The flow is:

- Pass your value to `Alge.match` to begin the pattern matching.
- Chain tag matchers
- Finish with `.done()` to statically verify union exhaustiveness or `.else(...)` if you want to specify a fallback value.

### Tag Matchers

Tag Matchers simply branch based on the string literal. You call `.done()` to perform the exhaustiveness check. If you can't call this (because of static type error) then your pattern matching is not exhaustive. This catches bugs!

```ts
const randomThing = pickRandom(['lego', 'basketball', 'videoGame'])
const sentence = Alge.match(randomThing)
  .lego(() => `Got Lego!`)
  .basketball(() => `Got Basketball`)
  .videoGame(() => `Got video game!`)
  .done()
```

### Done Versus Else

When you don't want to be exhaustive, use `else` instead of `done`. The value you specify in `else` will be used if no matcher matches.

```ts
const randomThing = pickRandom(['lego', 'rockClimbing', 'hiking'])

const sentence = Alge.match(randomThing)
  .lego(() => `Got a toy!`)
  .else((thing) => `Got an activity! (${thing})`)

const maybeLego = Alge.match(randomThing)
  .lego(() => 'Got Lego!')
  .else(null)
```

## ADT Pattern Matching

Use `.match` to dispatch code execution based on data patterns. Among other things You can match on your ADT's variants either by their tag or a data pattern. The flow is:

- Pass your value to `Alge.match` to begin the pattern matching.
- Chain tag or data (or both) matchers
- Finish with `.done()` to statically verify variant exhaustiveness or `.else(...)` if you want to specify a fallback value.

You can see some examples in action [here](./examples/Match.ts).

### Tag Matchers

Tag Matchers simply branch based on the variant's tag property. The tag property can be any of the following. The first one found in the following order is used. so for example if both `_kind` and `type` are present then `_kind` is considered the tag property.

- `__typename` (this is helpful if you're working with GraphQL unions)
- `_tag`
- `_type`
- `_kind`
- `type`
- `kind`

You call `.done()` to perform the exhaustiveness check. If you can't call this (because of static type error) then your pattern matching is not exhaustive. This catches bugs!

```ts
const result = Alge.match(shape)
  .Circle((circle) => `Got a circle of radius ${circle.radius}!`)
  .Square((square) => `Got a square of size ${square.size}!`)
  .done()
```

### Value Matchers

Value Matchers allow you to specify that the branch only matches when the actually data of the variant also matches your criteria.

Since these kinds of matchers are dynamic you cannot use `.done` with them but instead must use `.else` to specify a fallback value in case they do not match.

```ts
const result = Alge.match(shape)
  .Circle({ radius: 13 }, () => `Got an unlucky circle!`)
  .Square({ size: 13 }, () => `Got an unlucky square!`)
  .else({ ok: true })
```

### Mixing Matchers

You can mix matchers. Order matters. More specific matchers must come before more general matchers. Alge automates these checks for you:

- Cannot specify a value matcher _after_ a tag matcher (static & runtime enforcement)
- Future Feature (#todo-issue)[https://github.com/jasonkuhrt/alge/issues/todo]: Cannot specify a more specific data matcher after a less specific one

```ts
const result = Alge.match(shape)
  .Circle({ radius: 13 }, () => `Got an unlucky circle!`)
  .Circle((circle) => `Got a circle of radius ${circle.radius}!`)
  .Square({ size: 13 }, () => `Got an unlucky square!`)
  .Square((square) => `Got a square of size ${square.size}!`)
  .done()
```

### Done Versus Else

When you don't want to be exhaustive, use `else` instead of `done`. The value you specify in `else` will be used if no matcher matches.

```ts
const result = Alge.match(shape)
  .Circle((circle) => `Got a circle of radius ${circle.radius}!`)
  .else(null)
```

If you don't want your else to be an eager value, make it lazy with a function. Also this gives you access to the data (with its type statically narrowed):

```ts
const result = Alge.match(shape)
  .Circle((circle) => `Got a circle of radius ${circle.radius}!`)
  .else((shape) => (Math.random() > 0.5 ? [1, shape] : [2, shape]))
```

</br></br>

![alt](https://repobeats.axiom.co/api/embed/3c932f1cb76da4ad21328bfdd0ad1c6fbbe76a0b.svg 'repobeats analytics image')
