import { AddUserToRoomIncomingMessageContent } from "../model/websocketMessages.js";
import { storage } from "../storage/db.js";

export const handle = (content: AddUserToRoomIncomingMessageContent, userIndex: number) => {
    const user = storage.getUserAtIndex(userIndex);
    if (user === null) { return; }

    let room = storage.getRoom(content.indexRoom);
    if (room === null) { return; }

    room.users.push({ index: userIndex, user: user });
    storage.upsertRoom(room);
};