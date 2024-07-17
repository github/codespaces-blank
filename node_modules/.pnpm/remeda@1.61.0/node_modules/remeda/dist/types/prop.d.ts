/**
 * Gets the value of the given property.
 *
 * @param propName - The property name.
 * @signature R.prop(prop)(object)
 * @example
 *    R.pipe({foo: 'bar'}, R.prop('foo')) // => 'bar'
 * @dataLast
 * @category Object
 */
export declare const prop: <T, K extends keyof T = keyof T>(propName: K) => ({ [propName]: value }: T) => T[K];
//# sourceMappingURL=prop.d.ts.map