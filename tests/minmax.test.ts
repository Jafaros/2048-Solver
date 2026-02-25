import { Game2048 } from '../2048';
import { AssignNodeValues, BuildTree, GetBestMove } from '../utils/tree-helper';
import { Direction, ITest } from '../types';

export class MinMaxTest implements ITest {
	name: string = 'MinMaxTest';
	game: Game2048 | null = null;
	moves_done: Record<Direction, number> = {
		up: 0,
		down: 0,
		left: 0,
		right: 0,
	};

	constructor(
		private grid_size: number,
		private max_depth: number = 3,
	) {
		this.InitiateGame();
		console.log(`${this.name} vytvořen`);
	}

	InitiateGame() {
		this.game = new Game2048(this.grid_size);
		this.game.GenerateGrid();
	}

	private GetEffectiveDepth(): number {
		if (!this.game) {
			return this.max_depth;
		}

		const emptyCount = this.game.GetEmptyPositions().length;
		if (emptyCount >= 8) {
			return Math.max(2, this.max_depth - 2);
		}

		if (emptyCount >= 5) {
			return Math.max(2, this.max_depth - 1);
		}

		return this.max_depth;
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

		let status = true;
		while (status) {
			const depth = this.GetEffectiveDepth();
			const tree = BuildTree(this.game, depth);

			if (tree.head) AssignNodeValues(tree.head);

			const move = GetBestMove(tree);
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
