import { User } from "./user.js";

export type Room = {
    id: string,
    users: RoomUser[]
};

export type RoomUser = {
    user: User,
    index: number
};