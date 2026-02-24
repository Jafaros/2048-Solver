import { Game2048 } from '../2048';
import {
	ChanceNode,
	Direction,
	Grid,
	PlayerNode,
	SpawnOutcome,
	Tree,
} from '../types';
import { CloneGrid, TryMoveGrid } from './grid-utils';

const DIRECTIONS: Direction[] = ['up', 'down', 'left', 'right']; // Možné směry pohybu
const SPAWN_TWO_PROBABILITY = 0.9; // Pravděpodobnost, že se objeví 2 (místo 4) při spawnu nového čísla
const SPAWN_FOUR_PROBABILITY = 0.1; // Pravděpodobnost, že se objeví 4 (místo 2) při spawnu nového čísla

// Funkce pro vytvoření stromu herních stavů a přiřazení hodnot uzlům pomocí MinMax algoritmu
export function BuildTree(game: Game2048, maxDepth: number): Tree {
	const playerNodeCache = new Map<string, PlayerNode>();
	const firstNode: PlayerNode = BuildPlayerNode(
		CloneGrid(game.GetGrid()),
		0,
		maxDepth,
		playerNodeCache,
	);
	const tree: Tree = {
		head: firstNode,
		game: game,
		size: 1,
		maxDepth: maxDepth,
	};

	return tree;
}

// Rekurzivní funkce pro vytvoření PlayerNode a ChanceNode, s využitím cache pro optimalizaci
function BuildPlayerNode(
	grid: Grid,
	depth: number,
	maxDepth: number,
	playerNodeCache: Map<string, PlayerNode>,
): PlayerNode {
	const cacheKey = `P|${depth}|${SerializeGrid(grid)}`;
	const cachedNode = playerNodeCache.get(cacheKey);

	if (cachedNode) {
		return cachedNode;
	}

	const moveResults = GetValidMoveResults(grid);

	const node: PlayerNode = {
		kind: 'PLAYER',
		grid: CloneGrid(grid),
		depth: depth,
		children: {},
	};
	playerNodeCache.set(cacheKey, node);

	if (depth < maxDepth) {
		for (const [move, movedGrid] of moveResults) {
			const spawnPoints = GetPossibleSpawnPoints(movedGrid);

			const chanceNode: ChanceNode = {
				kind: 'CHANCE',
				grid: CloneGrid(movedGrid),
				depth: depth + 1,
				causedByMove: move,
				outcomes: spawnPoints.map((spawn: SpawnOutcome) => {
					const nextGrid = ApplySpawn(movedGrid, spawn);
					const next: PlayerNode = BuildPlayerNode(
						nextGrid,
						depth + 2,
						maxDepth,
						playerNodeCache,
					);
					return {
						spawn,
						next,
					};
				}),
			};

			node.children[move] = chanceNode;
		}
	}

	return node;
}

// Serializace a utility pro tree building
function SerializeGrid(grid: Grid): string {
	return grid.map((row) => row.join(',')).join(';');
}

// Aplikuje spawn nového čísla na herní pole a vrací nové pole
function ApplySpawn(grid: Grid, spawn: SpawnOutcome): Grid {
	const nextGrid = CloneGrid(grid);
	nextGrid[spawn.y][spawn.x] = spawn.value;
	return nextGrid;
}

// Funkce pro získání všech platných tahů z aktuálního stavu herního pole
function GetValidMoveResults(grid: Grid): Array<[Direction, Grid]> {
	const results: Array<[Direction, Grid]> = [];

	for (const direction of DIRECTIONS) {
		const movedGrid = TryMoveGrid(grid, direction);

		if (movedGrid) {
			results.push([direction, movedGrid]);
		}
	}

	return results;
}

// Funkce pro přiřazení hodnot uzlům v MinMax stromu, s využitím cache pro optimalizaci
export function AssignNodeValues(node: PlayerNode | ChanceNode): number {
	const valueCache = new Map<string, number>();
	return AssignNodeValuesInternal(node, valueCache);
}

// Rekurzivní funkce pro přiřazení hodnot uzlům, s využitím cache pro optimalizaci
function AssignNodeValuesInternal(
	node: PlayerNode | ChanceNode,
	valueCache: Map<string, number>,
): number {
	const cacheKey = `${node.kind}|${node.depth}|${SerializeGrid(node.grid)}`;
	const cachedValue = valueCache.get(cacheKey);

	if (cachedValue !== undefined) {
		node.value = cachedValue;
		return cachedValue;
	}

	if (node.kind === 'PLAYER') {
		let maxValue = 0;
		let hasChildren = false;

		for (const child of Object.values(node.children)) {
			if (child) {
				hasChildren = true;
				const childValue = AssignNodeValuesInternal(child, valueCache);

				if (childValue > maxValue) {
					maxValue = childValue;
				}
			}
		}

		let value = hasChildren ? maxValue : CountEmptySpaces(node.grid);
		node.value = value;
		valueCache.set(cacheKey, node.value);

		return node.value;
	} else if (node.kind === 'CHANCE') {
		let weightedSum = 0;
		let totalWeight = 0;

		for (const outcome of node.outcomes) {
			if (outcome.next) {
				const nextPlayerValue = AssignNodeValuesInternal(
					outcome.next,
					valueCache,
				);
				const spawnProbability =
					outcome.spawn.value === 2
						? SPAWN_TWO_PROBABILITY
						: SPAWN_FOUR_PROBABILITY;
				weightedSum += nextPlayerValue * spawnProbability;
				totalWeight += spawnProbability;
			}
		}

		let value =
			totalWeight > 0
				? weightedSum / totalWeight
				: CountEmptySpaces(node.grid);
		node.value = value;
		valueCache.set(cacheKey, node.value);

		return node.value;
	}

	return 0;
}

// Funkce pro spočítání počtu prázdných polí v gridu
function CountEmptySpaces(grid: Grid): number {
	let count = 0;

	for (let row = 0; row < grid.length; row++) {
		for (let col = 0; col < grid[row].length; col++) {
			if (grid[row][col] === 0) {
				count++;
			}
		}
	}

	return count;
}

// Funkce pro získání nejlepšího tahu z MinMax stromu
export function GetBestMove(tree: Tree): Direction | null {
	if (!tree.head) {
		return null;
	}

	let bestMove: Direction | null = null;
	let bestValue = -Infinity;

	for (const [move, child] of Object.entries(tree.head.children)) {
		if (child) {
			const childValue = child.value ?? Number.NEGATIVE_INFINITY;

			if (childValue > bestValue) {
				bestValue = childValue;
				bestMove = move as Direction;
			}
		}
	}

	return bestMove;
}

// Funkce pro získání všech možných pozic pro spawn nového čísla (2 nebo 4) na herním poli
function GetPossibleSpawnPoints(grid: Grid): SpawnOutcome[] {
	const emptyPositions = GetEmptyPositions(grid);
	const outcomes: SpawnOutcome[] = [];

	for (const [x, y] of emptyPositions) {
		outcomes.push({
			x,
			y,
			value: 2,
		});
		outcomes.push({
			x,
			y,
			value: 4,
		});
	}

	return outcomes;
}

// Funkce pro získání všech prázdných pozic na herním poli
function GetEmptyPositions(grid: Grid): Array<[number, number]> {
	const emptyPositions: Array<[number, number]> = [];

	for (let row = 0; row < grid.length; row++) {
		for (let col = 0; col < grid[row].length; col++) {
			if (grid[row][col] === 0) {
				emptyPositions.push([col, row]);
			}
		}
	}

	return emptyPositions;
}

// Funkce pro tisk MinMax stromu do konzole pro vizualizaci
export function PrintTree(
	node: PlayerNode | ChanceNode,
	indent: string = '',
): void {
	if (node.kind === 'PLAYER') {
		console.log(`${indent} PlayerNode (Hloubka: ${node.depth})`);

		for (const [move, child] of Object.entries(node.children)) {
			if (child) {
				console.log(`${indent}  Tah: ${move}`);
				PrintTree(child, indent + '    ');
			}
		}
	} else if (node.kind === 'CHANCE') {
		console.log(
			`${indent} ChanceNode (Hloubka: ${node.depth}, Způsobený tahem: ${node.causedByMove})`,
		);

		for (const outcome of node.outcomes) {
			console.log(
				`${indent}	Spawn: (x: ${outcome.spawn.x}, y: ${outcome.spawn.y}, hodnota: ${outcome.spawn.value})`,
			);

			if (outcome.next) {
				PrintTree(outcome.next, indent + '    ');
			}
		}
	}
}
