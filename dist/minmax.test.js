"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinMaxTest = void 0;
const _2048_1 = require("./2048");
class MinMaxTest {
    constructor(grid_size, max_depth = 3) {
        this.grid_size = grid_size;
        this.max_depth = max_depth;
        this.name = 'MinMaxTest';
        this.game = null;
        this.moves_count = 0;
        this.InitiateGame();
        console.log(`${this.name} vytvořen`);
    }
    InitiateGame() {
        this.game = new _2048_1.Game2048(this.grid_size);
        this.game.GenerateGrid();
    }
    Run() {
        this.moves_count = 0; // Reset počtu tahů pro každý běh testu
        if (!this.game) {
            console.error('Hra nebyla inicializována');
            return { success: false, message: 'Hra nebyla inicializována' };
        }
        // Implementace logiky pro tahy, které se snaží udržet nejvyšší hodnotu v rohu
        let status = true;
        while (status) {
            const possibleMoves = ['up', 'down', 'left', 'right'];
            const move = possibleMoves.find((direction) => this.game.CanMove(direction));
            if (!move) {
                // this.game.PrintGrid();
                return {
                    success: false,
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
                    success: false,
                    message: `${this.name} skončil`,
                    score: this.game.GetScore(),
                    moves_count: this.moves_count
                };
            }
        }
        return {
            success: true,
            message: `${this.name} dokončen`,
            score: this.game.GetScore(),
            moves_count: this.moves_count
        };
    }
}
exports.MinMaxTest = MinMaxTest;
