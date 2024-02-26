import { Ship } from "../model/gameField.js";
import { User } from "../model/user.js";
import { storage } from "../storage/db.js"
import { Point } from "../types.js";

class GameService {
    private lastPlayerId: number | undefined
    private gameId: string

    constructor(gameId: string) {
        this.gameId = gameId;
    }

    playerIds(): number[] {
        const game = storage.getGame(this.gameId);

        if (game === undefined) { throw new Error('No game state'); }

        return game.room.users.map(roomUser => { return roomUser.index });
    }

    turn(): number {
        const gameState = storage.getGameState(this.gameId);

        if (gameState === undefined) { throw new Error('No game state'); }
        if (gameState.firstPlayer === undefined || gameState.secondPlayer === undefined) { 
            throw new Error('Incorrect game state');
        }
        
        if (this.lastPlayerId === undefined || this.lastPlayerId === gameState.secondPlayer.playerId) {
            return gameState.firstPlayer.playerId;
        } else {
            return gameState.secondPlayer.playerId;
        }
    }

    attack(x: number, y: number, playerId: number): [Point, 'miss' | 'shot' | 'killed'][] | 'won' {
        let gameState = storage.getGameState(this.gameId);

        if (gameState === undefined) { throw new Error('No game state'); }

        if (gameState.firstPlayer === undefined || gameState.secondPlayer === undefined) { 
            throw new Error('Incorrect game state');
        }

        const turn: 'first'|'second' = gameState.firstPlayer.playerId === playerId ? 'first' : 'second';
        const currentPlayer = turn === 'first' ? gameState.firstPlayer : gameState.secondPlayer;
        let gameField = turn === 'first' ? gameState.secondPlayer.field : gameState.firstPlayer.field;

        let damagedShip: [Ship, number] | undefined

        for (const ship of gameField.ships) {
            const partIndex = ship.position.findIndex(point => {
                return point.x === x && point.y === y;
            });

            if (partIndex !== -1) {
                damagedShip = [ship, partIndex];
                break;
            }
        }

        if (damagedShip === undefined) {
            this.lastPlayerId = currentPlayer.playerId;
            return [
                [{ x: x, y: y }, 'miss']
            ];
        }

        let ship = damagedShip[0];
        let damagedPart = damagedShip[1];

        ship.status[damagedPart] = 1;
        for (let i = 0; i < ship.position.length; i++) {
            const point = ship.position[i];
            gameField.field[point.y][point.x] = ship.status[i] === 1 ? 2 : 1;
        }

        const isKilled = ship.status.every(value => { return value === 1 });

        if (isKilled) {
            gameField.shipsLeft -= 1;
        }

        if (turn === 'first') {
            gameState.secondPlayer.field = gameField;
        } else {
            gameState.firstPlayer.field = gameField;
        }

        storage.upsertGameState(gameState, this.gameId);
        
        if (gameField.shipsLeft <= 0) {
            return 'won';
        }

        if (isKilled) {
            let result: [Point, 'miss' | 'shot' | 'killed'][] = [];
            for (const point of ship.position) {
                result.push([{ x: point.x, y: point.y }, 'killed']);
            }

            if (ship.direction === true) {
                for (const point of ship.position) {
                    if (point.x > 0) {
                        result.push([{ x: point.x - 1, y: point.y }, 'miss']);
                    }
    
                    if (point.x < gameField.field[0].length - 1) {
                        result.push([{ x: point.x + 1, y: point.y }, 'miss']);
                    }
                }

                const head = ship.head;
                const tail = ship.position[ship.position.length - 1];

                if (head.y > 0) {
                    result.push([{ x: head.x, y: head.y - 1 }, 'miss']);
                    
                    if (head.x > 0) {
                        result.push([{ x: head.x - 1, y: head.y - 1 }, 'miss']);                        
                    }

                    if (head.x < gameField.field[0].length - 1) {
                        result.push([{ x: head.x + 1, y: head.y - 1 }, 'miss']);
                    }
                }

                if (tail.y < gameField.field.length - 1) {
                    result.push([{ x: tail.x, y: tail.y + 1 }, 'miss']);

                    if (tail.x > 0) {
                        result.push([{ x: tail.x - 1, y: tail.y + 1 }, 'miss']);
                    }

                    if (tail.x < gameField.field[0].length - 1) {
                        result.push([{ x: tail.x + 1, y: tail.y + 1 }, 'miss']);
                    }
                }
            } else {
                for (const point of ship.position) {
                    if (point.y > 0) {
                        result.push([{ x: point.x, y: point.y - 1 }, 'miss']);
                    }
    
                    if (point.y < gameField.field.length - 1) {
                        result.push([{ x: point.x, y: point.y + 1 }, 'miss']);
                    }
                }

                const head = ship.head;
                const tail = ship.position[ship.position.length - 1];

                if (head.x > 0) {
                    result.push([{ x: head.x - 1, y: head.y }, 'miss']);
                    
                    if (head.y > 0) {
                        result.push([{ x: head.x - 1, y: head.y - 1 }, 'miss']);                        
                    }

                    if (head.y < gameField.field.length - 1) {
                        result.push([{ x: head.x - 1, y: head.y + 1 }, 'miss']);
                    }
                }

                if (tail.x < gameField.field[0].length - 1) {
                    result.push([{ x: tail.x + 1, y: tail.y }, 'miss']);

                    if (tail.y > 0) {
                        result.push([{ x: tail.x + 1, y: tail.y - 1 }, 'miss']);
                    }

                    if (tail.y < gameField.field.length - 1) {
                        result.push([{ x: tail.x + 1, y: tail.y + 1 }, 'miss']);
                    }
                }
            }

            return result;
        } else {
            return [
                [{ x: x, y: y }, 'shot']
            ];
        }
    }
}

export { GameService };