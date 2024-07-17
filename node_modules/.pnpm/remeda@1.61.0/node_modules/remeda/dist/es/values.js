import { purry } from "./purry";
export function values() {
    return purry(Object.values, arguments);
}
