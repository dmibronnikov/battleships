import { UpdateRoomsOutgoingMessageContent, ContentRoomUser } from "../model/websocketMessages.js";
import { roomsService } from "../services/rooms.js";

export const handle = (): UpdateRoomsOutgoingMessageContent[] => {
    let availableRooms = roomsService.availableRooms();

    return availableRooms.map(room => {
        let roomUsers: ContentRoomUser[] = room.users.map(roomUser => {
            return {
                index: roomUser.index,
                name: roomUser.user.name
            }
        });
        
        return {
            roomId: room.id,
            roomUsers: roomUsers
        }
    });
};