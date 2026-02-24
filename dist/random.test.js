"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomTest = void 0;
const _2048_1 = require("./2048");
class RandomTest {
    constructor(grid_size) {
        this.grid_size = grid_size;
        this.name = 'RandomTest';
        this.game = null;
        this.moves_count = 0;
        this.valid_moves = ['up', 'right', 'down', 'left'];
        this.InitiateGame();
        console.log('RandomTest created');
    }
    InitiateGame() {
        this.game = new _2048_1.Game2048(this.grid_size);
        this.game.GenerateGrid();
    }
    Run() {
        this.moves_count = 0; // Reset počtu tahů pro každý běh testu
        if (!this.game) {
            console.error('Game not initialized');
            return { success: false, message: 'Game not initialized' };
        }
        let status = true;
        while (status) {
            const random_move = this.valid_moves[Math.floor(Math.random() * this.valid_moves.length)];
            this.game.Move(random_move, () => {
                // console.log(`Game Over! Score: ${this.game?.GetScore()}`);
                status = false;
            });
            this.moves_count++;
            if (!status) {
                // this.game.PrintGrid();
                return {
                    success: false,
                    message: 'Game over',
                    score: this.game.GetScore(),
                    moves_count: this.moves_count
                };
            }
        }
        return {
            success: true,
            message: 'Random test completed',
            score: this.game.GetScore(),
            moves_count: this.moves_count
        };
    }
}
exports.RandomTest = RandomTest;
