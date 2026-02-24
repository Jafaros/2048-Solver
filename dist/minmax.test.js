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
            const gameInstance = new _2048_1.Game2048(this.grid_size);
            gameInstance.SetGrid(this.game.GetGrid());
            const tree = (0, tree_helper_1.BuildTree)(gameInstance, this.max_depth);
            if (tree.head)
                (0, tree_helper_1.AssignNodeValues)(tree.head);
            const move = (0, tree_helper_1.GetBestMove)(tree);
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
exports.MinMaxTest = MinMaxTest;
