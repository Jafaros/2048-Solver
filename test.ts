import { Game2048, type Direction } from './2048';

// Typ pro výsledek testu
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
	Run(): TestResult;
	InitiateGame(): void;
}

const GRID_SIZE = 4; // Velikost mřížky (např. 4 pro klasickou hru 2048)

// Implementace náhodného testu, který provádí náhodné tahy, dokud hra neskončí
export class RandomTest implements ITest {
	name: string = 'RandomTest';
	game: Game2048 | null = null;
	private valid_moves: Array<Direction> = ['up', 'right', 'down', 'left'];

	constructor() {
		this.InitiateGame();
		console.log('RandomTest created');
	}

	InitiateGame() {
		this.game = new Game2048(GRID_SIZE);
		this.game.GenerateGrid();
	}

	Run() {
		if (!this.game) {
			console.error('Game not initialized');
			return { success: false, message: 'Game not initialized' };
		}

		let status = true;
		let moves_count = 0;
		while (status) {
			const random_move = this.valid_moves[Math.floor(Math.random() * this.valid_moves.length)];
			this.game.Move(random_move, () => {
				console.log(`Game Over! Score: ${this.game?.GetScore()}`);
				status = false;
			});

			moves_count++;

			if (!status) {
				this.game.PrintGrid();
				return { success: false, message: 'Game over', score: this.game.GetScore(), moves_count };
			}
		}

		return {
			success: true,
			message: 'Random test completed',
			score: this.game.GetScore(),
			moves_count
		};
	}
}
