"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.record = void 0;
const helpers_js_1 = require("../core/helpers.js");
const utils_js_1 = require("../lib/utils.js");
const index_js_1 = require("../lib/z/index.js");
//eslint-disable-next-line
function record(name, schemaOrSchemaDef, _ = {}) {
    const chainTerminus = `done`;
    const initialSchema = index_js_1.z.object({ _tag: index_js_1.z.literal(name) });
    const current = {
        name,
        schema: initialSchema,
        extensions: {},
        defaultsProvider: null,
        codecs: [],
        ...(_.extend
            ? {
                name: _.extend.name,
                schema: _.extend.schema,
                defaultsProvider: _.extend._.defaultsProvider,
                extensions: _.extend,
            }
            : {}),
    };
    const chain = {
        schema: (schemaOrSchemaDef) => {
            if (`_def` in schemaOrSchemaDef) {
                // @ts-expect-error: TODO
                // eslint-disable-next-line
                current.schema = schemaOrSchemaDef.extend({ _tag: index_js_1.z.literal(current.name) });
            }
            else {
                current.schema = index_js_1.z.object({ ...schemaOrSchemaDef, _tag: index_js_1.z.literal(current.name) });
            }
            return chain;
        },
        extend: (extensions) => {
            current.extensions = {
                ...current.extensions,
                ...extensions,
            };
            return chain;
        },
        codec: (name, codecDef) => {
            // TODO optimize this check to be O(1)
            if (!(0, utils_js_1.isEmptySchema)(current.schema))
                throw new Error(`A codec cannot be defined without a schema.`);
            if (current.codecs.find((codec) => codec[0] === name))
                throw new Error(`A codec with the name "${name}" has already been defined.`);
            current.codecs.push([name, codecDef]);
            return chain;
        },
        defaults: (defaultsProvider) => {
            if (current.schema === initialSchema)
                throw new Error(`No schema defined.`);
            if (current.defaultsProvider)
                throw new Error(`Defaults already defined.`);
            current.defaultsProvider = defaultsProvider;
            return chain;
        },
        done: () => {
            const symbol = Symbol(current.name);
            const controller = {
                ...current,
                _: {
                    symbol,
                    codecs: current.codecs.map((_) => _[0]),
                    defaultsProvider: current.defaultsProvider,
                },
                create: (input) => {
                    const data = {
                        ...(0, utils_js_1.applyDefaults)(input ?? {}, current.defaultsProvider?.(input ?? {}) ?? {}),
                        _tag: current.name,
                        _: {
                            symbol,
                            tag: current.name,
                        },
                    };
                    return current.schema.passthrough().parse(data);
                },
                //eslint-disable-next-line
                is$: (value) => (0, helpers_js_1.is)(value, symbol),
                is: (record) => (0, helpers_js_1.is)(record, symbol),
                update: (record, changes) => {
                    return controller.create({
                        ...record,
                        ...changes,
                    });
                },
                from: {
                    json: (json) => {
                        const data = (0, utils_js_1.tryOrNull)(() => JSON.parse(json));
                        if (data === null || typeof data !== `object`)
                            return null;
                        // TODO
                        // eslint-disable-next-line
                        return controller.create(data);
                    },
                    jsonOrThrow: (json) => {
                        const data = controller.from.json(json);
                        if (data === null)
                            throw new Error(`Failed to decode value \`${json}\` into a ${name}.`);
                        return data;
                    },
                    ...current.codecs.reduce((acc, [key, impl]) => Object.assign(acc, {
                        [key]: (value) => {
                            const data = impl.from(value, {
                                ...current.extensions,
                                schema: current.schema,
                                name: current.name,
                            });
                            if (data === null)
                                return null;
                            // TODO
                            // eslint-disable-next-line
                            return controller.create(data);
                        },
                        [`${key}OrThrow`]: (value) => {
                            // @ts-expect-error not indexable
                            // eslint-disable-next-line
                            const data = controller.from[key](value);
                            if (data === null)
                                throw new Error(`Failed to decode value \`${value}\` into a ${name}.`);
                            return data;
                        },
                    }), {}),
                },
                to: {
                    json: (data) => {
                        return JSON.stringify(data);
                    },
                    ...current.codecs.reduce((acc, [key, impl]) => Object.assign(acc, {
                        [key]: (recordController) => {
                            return impl.to(recordController);
                        },
                    }), {}),
                },
                ...current.extensions,
            };
            return controller;
        },
    };
    const chainWrapped = _.extensions
        ? (0, utils_js_1.extendChain)({
            chain: {
                terminus: chainTerminus,
                // TODO
                // @ts-expect-error something about chain not having an index signature.
                methods: chain,
            },
            extensions: _.extensions,
        })
        : chain;
    if (schemaOrSchemaDef) {
        return chain.schema(schemaOrSchemaDef).done();
    }
    // TODO
    // eslint-disable-next-line
    return chainWrapped;
}
exports.record = record;
//# sourceMappingURL=runtime.js.map