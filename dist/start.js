"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _2048_1 = require("./2048");
const GRID_SIZE = 2; // Velikost mřížky (např. 4 pro klasickou hru 2048)
const game = new _2048_1.Game2048(GRID_SIZE); // Vytvoření instance hry s danou velikostí mřížky
game.GenerateGrid(); // Generování počáteční mřížky s dvěma náhodnými čísly
const grid = game.GetGrid(); // Získání aktuální hrací mřížky
game.PrintGrid(grid); // Výstup do konzole aktuálního stavu mřížky
// Simulace tahů hráče
const moves = ['up', 'right', 'down', 'left'];
let status = true;
for (const move of moves) {
    game.Move(move, () => {
        console.log('Game Over!');
        status = false;
    });
    if (!status) {
        game.PrintGrid(grid);
        break;
    }
    console.log(`After move: ${move}`);
    game.PrintGrid(grid);
}
