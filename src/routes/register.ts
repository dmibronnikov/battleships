import { RegisterIncomingMessageContent, RegisterOutgoingMessageContent } from "../model/websocketMessages.js";
import { storage } from "../storage/db.js";

export const handle = (content: RegisterIncomingMessageContent): RegisterOutgoingMessageContent => {
    let existingUser = storage.getUser(content.name);
    if (existingUser !== null) {
        let [index, user] = existingUser;

        if (user.password === content.password) {
            return {
                index: index,
                name: user.name,
                error: false,
                errorText: "",
            };
        } else {
            return {
                index: 0,
                name: "",
                error: true,
                errorText: 'Incorrect password',
            };
        }
    } else {
        try {
            let [index, user] = storage.addUser({ name: content.name, password: content.password });
            return {
                index: index,
                name: user.name,
                error: false,
                errorText: "",
            };
        } catch {
            return {
                index: 0,
                name: "",
                error: true,
                errorText: 'Failed to register user',
            };
        }
    }
};
