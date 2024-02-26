import { AddShipsIncomingMessageContent, StartGameOutgoingMessageContent } from "../model/websocketMessages.js";
import { storage } from "../storage/db.js";
import { GameState, generate as generateGameField, contentFromShips } from "../model/gameField.js";

export const handle = (content: AddShipsIncomingMessageContent): StartGameOutgoingMessageContent[] | undefined => {
    const existingGameState = storage.getGameState(content.gameId);
    
    if (existingGameState !== undefined) {
        if (existingGameState.firstPlayer === undefined) {
            throw new Error('Invalid game state');
        }

        existingGameState.secondPlayer = {
            playerId: content.indexPlayer,
            field: generateGameField(content.ships)
        };

        storage.upsertGameState(existingGameState, content.gameId);

        if (existingGameState.firstPlayer !== undefined && existingGameState.secondPlayer !== undefined) {
            return [
                {
                    currentPlayerIndex: existingGameState.firstPlayer.playerId,
                    ships: contentFromShips(existingGameState.firstPlayer.field.ships)
                },
                {
                    currentPlayerIndex: existingGameState.secondPlayer.playerId,
                    ships: contentFromShips(existingGameState.secondPlayer.field.ships)
                }
            ];
        }
    } else {
        let gameState: GameState = {
            firstPlayer: {
                playerId: content.indexPlayer,
                field: generateGameField(content.ships)
            },
            secondPlayer: undefined
        };

        storage.upsertGameState(gameState, content.gameId);
    }
};