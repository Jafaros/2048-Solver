import { Game2048 } from '../2048';
import { ITest, type Direction } from '../types';

export class RandomTest implements ITest {
	name: string = 'RandomTest';
	game: Game2048 | null = null;
	moves_done: Record<Direction, number> = {
		up: 0,
		down: 0,
		left: 0,
		right: 0,
	};

	constructor(private grid_size: number) {
		this.InitiateGame();
		console.log(`${this.name} vytvořen`);
	}

	InitiateGame() {
		this.game = new Game2048(this.grid_size);
		this.game.GenerateGrid();
	}

	Run() {
		this.moves_done = {
			up: 0,
			down: 0,
			left: 0,
			right: 0,
		};

		if (!this.game) {
			console.error('Hra nebyla inicializována');
			return { success: false, message: 'Hra nebyla inicializována' };
		}

		const valid_moves: Array<Direction> = ['up', 'right', 'down', 'left'];

		let status = true;
		while (status) {
			const random_move =
				valid_moves[Math.floor(Math.random() * valid_moves.length)];
			this.game.Move(random_move, () => {
				status = false;
			});

			this.moves_done[random_move] += 1;

			if (!status) {
				return {
					success: this.game.HasWon(),
					message: `${this.name} skončil`,
					score: this.game.GetScore(),
					moves_done: this.moves_done,
				};
			}
		}

		return {
			success: this.game.HasWon(),
			message: `${this.name} dokončen`,
			score: this.game.GetScore(),
			moves_done: this.moves_done,
		};
	}
}
