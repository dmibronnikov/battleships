import { roomsService } from "../services/rooms.js"
import { User } from "../model/user.js"
import { storage } from "../storage/db.js";

export const handle = (userIndex: number): void => {
    const user = storage.getUserAtIndex(userIndex);
    if (user !== null) {
        roomsService.createRoom(user, userIndex);
    }
}