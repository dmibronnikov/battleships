import { storage } from "../storage/db.js"

class GameService {
    private lastPlayerId: number | undefined
    private gameId: string

    constructor(gameId: string) {
        this.gameId = gameId;
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

    // attack(x: number, y: number, playerId: number): 'miss' | 'killed' | 'shot' {
    //     let gameState = storage.getGameState(this.gameId);

    //     if (gameState === undefined) { throw new Error('No game state'); }

    //     if (gameState.firstPlayer === undefined || gameState.secondPlayer === undefined) { 
    //         throw new Error('Incorrect game state');
    //     }

    //     const turn: 'first'|'second' = gameState.firstPlayer.playerId === playerId ? 'first' : 'second';

    //     let field = turn === 'first' ? gameState.secondPlayer.field.slice() : gameState.firstPlayer.field.slice();


    // }
}

export { GameService };