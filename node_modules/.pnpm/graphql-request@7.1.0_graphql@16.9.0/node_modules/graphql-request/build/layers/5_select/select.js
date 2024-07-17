export const create = (_name) => {
    return idProxy;
};
const idProxy = new Proxy({}, {
    get: () => (value) => value,
});
// eslint-disable-next-line
// @ts-ignore generated types
export const select = idProxy;
//# sourceMappingURL=select.js.map