import { TurnOutgoingMessageContent } from "../model/websocketMessages.js";

export const handleTurn = (playerId: number): TurnOutgoingMessageContent => {
    return {
        currentPlayer: playerId
    }
};