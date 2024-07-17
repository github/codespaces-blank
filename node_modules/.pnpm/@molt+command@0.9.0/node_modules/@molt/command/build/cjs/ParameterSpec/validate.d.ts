import type { Output } from './output.js';
import { Alge } from 'alge';
import { z } from 'zod';
export declare const Result: {
    name: "Result";
    Success: {
        _: {
            defaultsProvider: null;
            tag: string;
            symbol: symbol;
            codecs: string[];
        };
        name: "Success";
        update: (record: {
            _tag: "Success";
            value?: any;
        }, changes: {
            value?: any;
        }) => {
            _tag: "Success";
            value?: any;
        };
        from: {
            json: (value: string) => {
                _tag: "Success";
                value?: any;
            } | null;
            jsonOrThrow: (value: string) => {
                _tag: "Success";
                value?: any;
            };
        };
        to: {
            json: (record: {
                _tag: "Success";
                value?: any;
            }) => string;
        };
        is: (value: {
            _tag: "Success";
            value?: any;
        } | {
            _tag: "Failure";
            errors: string[];
            value?: any;
        }) => value is {
            _tag: "Success";
            value?: any;
        };
        is$: (value: unknown) => value is {
            _tag: "Success";
            value?: any;
        };
        create: (input?: {
            value?: any;
        } | undefined) => {
            _tag: "Success";
            value?: any;
        };
        schema: z.ZodObject<z.objectUtil.MergeShapes<{
            value: z.ZodAny;
        }, {
            _tag: z.ZodLiteral<"Success">;
        }>, z.UnknownKeysParam, z.ZodTypeAny, {
            _tag: "Success";
            value?: any;
        }, {
            _tag: "Success";
            value?: any;
        }>;
    };
    Failure: {
        _: {
            defaultsProvider: null;
            tag: string;
            symbol: symbol;
            codecs: string[];
        };
        name: "Failure";
        update: (record: {
            _tag: "Failure";
            errors: string[];
            value?: any;
        }, changes: {
            value?: any;
            errors?: string[] | undefined;
        }) => {
            _tag: "Failure";
            errors: string[];
            value?: any;
        };
        from: {
            json: (value: string) => {
                _tag: "Failure";
                errors: string[];
                value?: any;
            } | null;
            jsonOrThrow: (value: string) => {
                _tag: "Failure";
                errors: string[];
                value?: any;
            };
        };
        to: {
            json: (record: {
                _tag: "Failure";
                errors: string[];
                value?: any;
            }) => string;
        };
        is: (value: {
            _tag: "Success";
            value?: any;
        } | {
            _tag: "Failure";
            errors: string[];
            value?: any;
        }) => value is {
            _tag: "Failure";
            errors: string[];
            value?: any;
        };
        is$: (value: unknown) => value is {
            _tag: "Failure";
            errors: string[];
            value?: any;
        };
        create: (input: {
            errors: string[];
            value?: any;
        }) => {
            _tag: "Failure";
            errors: string[];
            value?: any;
        };
        schema: z.ZodObject<z.objectUtil.MergeShapes<{
            errors: z.ZodArray<z.ZodString, "many">;
            value: z.ZodAny;
        }, {
            _tag: z.ZodLiteral<"Failure">;
        }>, z.UnknownKeysParam, z.ZodTypeAny, {
            _tag: "Failure";
            errors: string[];
            value?: any;
        }, {
            _tag: "Failure";
            errors: string[];
            value?: any;
        }>;
    };
    from: {
        json: (value: string) => {
            _tag: "Success";
            value?: any;
        } | {
            _tag: "Failure";
            errors: string[];
            value?: any;
        } | null;
        jsonOrThrow: (value: string) => {
            _tag: "Success";
            value?: any;
        } | {
            _tag: "Failure";
            errors: string[];
            value?: any;
        };
    };
    to: {
        json: Alge.Types.Data.Encoder<[Alge.Types.Record.StoredRecord.AddSchema<z.ZodObject<{
            value: z.ZodAny;
        }, "strip", z.ZodTypeAny, {
            value?: any;
        }, {
            value?: any;
        }>, Alge.Types.Record.StoredRecord.Create<"Success">>, Alge.Types.Record.StoredRecord.AddSchema<z.ZodObject<{
            errors: z.ZodArray<z.ZodString, "many">;
            value: z.ZodAny;
        }, "strip", z.ZodTypeAny, {
            errors: string[];
            value?: any;
        }, {
            errors: string[];
            value?: any;
        }>, Alge.Types.Record.StoredRecord.Create<"Failure">>]>;
    };
    schema: Alge.Types.Core.StoredRecords.ZodUnion<[Alge.Types.Record.StoredRecord.AddSchema<z.ZodObject<{
        value: z.ZodAny;
    }, "strip", z.ZodTypeAny, {
        value?: any;
    }, {
        value?: any;
    }>, Alge.Types.Record.StoredRecord.Create<"Success">>, Alge.Types.Record.StoredRecord.AddSchema<z.ZodObject<{
        errors: z.ZodArray<z.ZodString, "many">;
        value: z.ZodAny;
    }, "strip", z.ZodTypeAny, {
        errors: string[];
        value?: any;
    }, {
        errors: string[];
        value?: any;
    }>, Alge.Types.Record.StoredRecord.Create<"Failure">>]>;
};
type $Result = Alge.Infer<typeof Result>;
type Result<T> = {
    _tag: 'Success';
    value: T;
} | {
    _tag: 'Failure';
    errors: string[];
    value: unknown;
};
declare namespace Result {
    type Success = $Result['Success'];
    type Failure = $Result['Failure'];
}
export declare const validate: <T>(spec: Output, value: T) => Result<T>;
export {};
//# sourceMappingURL=validate.d.ts.map