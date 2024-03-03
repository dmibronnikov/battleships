import { randomUUID } from "crypto";
import { Room } from "../model/room.js";
import { User } from "../model/user.js";
import { storage } from "../storage/db.js";

export interface IRoomsService {
    availableRooms(): Room[];
    createRoom(user: User, index: number): Room;
}

class RoomsService implements IRoomsService {
    availableRooms(): Room[] {
        return storage.getRooms().filter((room) => {
            return room.users.length == 1;
        });
    }

    createRoom(user: User, index: number): Room {
        const room: Room = {
            id: randomUUID().toString(),
            users: [
                {
                    index: index,
                    user: user
                }
            ]
        }

        storage.upsertRoom(room);

        return room;
    }
}

export const roomsService: IRoomsService = new RoomsService();