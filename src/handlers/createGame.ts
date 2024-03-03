import { randomUUID } from "crypto";
import { Room } from "../model/room.js";
import { CreateGameOutgoingMessageContent } from "../model/websocketMessages.js";
import { storage } from "../storage/db.js";

export const handle = (roomId: string): [number, CreateGameOutgoingMessageContent][] => {
    const room = storage.getRoom(roomId);
    if (room === null) { return [] }

    if (room.users.length === 2) {
        const gameId = randomUUID().toString();
        let result: [number, CreateGameOutgoingMessageContent][] = [];
        for (const user of room.users) {
            storage.addGame({ id: gameId, room: room });
            result.push([user.index, { idGame: gameId, idPlayer: user.index }]);
        }

        return result;
    }

    return [];
}