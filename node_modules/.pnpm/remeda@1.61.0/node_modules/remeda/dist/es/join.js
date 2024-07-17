import { purry } from "./purry";
export function join() {
    return purry(joinImplementation, arguments);
}
var joinImplementation = function (data, glue) { return data.join(glue); };
