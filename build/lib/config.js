"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOKEN = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.TOKEN = process.env.TOKEN;
