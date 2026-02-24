import { Game2048 } from './2048';
import { BuildTree, PrintTree } from './tree-helper';
import { ITest } from './types';

export class MinMaxTest implements ITest {
	name: string = 'MinMaxTest';
	game: Game2048 | null = null;
	moves_count: number = 0;

	constructor(
		private grid_size: number,
		private max_depth: number = 3
	) {
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

		let status = true;
		while (status) {
			const tree = BuildTree(this.game, this.max_depth);
			PrintTree(tree.head!, '|');

			this.moves_count++;

			status = false;

			if (!status) {
				// this.game.PrintGrid();

				return {
					success: false,
					message: `${this.name} skončil`,
					score: this.game.GetScore(),
					moves_count: this.moves_count
				};
			}
		}

		return {
			success: true,
			message: `${this.name} dokončen`,
			score: this.game.GetScore(),
			moves_count: this.moves_count
		};
	}
}
