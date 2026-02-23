"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tests_1 = require("./tests");
const ITERATIONS = 100; // Počet iterací pro každý test
// Funkce pro logování výsledků testů
const LogResults = (testName, results) => {
    const successCount = results.filter((r) => r.success).length;
    const averageScore = results.reduce((sum, r) => sum + (r.score || 0), 0) / results.length;
    const topScore = Math.max(...results.map((r) => r.score || 0));
    const averageMoves = results.reduce((sum, r) => sum + (r.moves_count || 0), 0) / results.length;
    console.log(`Test: ${testName}, Success Rate: ${((successCount / results.length) * 100).toFixed(2)}%, Average Score: ${averageScore.toFixed(2)}, Top Score: ${topScore}, Average Moves: ${averageMoves.toFixed(2)}`);
};
// Spuštění všech testů a logování výsledků
for (const test of tests_1.tests) {
    const results = [];
    for (let i = 0; i < ITERATIONS; i++) {
        console.log(`Running test: ${test.name}, iteration: ${i}`);
        const result = test.Run();
        results.push(result);
        test.InitiateGame();
    }
    LogResults(test.name, results);
}
