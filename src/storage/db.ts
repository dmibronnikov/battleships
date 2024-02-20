import { Game } from '../model/Game.js';
import { Room } from '../model/room.js';
import { User } from '../model/user.js';

interface IStorage {
    addUser(user: User): void
    getUser(name: string): [number, User] | null
    getUserAtIndex(index: number): User | null
    
    upsertRoom(room: Room): void
    getRooms(): Room[]
    getRoom(id: string): Room | null
}

class Storage implements IStorage {
    private users: User[] = [];
    private rooms: Room[] = [];
    private games: Game[] = [];

    addUser(user: User): [number, User] {
        const result = this.users.findIndex((value) => {
            value.name === user.name;
        });

        if (result !== -1) {
            throw new Error(`User with id already exists`);
        }

        this.users.push(user);
        return [this.users.length - 1, user];
    }

    getUser(name: string): [number, User] | null {
        const filtered = this.users.filter((user) => {
            user.name === name;
        });

        return filtered.length > 0 ? [0, filtered[0]] : null;
    }

    getUserAtIndex(index: number): User | null {
        return this.users[index];
    }

    upsertRoom(newRoom: Room) {
        const index = this.rooms.findIndex(room => {
            return newRoom.id === room.id;
        });

        if (index > 0) {
            this.rooms[index] = newRoom;
        } else {
            this.rooms.push(newRoom);
        }
    }

    getRooms(): Room[] {
        return this.rooms;
    }

    getRoom(id: string): Room | null {
        const result = this.rooms.filter(room => {
            return room.id === id;
        });

        return result[0];
    }

    addGame(game: Game) {
        return this.games.push(game);
    }

    getGame(id: string) {
        return this.games.find(game => {
            return game.id === id;
        });
    }
}

const storage = new Storage();

export { IStorage, Storage, storage };

