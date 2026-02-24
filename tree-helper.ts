import { Game2048 } from './2048';
import { ChanceNode, Direction, PlayerNode, SpawnOutcome, Tree } from './types';

export function BuildTree(game: Game2048, maxDepth: number): Tree {
	const firstNode: PlayerNode = BuildPlayerNode(game, 0, maxDepth);
	const tree: Tree = {
		head: firstNode,
		game: game,
		size: 1,
		maxDepth: maxDepth
	};

	return tree;
}

function BuildPlayerNode(game: Game2048, depth: number, maxDepth: number): PlayerNode {
	const possibleMoves: Array<Direction> = ['up', 'down', 'left', 'right'];
	const validMoves = possibleMoves.filter((direction) => game!.CanMove(direction));

	const node: PlayerNode = {
		kind: 'PLAYER',
		grid: game.GetGrid(),
		depth: depth,
		children: {}
	};

	if (depth < maxDepth) {
		for (const move of validMoves) {
			// Create a proper copy of the game state
			const gameSize = game.GetGrid().length;
			const newGame = new Game2048(gameSize);
			newGame.SetGrid(JSON.parse(JSON.stringify(game.GetGrid())));

			newGame.Move(move, () => {});
			const spawnPoints = GetPossibleSpawnPoints(newGame);

			const chanceNode: ChanceNode = {
				kind: 'CHANCE',
				grid: newGame.GetGrid(),
				depth: depth + 1,
				causedByMove: move,
				outcomes: spawnPoints.map((spawn: SpawnOutcome) => {
					// Create a fresh copy for each outcome
					const outcomeGame = new Game2048(gameSize);
					outcomeGame.SetGrid(JSON.parse(JSON.stringify(newGame.GetGrid())));
					const next: PlayerNode = BuildPlayerNode(outcomeGame, depth + 2, maxDepth);
					return {
						spawn,
						next
					};
				})
			};
			node.children[move] = chanceNode;
		}
	}

	return node;
}

export function AssignNodeValues(node: PlayerNode | ChanceNode): number {
	if (node.kind === 'PLAYER') {
		let maxMovesCount = 0;

		for (const child of Object.values(node.children)) {
			if (child) {
				AssignNodeValues(child);
				// Count valid moves in this player node
				const movesInThisNode = Object.values(node.children).filter((c) => c).length;
				maxMovesCount = Math.max(maxMovesCount, movesInThisNode);
			}
		}

		// Value based on maximum number of possible moves available
		node.value = maxMovesCount;
		return node.value;
	} else if (node.kind === 'CHANCE') {
		let maxMovesCount = 0;

		for (const outcome of node.outcomes) {
			if (outcome.next) {
				AssignNodeValues(outcome.next);
				// Count valid moves in each child PlayerNode
				const movesInChild = Object.values(outcome.next.children).filter((c) => c).length;
				maxMovesCount = Math.max(maxMovesCount, movesInChild);
			}
		}

		// Value based on maximum moves available in any outcome
		node.value = maxMovesCount;
		return node.value;
	}

	return 0;
}

export function GetBestMove(tree: Tree): Direction | null {
	if (!tree.head) {
		return null;
	}

	let bestMove: Direction | null = null;
	let bestValue = -Infinity;

	for (const [move, child] of Object.entries(tree.head.children)) {
		if (child) {
			const childValue = child.value || 0;
			if (childValue > bestValue) {
				bestValue = childValue;
				bestMove = move as Direction;
			}
		}
	}

	return bestMove;
}

function GetPossibleSpawnPoints(game: Game2048): SpawnOutcome[] {
	const emptyPositions = game.GetEmptyPositions();
	const outcomes: SpawnOutcome[] = [];

	for (const [x, y] of emptyPositions) {
		outcomes.push({
			x,
			y,
			value: 2
		});
		outcomes.push({
			x,
			y,
			value: 4
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
				`${indent}  Spawn: (x: ${outcome.spawn.x}, y: ${outcome.spawn.y}, value: ${outcome.spawn.value})`
			);

			if (outcome.next) {
				PrintTree(outcome.next, indent + '    ');
			}
		}
	}
}
