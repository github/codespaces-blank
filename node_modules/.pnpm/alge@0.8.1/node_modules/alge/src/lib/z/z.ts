export * from 'zod'
import type { z } from 'zod'

export type Omit<
  T extends z.ZodObject<z.ZodRawShape>,
  Mask extends { [k in keyof T[`shape`]]?: true }
> = z.ZodObject<
  z.objectUtil.noNever<{
    [k in keyof T[`shape`]]: k extends keyof Mask ? never : T[`shape`][k]
  }>
>
