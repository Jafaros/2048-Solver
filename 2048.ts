import { Direction, Position } from './types';

// Třída spravující logiku hry 2048
export class Game2048 {
	private grid: number[][];

	// Konstruktor pro inicializaci prázdné mřížky
	constructor(private size: number) {
		this.grid = [];
		for (let i = 0; i < size; i++) {
			this.grid[i] = [];

			for (let j = 0; j < size; j++) {
				this.grid[i][j] = 0;
			}
		}
	}

	// Generování náhodného čísla (2 nebo 4) pro nové pole s poměrem 9:1
	private GenerateNumber = (): number => {
		const rand = Math.round(Math.random() * 10) % 10;

		if (rand < 9) {
			return 2;
		} else {
			return 4;
		}
	};

	// Generování náhodných pozic pro počáteční čísla
	private GeneratePositionsForInitialNumbers = (size: number): Position[] => {
		if (size * size < 2) {
			throw new Error('Velikost mřížky musí umožnit alespoň dvě pozice.');
		}

		const positions: Position[] = [];
		const seen = new Set<string>();

		while (positions.length !== 2) {
			const x = Math.floor(Math.random() * size);
			const y = Math.floor(Math.random() * size);
			const key = `${x},${y}`;

			if (seen.has(key)) {
				continue;
			}

			seen.add(key);
			positions.push([x, y]);
		}

		return positions;
	};

	// Pomocná metoda pro porovnání dvou polí abychom zjistil, jestli se změnila po zpracování
	private ArraysEqual = (a: number[], b: number[]): boolean => {
		if (a.length !== b.length) {
			return false;
		}
		for (let i = 0; i < a.length; i++) {
			if (a[i] !== b[i]) {
				return false;
			}
		}
		return true;
	};

	// Zpracování jednoho řádku nebo sloupce pro posun a sloučení čísel
	private ProcessLine = (line: number[]): number[] => {
		const filtered = line.filter((value) => value !== 0);
		const merged: number[] = [];

		for (let i = 0; i < filtered.length; i++) {
			const current = filtered[i];
			const next = filtered[i + 1];

			if (current !== 0 && current === next) {
				merged.push(current * 2);
				i++;
			} else {
				merged.push(current);
			}
		}

		while (merged.length < this.size) {
			merged.push(0);
		}

		return merged;
	};

	// Kontrola, jestli je možné provést tah v daném směru
	public CanMove = (direction: Direction): boolean => {
		switch (direction) {
			case 'left':
				for (let row = 0; row < this.size; row++) {
					const original = this.grid[row];
					const updated = this.ProcessLine(original);
					if (!this.ArraysEqual(original, updated)) {
						return true;
					}
				}
				return false;
			case 'right':
				for (let row = 0; row < this.size; row++) {
					const original = this.grid[row];
					const reversed = [...original].reverse();
					const updated = this.ProcessLine(reversed).reverse();
					if (!this.ArraysEqual(original, updated)) {
						return true;
					}
				}
				return false;
			case 'up':
				for (let col = 0; col < this.size; col++) {
					const original: number[] = [];
					for (let row = 0; row < this.size; row++) {
						original.push(this.grid[row][col]);
					}

					const updated = this.ProcessLine(original);
					if (!this.ArraysEqual(original, updated)) {
						return true;
					}
				}
				return false;
			case 'down':
				for (let col = 0; col < this.size; col++) {
					const original: number[] = [];
					for (let row = 0; row < this.size; row++) {
						original.push(this.grid[row][col]);
					}

					const reversed = [...original].reverse();
					const updated = this.ProcessLine(reversed).reverse();
					if (!this.ArraysEqual(original, updated)) {
						return true;
					}
				}
				return false;
			default:
				throw new Error('Neplatný směr');
		}
	};

	// Pokus o provedení tahu v daném směru, vrací true pokud se něco změnilo
	private TryMove = (direction: Direction): boolean => {
		let moved = false;

		switch (direction) {
			case 'left':
				for (let row = 0; row < this.size; row++) {
					const original = this.grid[row];
					const updated = this.ProcessLine(original);
					if (!this.ArraysEqual(original, updated)) {
						moved = true;
						this.grid[row] = updated;
					}
				}
				break;
			case 'right':
				for (let row = 0; row < this.size; row++) {
					const original = this.grid[row];
					const reversed = [...original].reverse();
					const updated = this.ProcessLine(reversed).reverse();
					if (!this.ArraysEqual(original, updated)) {
						moved = true;
						this.grid[row] = updated;
					}
				}
				break;
			case 'up':
				for (let col = 0; col < this.size; col++) {
					const original: number[] = [];
					for (let row = 0; row < this.size; row++) {
						original.push(this.grid[row][col]);
					}

					const updated = this.ProcessLine(original);
					if (!this.ArraysEqual(original, updated)) {
						moved = true;
						for (let row = 0; row < this.size; row++) {
							this.grid[row][col] = updated[row];
						}
					}
				}
				break;
			case 'down':
				for (let col = 0; col < this.size; col++) {
					const original: number[] = [];
					for (let row = 0; row < this.size; row++) {
						original.push(this.grid[row][col]);
					}

					const reversed = [...original].reverse();
					const updated = this.ProcessLine(reversed).reverse();
					if (!this.ArraysEqual(original, updated)) {
						moved = true;
						for (let row = 0; row < this.size; row++) {
							this.grid[row][col] = updated[row];
						}
					}
				}
				break;
			default:
				throw new Error('Neplatný směr');
		}

		return moved;
	};

	// Provádí tah v daném směru, přidá nové číslo pokud se něco změnilo, a zkontroluje zda nenastala prohra
	public Move = (direction: Direction, onLose?: () => void) => {
		const moved = this.TryMove(direction);

		if (moved) {
			const emptyPositions = this.GetEmptyPositions();

			if (emptyPositions.length > 0) {
				const randomIndex = Math.floor(Math.random() * emptyPositions.length);
				const [x, y] = emptyPositions[randomIndex];
				this.grid[y][x] = this.GenerateNumber();
			}
		}

		if (this.HasLost()) {
			onLose?.();
		}
	};

	// Kontrola, zda hráč prohrál (není možné provést žádný tah)
	public HasLost = (): boolean => {
		return !(
			this.CanMove('up') ||
			this.CanMove('down') ||
			this.CanMove('left') ||
			this.CanMove('right')
		);
	};

	// Získání všech prázdných pozic na mřížce pro přidání nového čísla
	private GetEmptyPositions = (): Position[] => {
		const emptyPositions: Position[] = [];

		for (let i = 0; i < this.size; i++) {
			for (let j = 0; j < this.size; j++) {
				if (this.grid[i][j] === 0) {
					emptyPositions.push([j, i]);
				}
			}
		}

		return emptyPositions;
	};

	// Generování počáteční mřížky s dvěma náhodnými čísly
	public GenerateGrid = () => {
		const randomPos: Position[] = this.GeneratePositionsForInitialNumbers(this.size);
		randomPos.forEach((position) => {
			const x = position[0];
			const y = position[1];
			this.grid[y][x] = this.GenerateNumber();
		});
	};

	// Výstup do konzole aktuálního stavu mřížky do konzole
	public PrintGrid = () => {
		const maxDigits = Math.max(1, ...this.grid.flat().map((value) => value.toString().length));
		const cellWidth = maxDigits + 2;
		const horizontalBorder =
			'+' +
			Array(this.size)
				.fill('-'.repeat(cellWidth + 2))
				.join('+') +
			'+';

		for (let i = 0; i < this.grid.length; i++) {
			console.log(horizontalBorder);
			const formattedRow = this.grid[i]
				.map((value) => ` ${value.toString().padStart(cellWidth, ' ')} `)
				.join('|');
			console.log(`|${formattedRow}|`);
		}

		console.log(horizontalBorder);
	};

	// Získání hrací mřížky
	public GetGrid = (): number[][] => {
		return this.grid;
	};

	// Získání aktuálního skóre (nejvyšší číslo na mřížce)
	public GetScore = (): number => {
		return Math.max(...this.grid.flat());
	};
}
