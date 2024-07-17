import type { z } from 'zod';
export type SomeDataController = {
    name: string;
    schema: SomeZodADT;
};
export type SomeZodADT = z.ZodUnion<[z.SomeZodObject, ...z.SomeZodObject[]]>;
//# sourceMappingURL=internal.d.ts.map