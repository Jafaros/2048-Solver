"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game2048 = void 0;
// Třída spravující logiku hry 2048
class Game2048 {
    // Konstruktor pro inicializaci prázdné mřížky
    constructor(size) {
        this.size = size;
        // Generování náhodného čísla (2 nebo 4) pro nové pole s poměrem 9:1
        this.GenerateNumber = () => {
            const rand = Math.round(Math.random() * 10) % 10;
            if (rand < 9) {
                return 2;
            }
            else {
                return 4;
            }
        };
        // Generování náhodných pozic pro počáteční čísla
        this.GeneratePositionsForInitialNumbers = (size) => {
            if (size * size < 2) {
                throw new Error('Velikost mřížky musí umožnit alespoň dvě pozice.');
            }
            const positions = [];
            const seen = new Set();
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
        this.ArraysEqual = (a, b) => {
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
        this.ProcessLine = (line) => {
            const filtered = line.filter((value) => value !== 0);
            const merged = [];
            for (let i = 0; i < filtered.length; i++) {
                const current = filtered[i];
                const next = filtered[i + 1];
                if (current !== 0 && current === next) {
                    merged.push(current * 2);
                    i++;
                }
                else {
                    merged.push(current);
                }
            }
            while (merged.length < this.size) {
                merged.push(0);
            }
            return merged;
        };
        // Kontrola, jestli je možné provést tah v daném směru
        this.CanMove = (direction) => {
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
                        const original = [];
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
                        const original = [];
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
        this.TryMove = (direction) => {
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
                        const original = [];
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
                        const original = [];
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
        this.Move = (direction, onLose) => {
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
        // Kontrola, zda hráč vyhrál (má na mřížce číslo 2048 nebo vyšší)
        this.HasWon = () => {
            return this.grid.some((row) => row.some((value) => value >= 2048));
        };
        // Kontrola, zda hráč prohrál (není možné provést žádný tah)
        this.HasLost = () => {
            return !(this.CanMove('up') ||
                this.CanMove('down') ||
                this.CanMove('left') ||
                this.CanMove('right'));
        };
        // Získání všech prázdných pozic na mřížce pro přidání nového čísla
        this.GetEmptyPositions = () => {
            const emptyPositions = [];
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
        this.GenerateGrid = () => {
            const randomPos = this.GeneratePositionsForInitialNumbers(this.size);
            randomPos.forEach((position) => {
                const x = position[0];
                const y = position[1];
                this.grid[y][x] = this.GenerateNumber();
            });
        };
        // Výstup do konzole aktuálního stavu mřížky do konzole
        this.PrintGrid = () => {
            const maxDigits = Math.max(1, ...this.grid.flat().map((value) => value.toString().length));
            const cellWidth = maxDigits + 2;
            const horizontalBorder = '+' +
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
        this.GetGrid = () => {
            return this.grid;
        };
        // Nastavení hrací mřížky (používá se pro testování s předdefinovanými stavy)
        this.SetGrid = (newGrid) => {
            if (newGrid.length !== this.size || newGrid.some((row) => row.length !== this.size)) {
                throw new Error('Nová mřížka musí mít stejnou velikost jako původní.');
            }
            this.grid = newGrid;
        };
        // Nastavení konkrétní hodnoty na danou pozici (používá se pro testování s předdefinovanými stavy)
        this.SetValueOnPosition = (position, value) => {
            const [x, y] = position;
            if (x < 0 || x >= this.size || y < 0 || y >= this.size) {
                throw new Error('Pozice je mimo hranice mřížky.');
            }
            this.grid[y][x] = value;
        };
        // Získání aktuálního skóre (nejvyšší číslo na mřížce)
        this.GetScore = () => {
            return Math.max(...this.grid.flat());
        };
        this.grid = [];
        for (let i = 0; i < size; i++) {
            this.grid[i] = [];
            for (let j = 0; j < size; j++) {
                this.grid[i][j] = 0;
            }
        }
    }
}
exports.Game2048 = Game2048;
