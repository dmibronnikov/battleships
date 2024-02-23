import { AddShipsIncomingMessageContent, ContentShip, StartGameOutgoingMessageContent } from "../model/websocketMessages.js";
import { storage } from "../storage/db.js";
import { GameState, Ship } from "../model/gameState.js";
import { Game } from "../model/game.js";

export const handle = (content: AddShipsIncomingMessageContent): StartGameOutgoingMessageContent[] | undefined => {
    const existingGameState = storage.getGameState(content.gameId);
    
    if (existingGameState !== undefined) {
        if (existingGameState.firstPlayer === undefined) {
            throw new Error('Invalid game state');
        }

        existingGameState.secondPlayer = {
            playerId: content.indexPlayer,
            ships: shipsFromContent(content.ships)
        };

        storage.upsertGameState(existingGameState, content.gameId);

        if (existingGameState.firstPlayer !== undefined && existingGameState.secondPlayer !== undefined) {
            return [
                {
                    currentPlayerIndex: existingGameState.firstPlayer.playerId,
                    ships: shipsToContent(existingGameState.firstPlayer.ships)
                },
                {
                    currentPlayerIndex: existingGameState.secondPlayer.playerId,
                    ships: shipsToContent(existingGameState.secondPlayer.ships)
                }
            ];
        }
    } else {
        let gameState: GameState = {
            firstPlayer: {
                playerId: content.indexPlayer,
                ships: shipsFromContent(content.ships)
            },
            secondPlayer: undefined
        };

        storage.upsertGameState(gameState, content.gameId);
    }
};

const shipsFromContent = (shipsContent: ContentShip[]): Ship[] => {
    return shipsContent.map((shipContent): Ship => {
        return {
            position: {
                x: shipContent.position.x,
                y: shipContent.position.y
            },
            direction: shipContent.direction,
            length: shipContent.length,
            type: shipContent.type,
            damage: 0
        }
    });
};

const shipsToContent = (ships: Ship[]): ContentShip[] => {
    return ships.map((ship): ContentShip => {
        return {
            position: {
                x: ship.position.x,
                y: ship.position.y
            },
            direction: ship.direction,
            length: ship.length,
            type: ship.type
        }
    });
}