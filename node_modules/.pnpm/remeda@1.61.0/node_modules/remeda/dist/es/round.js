import { _withPrecision } from "./_withPrecision";
import { purry } from "./purry";
export function round() {
    return purry(_withPrecision(Math.round), arguments);
}
