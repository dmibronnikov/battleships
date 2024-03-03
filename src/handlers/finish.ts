import { FinishOutgoingMessageContent } from "../model/websocketMessages.js"

export const handle = (playerId: number): FinishOutgoingMessageContent => {
    return {
        winPlayer: playerId
    };
};