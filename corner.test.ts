import { Game2048 } from './2048';
import { ITest, type Direction } from './types';

export class CornerTest implements ITest {
	name: string = 'CornerTest';
	game: Game2048 | null = null;
	moves_count: number = 0;

	constructor(private grid_size: number) {
		this.InitiateGame();
		console.log(`${this.name} vytvořen`);
	}

	InitiateGame() {
		this.game = new Game2048(this.grid_size);
		this.game.GenerateGrid();
	}

	Run() {
		this.moves_count = 0; // Reset počtu tahů pro každý běh testu

		if (!this.game) {
			console.error('Hra nebyla inicializována');
			return { success: false, message: 'Hra nebyla inicializována' };
		}

		// Implementace logiky pro tahy, které se snaží udržet nejvyšší hodnotu v rohu
		let status = true;
		while (status) {
			const preferredMoves: Array<Direction> = ['down', 'right'];
			const fallbackMoves: Array<Direction> = ['up', 'left'];
			const move = [...preferredMoves, ...fallbackMoves].find((direction) =>
				this.game!.CanMove(direction)
			);

			if (!move) {
				// this.game.PrintGrid();

				return {
					success: this.game.HasWon(),
					message: `${this.name} skončil`,
					score: this.game.GetScore(),
					moves_count: this.moves_count
				};
			}

			this.game.Move(move, () => {
				// console.log(`Konec hry! Skóre: ${this.game?.GetScore()}`);
				status = false;
			});

			this.moves_count++;

			if (!status) {
				// this.game.PrintGrid();

				return {
					success: this.game.HasWon(),
					message: `${this.name} skončil`,
					score: this.game.GetScore(),
					moves_count: this.moves_count
				};
			}
		}

		return {
			success: this.game.HasWon(),
			message: `${this.name} dokončen`,
			score: this.game.GetScore(),
			moves_count: this.moves_count
		};
	}
}
