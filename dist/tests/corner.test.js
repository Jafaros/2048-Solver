"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CornerTest = void 0;
const _2048_1 = require("../2048");
class CornerTest {
    constructor(grid_size) {
        this.grid_size = grid_size;
        this.name = 'CornerTest';
        this.game = null;
        this.moves_done = {
            up: 0,
            down: 0,
            left: 0,
            right: 0,
        };
        this.InitiateGame();
        console.log(`${this.name} vytvořen`);
    }
    InitiateGame() {
        this.game = new _2048_1.Game2048(this.grid_size);
        this.game.GenerateGrid();
    }
    ShuffleDirections(directions) {
        const shuffled = [...directions];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    Run() {
        this.moves_done = {
            up: 0,
            down: 0,
            left: 0,
            right: 0,
        };
        if (!this.game) {
            console.error('Hra nebyla inicializována');
            return { success: false, message: 'Hra nebyla inicializována' };
        }
        // Implementace logiky pro tahy, které se snaží udržet nejvyšší hodnotu v rohu
        let status = true;
        while (status) {
            const preferredMoves = this.ShuffleDirections([
                'down',
                'right',
            ]);
            const fallbackMoves = this.ShuffleDirections([
                'up',
                'left',
            ]);
            const move = [...preferredMoves, ...fallbackMoves].find((direction) => this.game.CanMove(direction));
            if (!move) {
                return {
                    success: this.game.HasWon(),
                    message: `${this.name} skončil`,
                    score: this.game.GetScore(),
                    moves_done: this.moves_done,
                };
            }
            this.game.Move(move, () => {
                status = false;
            });
            this.moves_done[move] += 1;
            if (!status) {
                return {
                    success: this.game.HasWon(),
                    message: `${this.name} skončil`,
                    score: this.game.GetScore(),
                    moves_done: this.moves_done,
                };
            }
        }
        return {
            success: this.game.HasWon(),
            message: `${this.name} dokončen`,
            score: this.game.GetScore(),
            moves_done: this.moves_done,
        };
    }
}
exports.CornerTest = CornerTest;
