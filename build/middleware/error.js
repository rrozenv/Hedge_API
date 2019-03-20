"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (err, req, res, next) {
    console.log(err);
    res.status(500).send('Something failed.');
});
