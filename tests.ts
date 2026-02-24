import { ITest } from './types';
import { RandomTest } from './random.test';
import { CornerTest } from './corner.test';

const GRID_SIZE = 4; // Velikost hracího pole

// Seznam testů, které budou spuštěny
export const tests: Array<ITest> = [new RandomTest(GRID_SIZE), new CornerTest(GRID_SIZE)];
