"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const tests_1 = require("./tests");
const fs = __importStar(require("fs"));
const ITERATIONS = 10; // Počet iterací pro každý test
const DIRECTIONS = ['up', 'down', 'left', 'right']; // směry pro logování tahů
// Funkce pro logování výsledků testů
const LogResults = (testName, results) => {
    const successCount = results.filter((r) => r.success).length;
    const averageScore = results.reduce((sum, r) => sum + (r.score || 0), 0) / results.length;
    const topScore = Math.max(...results.map((r) => r.score || 0));
    const worstScore = Math.min(...results.map((r) => r.score || 0));
    const directionTotals = DIRECTIONS.reduce((acc, direction) => {
        acc[direction] = results.reduce((sum, r) => sum + (r.moves_done?.[direction] || 0), 0);
        return acc;
    }, { up: 0, down: 0, left: 0, right: 0 });
    const averageMoves = DIRECTIONS.reduce((sum, direction) => sum + directionTotals[direction], 0) / results.length;
    const averageMovesByDirection = DIRECTIONS.reduce((acc, direction) => {
        acc[direction] = directionTotals[direction] / results.length;
        return acc;
    }, { up: 0, down: 0, left: 0, right: 0 });
    const output = `
		Test: ${testName}\n
		Úspěšnost: ${((successCount / results.length) * 100).toFixed(2)}%\n
		Průměrné skóre: ${averageScore.toFixed(2)}\n
		Nejvyšší skóre: ${topScore}\n
		Nejnižší skóre: ${worstScore}\n
		Průměrný počet tahů: ${averageMoves.toFixed(2)}\n
		Průměrné tahy nahoru: ${averageMovesByDirection.up.toFixed(2)}\n
		Průměrné tahy dolů: ${averageMovesByDirection.down.toFixed(2)}\n
		Průměrné tahy doleva: ${averageMovesByDirection.left.toFixed(2)}\n
		Průměrné tahy doprava: ${averageMovesByDirection.right.toFixed(2)}\n
		Počet iterací: ${results.length}
		`;
    console.log(output);
    SaveResultsToFile(testName, output, results.length);
};
// Funkce pro uložení výsledků do souboru
function SaveResultsToFile(testName, text, iterations) {
    const path = `results/result_${testName}_${iterations}.txt`;
    fs.writeFileSync(path, text);
    console.log(`Výsledky uloženy do souboru: ${path}`);
}
// Spuštění všech testů a logování výsledků
for (const test of tests_1.tests) {
    const startTime = Date.now();
    console.log(`Spouštím test: ${test.name}`);
    const results = [];
    for (let i = 0; i < ITERATIONS; i++) {
        const result = test.Run();
        results.push(result);
        test.InitiateGame();
    }
    LogResults(test.name, results);
    console.log(`Test ${test.name} trval: ${Date.now() - startTime} ms`);
}
