import { Game2048 } from './2048';
import { ChanceNode, Direction, PlayerNode, SpawnOutcome, Tree } from './types';

export function BuildTree(game: Game2048, maxDepth: number): Tree {
	const possibleMoves: Array<Direction> = ['up', 'down', 'left', 'right'];
	const validMoves = possibleMoves.filter((direction) => game!.CanMove(direction));

	const firstNode: PlayerNode = {
		kind: 'PLAYER',
		grid: game.GetGrid(),
		depth: 0,
		children: {}
	};
	const tree: Tree = {
		head: firstNode,
		game: game,
		size: 1,
		maxDepth: maxDepth
	};

	for (const move of validMoves) {
		const newGame = tree.game;
		newGame.Move(move, () => {});

		const spawnPoints = GetPossibleSpawnPoints(newGame);

		const chanceNode: ChanceNode = {
			kind: 'CHANCE',
			grid: newGame.GetGrid(),
			depth: 1,
			causedByMove: move,
			outcomes: spawnPoints.map((spawn: SpawnOutcome) => {
				const next: PlayerNode = {
					kind: 'PLAYER',
					grid: newGame.GetGrid(),
					depth: 2,
					children: {}
				};

				return {
					spawn,
					next
				};
			})
		};
		firstNode.children[move] = chanceNode;
	}

	return tree;
}

function GetPossibleSpawnPoints(game: Game2048): SpawnOutcome[] {
	const emptyPositions = game.GetEmptyPositions();
	const outcomes: SpawnOutcome[] = [];

	for (const [x, y] of emptyPositions) {
		outcomes.push({
			x,
			y,
			value: 2,
			p: 0.9 / emptyPositions.length
		});
		outcomes.push({
			x,
			y,
			value: 4,
			p: 0.1 / emptyPositions.length
		});
	}

	return outcomes;
}

export function PrintTree(node: PlayerNode | ChanceNode, indent: string = ''): void {
	if (node.kind === 'PLAYER') {
		console.log(`${indent}PlayerNode (Depth: ${node.depth})`);

		for (const [move, child] of Object.entries(node.children)) {
			if (child) {
				console.log(`${indent}  Move: ${move}`);
				PrintTree(child, indent + '    ');
			}
		}
	} else if (node.kind === 'CHANCE') {
		console.log(`${indent}ChanceNode (Depth: ${node.depth}, Caused by Move: ${node.causedByMove})`);

		for (const outcome of node.outcomes) {
			console.log(
				`${indent}  Spawn: (x: ${outcome.spawn.x}, y: ${outcome.spawn.y}, value: ${outcome.spawn.value}, p: ${outcome.spawn.p})`
			);

			if (outcome.next) {
				PrintTree(outcome.next, indent + '    ');
			}
		}
	}
}
