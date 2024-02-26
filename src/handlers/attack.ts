import { AttackFeedbackOutgoingMessageContent, FinishOutgoingMessageContent } from "../model/websocketMessages.js";
import { Point } from "../types.js";

export const handle = (
        playerId: number,
        attackPosition: Point,
        attackResult: 'miss' | 'shot' | 'killed'
    ): AttackFeedbackOutgoingMessageContent => {
        return {
            position: {
                x: attackPosition.x,
                y: attackPosition.y
            },
            currentPlayer: playerId,
            status: attackResult
        }
};