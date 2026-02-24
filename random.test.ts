import { Game2048, type Direction } from './2048';
import { ITest } from './types';

export class RandomTest implements ITest {
	name: string = 'RandomTest';
	game: Game2048 | null = null;
	moves_count: number = 0;
	private valid_moves: Array<Direction> = ['up', 'right', 'down', 'left'];

	constructor(private grid_size: number) {
		this.InitiateGame();
		console.log('RandomTest created');
	}

	InitiateGame() {
		this.game = new Game2048(this.grid_size);
		this.game.GenerateGrid();
	}

	Run() {
		this.moves_count = 0; // Reset počtu tahů pro každý běh testu

		if (!this.game) {
			console.error('Game not initialized');
			return { success: false, message: 'Game not initialized' };
		}

		let status = true;
		while (status) {
			const random_move = this.valid_moves[Math.floor(Math.random() * this.valid_moves.length)];
			this.game.Move(random_move, () => {
				// console.log(`Game Over! Score: ${this.game?.GetScore()}`);
				status = false;
			});

			this.moves_count++;

			if (!status) {
				// this.game.PrintGrid();

				return {
					success: false,
					message: 'Game over',
					score: this.game.GetScore(),
					moves_count: this.moves_count
				};
			}
		}

		return {
			success: true,
			message: 'Random test completed',
			score: this.game.GetScore(),
			moves_count: this.moves_count
		};
	}
}
