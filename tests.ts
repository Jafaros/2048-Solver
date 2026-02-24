import { ITest } from './types';
import { RandomTest } from './random.test';
import { CornerTest } from './corner.test';
import { MinMaxTest } from './minmax.test';

const GRID_SIZE = 2; // Velikost hracího pole
const MAX_DEPTH = 3; // Maximální hloubka pro MinMax test

// Seznam testů, které budou spuštěny
export const tests: Array<ITest> = [
	new RandomTest(GRID_SIZE),
	new CornerTest(GRID_SIZE),
	new MinMaxTest(GRID_SIZE, MAX_DEPTH)
];
