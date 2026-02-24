import { Game2048 } from './2048';
import { AssignNodeValues, BuildTree, GetBestMove } from './tree-helper';
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
			const gameInstance = new Game2048(this.grid_size);
			gameInstance.SetGrid(this.game.GetGrid());
			const tree = BuildTree(gameInstance, this.max_depth);

			if (tree.head) AssignNodeValues(tree.head);

			const move = GetBestMove(tree);
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
