import { purry } from "./purry";
export function pullObject() {
    return purry(pullObjectImplementation, arguments);
}
function pullObjectImplementation(data, keyExtractor, valueExtractor) {
    var result = {};
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var item = data_1[_i];
        var key = keyExtractor(item);
        var value = valueExtractor(item);
        result[key] = value;
    }
    return result;
}
