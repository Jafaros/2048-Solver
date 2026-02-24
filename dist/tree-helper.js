"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildTree = BuildTree;
exports.AssignNodeValues = AssignNodeValues;
exports.GetBestMove = GetBestMove;
exports.PrintTree = PrintTree;
const _2048_1 = require("./2048");
function BuildTree(game, maxDepth) {
    const firstNode = BuildPlayerNode(game, 0, maxDepth);
    const tree = {
        head: firstNode,
        game: game,
        size: 1,
        maxDepth: maxDepth
    };
    return tree;
}
function BuildPlayerNode(game, depth, maxDepth) {
    const possibleMoves = ['up', 'down', 'left', 'right'];
    const validMoves = possibleMoves.filter((direction) => game.CanMove(direction));
    const node = {
        kind: 'PLAYER',
        grid: game.GetGrid(),
        depth: depth,
        children: {}
    };
    if (depth < maxDepth) {
        for (const move of validMoves) {
            // Create a proper copy of the game state
            const gameSize = game.GetGrid().length;
            const newGame = new _2048_1.Game2048(gameSize);
            newGame.SetGrid(JSON.parse(JSON.stringify(game.GetGrid())));
            newGame.Move(move, () => { });
            const spawnPoints = GetPossibleSpawnPoints(newGame);
            const chanceNode = {
                kind: 'CHANCE',
                grid: newGame.GetGrid(),
                depth: depth + 1,
                causedByMove: move,
                outcomes: spawnPoints.map((spawn) => {
                    // Create a fresh copy for each outcome
                    const outcomeGame = new _2048_1.Game2048(gameSize);
                    outcomeGame.SetGrid(JSON.parse(JSON.stringify(newGame.GetGrid())));
                    const next = BuildPlayerNode(outcomeGame, depth + 2, maxDepth);
                    return {
                        spawn,
                        next
                    };
                })
            };
            node.children[move] = chanceNode;
        }
    }
    return node;
}
function AssignNodeValues(node) {
    if (node.kind === 'PLAYER') {
        let maxMovesCount = 0;
        for (const child of Object.values(node.children)) {
            if (child) {
                AssignNodeValues(child);
                // Count valid moves in this player node
                const movesInThisNode = Object.values(node.children).filter((c) => c).length;
                maxMovesCount = Math.max(maxMovesCount, movesInThisNode);
            }
        }
        // Value based on maximum number of possible moves available
        node.value = maxMovesCount;
        return node.value;
    }
    else if (node.kind === 'CHANCE') {
        let maxMovesCount = 0;
        for (const outcome of node.outcomes) {
            if (outcome.next) {
                AssignNodeValues(outcome.next);
                // Count valid moves in each child PlayerNode
                const movesInChild = Object.values(outcome.next.children).filter((c) => c).length;
                maxMovesCount = Math.max(maxMovesCount, movesInChild);
            }
        }
        // Value based on maximum moves available in any outcome
        node.value = maxMovesCount;
        return node.value;
    }
    return 0;
}
function GetBestMove(tree) {
    if (!tree.head) {
        return null;
    }
    let bestMove = null;
    let bestValue = -Infinity;
    for (const [move, child] of Object.entries(tree.head.children)) {
        if (child) {
            const childValue = child.value || 0;
            if (childValue > bestValue) {
                bestValue = childValue;
                bestMove = move;
            }
        }
    }
    return bestMove;
}
function GetPossibleSpawnPoints(game) {
    const emptyPositions = game.GetEmptyPositions();
    const outcomes = [];
    for (const [x, y] of emptyPositions) {
        outcomes.push({
            x,
            y,
            value: 2
        });
        outcomes.push({
            x,
            y,
            value: 4
        });
    }
    return outcomes;
}
function PrintTree(node, indent = '') {
    if (node.kind === 'PLAYER') {
        console.log(`${indent}PlayerNode (Depth: ${node.depth})`);
        for (const [move, child] of Object.entries(node.children)) {
            if (child) {
                console.log(`${indent}  Move: ${move}`);
                PrintTree(child, indent + '    ');
            }
        }
    }
    else if (node.kind === 'CHANCE') {
        console.log(`${indent}ChanceNode (Depth: ${node.depth}, Caused by Move: ${node.causedByMove})`);
        for (const outcome of node.outcomes) {
            console.log(`${indent}  Spawn: (x: ${outcome.spawn.x}, y: ${outcome.spawn.y}, value: ${outcome.spawn.value})`);
            if (outcome.next) {
                PrintTree(outcome.next, indent + '    ');
            }
        }
    }
}
