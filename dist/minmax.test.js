"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinMaxTest = void 0;
const _2048_1 = require("./2048");
const tree_helper_1 = require("./tree-helper");
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
        let status = true;
        while (status) {
            const tree = (0, tree_helper_1.BuildTree)(this.game, this.max_depth);
            (0, tree_helper_1.PrintTree)(tree.head, '|');
            this.moves_count++;
            status = false;
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
