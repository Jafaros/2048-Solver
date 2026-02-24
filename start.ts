import { TestResult } from './types';
import { tests } from './tests';

const ITERATIONS = 10; // Počet iterací pro každý test

// Funkce pro logování výsledků testů
const LogResults = (testName: string, results: Array<TestResult>) => {
	const successCount = results.filter((r) => r.success).length;
	const averageScore =
		results.reduce((sum, r) => sum + (r.score || 0), 0) / results.length;
	const topScore = Math.max(...results.map((r) => r.score || 0));
	const averageMoves =
		results.reduce((sum, r) => sum + (r.moves_count || 0), 0) /
		results.length;
	console.log(
		`
		Test: ${testName}\n
		Úspěšnost: ${((successCount / results.length) * 100).toFixed(2)}%\n
		Průměrné skóre: ${averageScore.toFixed(2)}\n
		Nejvyšší skóre: ${topScore}\n
		Průměrný počet tahů: ${averageMoves.toFixed(2)}\n
		Počet iterací: ${results.length}
		`,
	);
};

// Spuštění všech testů a logování výsledků
for (const test of tests) {
	const startTime = Date.now();
	console.log(`Spouštím test: ${test.name}`);
	const results: Array<TestResult> = [];

	for (let i = 0; i < ITERATIONS; i++) {
		const result = test.Run();
		results.push(result);
		test.InitiateGame();
	}

	LogResults(test.name, results);
	console.log(`Test ${test.name} trval: ${Date.now() - startTime} ms`);
}
