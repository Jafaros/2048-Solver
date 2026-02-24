"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tests = void 0;
const random_test_1 = require("./random.test");
const corner_test_1 = require("./corner.test");
const minmax_test_1 = require("./minmax.test");
const GRID_SIZE = 2; // Velikost hracího pole
const MAX_DEPTH = 3; // Maximální hloubka pro MinMax test
// Seznam testů, které budou spuštěny
exports.tests = [
    new random_test_1.RandomTest(GRID_SIZE),
    new corner_test_1.CornerTest(GRID_SIZE),
    new minmax_test_1.MinMaxTest(GRID_SIZE, MAX_DEPTH)
];
