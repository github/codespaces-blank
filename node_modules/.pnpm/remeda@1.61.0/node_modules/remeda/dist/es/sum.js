import { purry } from "./purry";
export function sum() {
    return purry(sumImplementation, arguments);
}
function sumImplementation(data) {
    var out = 0;
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var value = data_1[_i];
        out += value;
    }
    return out;
}
