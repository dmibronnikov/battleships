import { GameState } from '../model/gameField.js';
import { Room } from '../model/room.js';
import { User } from '../model/user.js';
import { Game } from '../model/game.js';

interface IStorage {
    addUser(user: User): [number, User]
    getUser(name: string): [number, User] | null
    getUserAtIndex(index: number): User | null
    
    upsertRoom(room: Room): void
    getRooms(): Room[]
    getRoom(id: string): Room | null

    addGame(game: Game): void
    getGame(id: string): Game | undefined

    getGameState(gameId: string): GameState | undefined
    upsertGameState(gameState: GameState, gameId: string): void
}

class Storage implements IStorage {
    private users: User[] = [];
    private rooms: Room[] = [];
    private games: Game[] = [];
    private gameStates = new Map<string, GameState>();

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

    getGame(id: string): Game | undefined {
        return this.games.find(game => {
            return game.id === id;
        });
    }

    getGameState(gameId: string): GameState | undefined {
        return this.gameStates.get(gameId);
    }

    upsertGameState(gameState: GameState, gameId: string): void {
        this.gameStates.set(gameId, gameState);
    }
}

const storage: IStorage = new Storage();

export { IStorage, Storage, storage };

