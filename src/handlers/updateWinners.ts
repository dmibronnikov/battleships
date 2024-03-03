import { ContentWinner } from "../model/websocketMessages.js";
import { storage } from "../storage/db.js";

export const handle = (): ContentWinner[] => {
    return storage.getWinners().map(([user, wins]) => {
        return {
            name: user.name,
            wins: wins
        }
    });
};