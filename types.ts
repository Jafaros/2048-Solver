import { Game2048 } from './2048';

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
