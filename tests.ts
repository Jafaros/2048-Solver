import { ITest } from './types';
import { RandomTest } from './tests/random.test';
import { CornerTest } from './tests/corner.test';
import { MinMaxTest } from './tests/minmax.test';

const GRID_SIZE = 4; // Velikost hracího pole
const MAX_DEPTH = 5; // Maximální hloubka pro MinMax test

// Seznam testů, které budou spuštěny
export const tests: Array<ITest> = [
	new RandomTest(GRID_SIZE),
	new CornerTest(GRID_SIZE),
	new MinMaxTest(GRID_SIZE, MAX_DEPTH),
];
