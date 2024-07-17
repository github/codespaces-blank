/**
 * Creates a deep copy of the value. Supported types: `Array`, `Object`, `Number`, `String`, `Boolean`, `Date`, `RegExp`. Functions are assigned by reference rather than copied.
 *
 * @param value - The object to clone.
 * @signature R.clone(value)
 * @example R.clone({foo: 'bar'}) // {foo: 'bar'}
 * @category Object
 */
export declare function clone<T>(value: T): T;
//# sourceMappingURL=clone.d.ts.map