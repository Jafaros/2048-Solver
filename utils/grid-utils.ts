import { Direction, Grid } from '../types';

// Klonování herního pole
export function CloneGrid(grid: Grid): Grid {
	const size = grid.length;
	const clonedGrid: Grid = new Array(size);

	for (let row = 0; row < size; row++) {
		clonedGrid[row] = grid[row].slice();
	}

	return clonedGrid;
}

// Zpracování jednoho řádku nebo sloupce pro posun a sloučení čísel
export function ProcessLine(line: number[], size: number): number[] {
	const filtered: number[] = [];

	for (let index = 0; index < line.length; index++) {
		const value = line[index];

		if (value !== 0) {
			filtered.push(value);
		}
	}

	const merged: number[] = [];

	for (let index = 0; index < filtered.length; index++) {
		const current = filtered[index];
		const next = filtered[index + 1];

		if (current !== 0 && current === next) {
			merged.push(current * 2);
			index++;
		} else {
			merged.push(current);
		}
	}

	while (merged.length < size) {
		merged.push(0);
	}

	return merged;
}

// Porovnání dvou polí
export function ArraysEqual(first: number[], second: number[]): boolean {
	if (first.length !== second.length) {
		return false;
	}

	for (let index = 0; index < first.length; index++) {
		if (first[index] !== second[index]) {
			return false;
		}
	}

	return true;
}

// Pokus o provedení tahu na gridu (bez modifikace původního)
export function TryMoveGrid(grid: Grid, direction: Direction): Grid | null {
	const size = grid.length;
	const nextGrid = CloneGrid(grid);
	let moved = false;

	switch (direction) {
		case 'left':
			for (let row = 0; row < size; row++) {
				const original = grid[row];
				const updated = ProcessLine(original, size);

				if (!ArraysEqual(original, updated)) {
					nextGrid[row] = updated;
					moved = true;
				}
			}
			break;
		case 'right':
			for (let row = 0; row < size; row++) {
				const original = grid[row];
				const reversed = original.slice().reverse();
				const updated = ProcessLine(reversed, size).reverse();

				if (!ArraysEqual(original, updated)) {
					nextGrid[row] = updated;
					moved = true;
				}
			}
			break;
		case 'up':
			for (let col = 0; col < size; col++) {
				const original: number[] = [];

				for (let row = 0; row < size; row++) {
					original.push(grid[row][col]);
				}

				const updated = ProcessLine(original, size);

				if (!ArraysEqual(original, updated)) {
					for (let row = 0; row < size; row++) {
						nextGrid[row][col] = updated[row];
					}

					moved = true;
				}
			}
			break;
		case 'down':
			for (let col = 0; col < size; col++) {
				const original: number[] = [];

				for (let row = 0; row < size; row++) {
					original.push(grid[row][col]);
				}

				const reversed = original.slice().reverse();
				const updated = ProcessLine(reversed, size).reverse();

				if (!ArraysEqual(original, updated)) {
					for (let row = 0; row < size; row++) {
						nextGrid[row][col] = updated[row];
					}

					moved = true;
				}
			}
			break;
	}

	return moved ? nextGrid : null;
}
