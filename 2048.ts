const GRID_SIZE = 2;

const GenerateNumber = (): number => {
    const rand = Math.round(Math.random() * 10) % 10;

    if (rand < 9) {
        return 2;
    } else {
        return 4;
    }
}

let grid: number[][] = [];
type Position = number[];

const GeneratePositionsForInitialNumbers = (size: number): Position[] => {
    let positions: Position[] = [];

    while (positions.length != 2) {
        const x = Math.round(Math.random() * 10) % size;
        const y = Math.round(Math.random() * 10) % size;

        if (positions.includes([x, y])) {
            continue;
        }
        
        positions.push([x, y]);
    }

    console.log("Positions", positions);
    return positions;
}

const GenerateGrid = (size: number) => {

    for (let i = 0; i < size; i++) {
        grid[i] = [];

        for (let j = 0; j < size; j++) {
            grid[i][j] = 0;
        }
    }

    let randomPos: Position[] = GeneratePositionsForInitialNumbers(size);
    randomPos.forEach((position) => {
        const x = position[0];
        const y = position[1];
        grid[y][x] = GenerateNumber();
    });
}

GenerateGrid(GRID_SIZE);
console.log("Grid", grid);