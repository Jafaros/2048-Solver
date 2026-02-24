"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildTree = BuildTree;
exports.PrintTree = PrintTree;
function BuildTree(game, maxDepth) {
    const possibleMoves = ['up', 'down', 'left', 'right'];
    const validMoves = possibleMoves.filter((direction) => game.CanMove(direction));
    const firstNode = {
        kind: 'PLAYER',
        grid: game.GetGrid(),
        depth: 0,
        children: {}
    };
    const tree = {
        head: firstNode,
        game: game,
        size: 1,
        maxDepth: maxDepth
    };
    for (const move of validMoves) {
        const newGame = tree.game;
        newGame.Move(move, () => { });
        const spawnPoints = GetPossibleSpawnPoints(newGame);
        const chanceNode = {
            kind: 'CHANCE',
            grid: newGame.GetGrid(),
            depth: 1,
            causedByMove: move,
            outcomes: spawnPoints.map((spawn) => {
                const next = {
                    kind: 'PLAYER',
                    grid: newGame.GetGrid(),
                    depth: 2,
                    children: {}
                };
                return {
                    spawn,
                    next
                };
            })
        };
        firstNode.children[move] = chanceNode;
    }
    return tree;
}
function GetPossibleSpawnPoints(game) {
    const emptyPositions = game.GetEmptyPositions();
    const outcomes = [];
    for (const [x, y] of emptyPositions) {
        outcomes.push({
            x,
            y,
            value: 2,
            p: 0.9 / emptyPositions.length
        });
        outcomes.push({
            x,
            y,
            value: 4,
            p: 0.1 / emptyPositions.length
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
            console.log(`${indent}  Spawn: (x: ${outcome.spawn.x}, y: ${outcome.spawn.y}, value: ${outcome.spawn.value}, p: ${outcome.spawn.p})`);
            if (outcome.next) {
                PrintTree(outcome.next, indent + '    ');
            }
        }
    }
}
