import { _withPrecision } from "./_withPrecision";
import { purry } from "./purry";
export function floor() {
    return purry(_withPrecision(Math.floor), arguments);
}
