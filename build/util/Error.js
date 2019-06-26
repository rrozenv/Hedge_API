"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class APIError {
    constructor(header, message) {
        this.header = header;
        this.message = message;
    }
}
exports.default = APIError;
