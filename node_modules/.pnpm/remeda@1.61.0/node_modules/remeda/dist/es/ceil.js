import { _withPrecision } from "./_withPrecision";
import { purry } from "./purry";
export function ceil() {
    return purry(_withPrecision(Math.ceil), arguments);
}
