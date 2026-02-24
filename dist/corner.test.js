"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CornerTest = void 0;
const _2048_1 = require("./2048");
class CornerTest {
    constructor(grid_size) {
        this.grid_size = grid_size;
        this.name = 'CornerTest';
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
            const preferredMoves = ['down', 'right'];
            const fallbackMoves = ['up', 'left'];
            const move = [...preferredMoves, ...fallbackMoves].find((direction) => this.game.CanMove(direction));
            if (!move) {
                // this.game.PrintGrid();
                return {
                    success: this.game.HasWon(),
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
                    success: this.game.HasWon(),
                    message: `${this.name} skončil`,
                    score: this.game.GetScore(),
                    moves_count: this.moves_count
                };
            }
        }
        return {
            success: this.game.HasWon(),
            message: `${this.name} dokončen`,
            score: this.game.GetScore(),
            moves_count: this.moves_count
        };
    }
}
exports.CornerTest = CornerTest;
