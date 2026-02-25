import { Game2048 } from '../2048';
import { ITest, type Direction } from '../types';

export class CornerTest implements ITest {
	name: string = 'CornerTest';
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

	private ShuffleDirections(directions: Array<Direction>): Array<Direction> {
		const shuffled = [...directions];

		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}

		return shuffled;
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

		// Implementace logiky pro tahy, které se snaží udržet nejvyšší hodnotu v rohu
		let status = true;
		while (status) {
			const preferredMoves: Array<Direction> = this.ShuffleDirections([
				'down',
				'right',
			]);
			const fallbackMoves: Array<Direction> = this.ShuffleDirections([
				'up',
				'left',
			]);
			const move = [...preferredMoves, ...fallbackMoves].find(
				(direction) => this.game!.CanMove(direction),
			);

			if (!move) {
				return {
					success: this.game.HasWon(),
					message: `${this.name} skončil`,
					score: this.game.GetScore(),
					moves_done: this.moves_done,
				};
			}

			this.game.Move(move, () => {
				status = false;
			});

			this.moves_done[move] += 1;

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
