"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomTest = void 0;
const _2048_1 = require("./2048");
const GRID_SIZE = 4; // Velikost mřížky (např. 4 pro klasickou hru 2048)
// Implementace náhodného testu, který provádí náhodné tahy, dokud hra neskončí
class RandomTest {
    constructor() {
        this.name = 'RandomTest';
        this.game = null;
        this.valid_moves = ['up', 'right', 'down', 'left'];
        this.InitiateGame();
        console.log('RandomTest created');
    }
    InitiateGame() {
        this.game = new _2048_1.Game2048(GRID_SIZE);
        this.game.GenerateGrid();
    }
    Run() {
        if (!this.game) {
            console.error('Game not initialized');
            return { success: false, message: 'Game not initialized' };
        }
        let status = true;
        let moves_count = 0;
        while (status) {
            const random_move = this.valid_moves[Math.floor(Math.random() * this.valid_moves.length)];
            this.game.Move(random_move, () => {
                console.log(`Game Over! Score: ${this.game?.GetScore()}`);
                status = false;
            });
            moves_count++;
            if (!status) {
                this.game.PrintGrid();
                return { success: false, message: 'Game over', score: this.game.GetScore(), moves_count };
            }
        }
        return {
            success: true,
            message: 'Random test completed',
            score: this.game.GetScore(),
            moves_count
        };
    }
}
exports.RandomTest = RandomTest;
