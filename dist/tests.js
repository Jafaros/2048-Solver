"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tests = void 0;
const random_test_1 = require("./random.test");
const corner_test_1 = require("./corner.test");
const GRID_SIZE = 4; // Velikost hracího pole
// Seznam testů, které budou spuštěny
exports.tests = [new random_test_1.RandomTest(GRID_SIZE), new corner_test_1.CornerTest(GRID_SIZE)];
