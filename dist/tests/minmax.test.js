"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinMaxTest = void 0;
const _2048_1 = require("../2048");
const tree_helper_1 = require("../utils/tree-helper");
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
    GetEffectiveDepth() {
        if (!this.game) {
            return this.max_depth;
        }
        const emptyCount = this.game.GetEmptyPositions().length;
        if (emptyCount >= 8) {
            return Math.max(2, this.max_depth - 2);
        }
        if (emptyCount >= 5) {
            return Math.max(2, this.max_depth - 1);
        }
        return this.max_depth;
    }
    Run() {
        this.moves_count = 0; // Reset počtu tahů pro každý běh testu
        if (!this.game) {
            console.error('Hra nebyla inicializována');
            return { success: false, message: 'Hra nebyla inicializována' };
        }
        let status = true;
        while (status) {
            const depth = this.GetEffectiveDepth();
            const tree = (0, tree_helper_1.BuildTree)(this.game, depth);
            if (tree.head)
                (0, tree_helper_1.AssignNodeValues)(tree.head);
            const move = (0, tree_helper_1.GetBestMove)(tree);
            if (!move) {
                return {
                    success: this.game.HasWon(),
                    message: `${this.name} skončil`,
                    score: this.game.GetScore(),
                    moves_count: this.moves_count,
                };
            }
            this.game.Move(move, () => {
                status = false;
            });
            this.moves_count++;
            if (!status) {
                return {
                    success: this.game.HasWon(),
                    message: `${this.name} skončil`,
                    score: this.game.GetScore(),
                    moves_count: this.moves_count,
                };
            }
        }
        return {
            success: this.game.HasWon(),
            message: `${this.name} dokončen`,
            score: this.game.GetScore(),
            moves_count: this.moves_count,
        };
    }
}
exports.MinMaxTest = MinMaxTest;
