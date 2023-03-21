"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copy = exports.timeIn = exports.asyncTimeout = void 0;
const asyncTimeout = (ms) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
});
exports.asyncTimeout = asyncTimeout;
const SECONDS = 1000;
const MINUTES = 60 * SECONDS;
const HOURS = 60 * MINUTES;
const DAYS = 24 * HOURS;
exports.timeIn = {
    seconds: (secs) => secs * SECONDS,
    minutes: (mins) => mins * MINUTES,
    hours: (hrs) => hrs * MINUTES,
    days: (ds) => ds * DAYS,
};
const copy = (toCopy) => JSON.parse(JSON.stringify(toCopy));
exports.copy = copy;
//# sourceMappingURL=helpers.js.map