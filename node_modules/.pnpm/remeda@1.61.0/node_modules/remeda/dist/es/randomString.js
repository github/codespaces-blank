import { purry } from "./purry";
import { times } from "./times";
var ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export function randomString() {
    return purry(randomStringImplementation, arguments);
}
function randomStringImplementation(length) {
    return times(length, randomChar).join("");
}
var randomChar = function () {
    return ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
};
