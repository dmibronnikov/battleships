import { AttackFeedbackOutgoingMessageContent } from "../model/websocketMessages.js";
import { Point } from "../types.js";

export const handle = (
        playerId: number,
        attackResult: [Point, 'miss' | 'shot' | 'killed'][]
    ): AttackFeedbackOutgoingMessageContent[] => {
        let response: AttackFeedbackOutgoingMessageContent[] = [];
        for (const attackPoint of attackResult) {
            response.push(
                {
                    position: {
                        x: attackPoint[0].x,
                        y: attackPoint[0].y
                    },
                    currentPlayer: playerId,
                    status: attackPoint[1]
                }
            )
        }

        return response;
};