import { User } from '../model/user.js';

interface IStorage {
    add(user: User): void
    getUser(name: string): [number, User] | null   
}

class Storage implements IStorage {
    private users: User[] = [];

    add(user: User): [number, User] {
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
}

const storage = new Storage();

export { IStorage, Storage, storage };

