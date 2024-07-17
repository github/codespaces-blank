"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomString = void 0;
var purry_1 = require("./purry");
var times_1 = require("./times");
var ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function randomString() {
    return (0, purry_1.purry)(randomStringImplementation, arguments);
}
exports.randomString = randomString;
function randomStringImplementation(length) {
    return (0, times_1.times)(length, randomChar).join("");
}
var randomChar = function () {
    return ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
};
