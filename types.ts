import { Game2048 } from './2048';

export type Grid = number[][]; // Typ pro hrací mřížku
export type Position = [number, number]; // Typ pro pozici na mřížce (x, y)
export type Direction = 'up' | 'down' | 'left' | 'right'; // Typ pro směr pohybu

// Rozhraní pro výsledky testů
export type TestResult = {
	success: boolean;
	message: string;
	moves_count?: number;
	score?: number;
};

// Rozhraní pro testy
export interface ITest {
	name: string;
	game: Game2048 | null;
	moves_count: number;
	Run(): TestResult;
	InitiateGame(): void;
}

export type SpawnOutcome = {
	x: number;
	y: number;
	value: 2 | 4;
};

export type BaseNode = {
	grid: Grid;
	depth: number;
};

export type PlayerNode = BaseNode & {
	kind: 'PLAYER';
	value?: number;
	children: Partial<Record<Direction, ChanceNode | null>>;
};

export type ChanceNode = BaseNode & {
	kind: 'CHANCE';
	value?: number;
	causedByMove: Direction;
	outcomes: Array<{
		spawn: SpawnOutcome;
		next: PlayerNode | null;
	}>;
};

export type Tree = {
	head: PlayerNode | null;
	game: Game2048;
	size: number;
	maxDepth: number;
};
