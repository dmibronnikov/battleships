import { Room } from "../model/room.js";

export interface IRoomsService {
    availableRooms(): Room[];
    // createRoom(): Room;
}

class RoomsService implements IRoomsService {
    private rooms: Room[] = [];
    
    availableRooms(): Room[] {
        return this.rooms.filter((room) => {
            return room.users.length == 1;
        });
    }

    // createRoom(): Room {
        
    // }
}

export const roomsService: IRoomsService = new RoomsService();