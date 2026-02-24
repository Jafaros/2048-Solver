import { Game2048 } from './2048';

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

// Typ pro větev stromu možností pro minmax algoritmus
export type LinkedTreeNode = {
	value: number;
	next: Array<LinkedTreeNode>;
};

// Typ pro strom možností pro minmax algoritmus
export type LinkedTree = {
	head: LinkedTreeNode | null;
	size: number;
};
