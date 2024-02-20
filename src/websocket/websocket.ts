import { WebSocketServer } from "ws";
import {
    WebSocketMessage,
    RegisterOutgoingMessageContent,
    WebSocketMessageType,
    RegisterIncomingMessageContent,
    AddUserToRoomIncomingMessageContent,
} from "../model/websocketMessages.js";
import { handle as handleRegister } from "../routes/register.js";
import { handle as handleUpdateRooms } from "../routes/updateRooms.js";
import { handle as handleCreateRoom } from "../routes/createRoom.js";
import { handle as handleAddUserToRoom } from "../routes/addUserToRoom.js";
import { handle as handleCreateGame } from "../routes/createGame.js";

let authorizedSessions = new Map<string, number>();
let activeConnections = new Map<string, any>();

export const run = () => {
    const wss = new WebSocketServer({ port: process.env.WEBSOCKET_PORT });

    wss.on("connection", (ws, req) => {
        const sessionId = req.headers['sec-websocket-key'];
        if (sessionId === undefined) { throw new Error('No Session'); }
        
        activeConnections.set(sessionId, ws);
        listenToEvents(ws, sessionId);
    });
};

const listenToEvents = (connection: any, sessionId: string) => {
    connection.on("message", async (messageBytes: any) => {
        try {            
            const message = parseIncomingMessage(messageBytes.toString());
            if (message.type === WebSocketMessageType.register) {
                const content: RegisterIncomingMessageContent = JSON.parse(message.data);
                
                const registerResponse = handleRegister(content);
                
                authorizedSessions.set(sessionId, registerResponse.index);
                connection.send(composeMessage(WebSocketMessageType.register, JSON.stringify(registerResponse)));
                
                let updateRoomsResponse = handleUpdateRooms();
                let updateRoomsMessage = composeMessage(WebSocketMessageType.updateRoom, JSON.stringify(updateRoomsResponse));
                broadcast(updateRoomsMessage, Array.from(activeConnections.values()));
            } else if (message.type === WebSocketMessageType.createRoom) {
                const userIndex = authorizedSessions.get(sessionId);
                if (userIndex === undefined) { throw new Error('No user'); }

                handleCreateRoom(userIndex);
                
                let updateRoomsResponse = handleUpdateRooms();
                let updateRoomsMessage = composeMessage(WebSocketMessageType.updateRoom, JSON.stringify(updateRoomsResponse));
                broadcast(updateRoomsMessage, Array.from(activeConnections.values()));
            } else if (message.type === WebSocketMessageType.addUserToRoom) {
                const userIndex = authorizedSessions.get(sessionId);
                if (userIndex === undefined) { throw new Error('No user'); }

                const content: AddUserToRoomIncomingMessageContent = JSON.parse(message.data);
                handleAddUserToRoom(content, userIndex);

                let updateRoomsResponse = handleUpdateRooms();
                let updateRoomsMessage = composeMessage(WebSocketMessageType.updateRoom, JSON.stringify(updateRoomsResponse));
                broadcast(updateRoomsMessage, Array.from(activeConnections.values()));

                const gameMessagesContent = handleCreateGame(content.indexRoom);
                for (const [userId, messageContent] of gameMessagesContent) {
                    const ws = connectionForUserId(userId);
                    if (ws !== null) {
                        let message = composeMessage(WebSocketMessageType.createGame, JSON.stringify(messageContent));
                        ws.send(message);
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    });
};

const broadcast = (message: string, connections: any[]) => {
    connections.forEach(connection => {
        connection.send(message);
    });
};

const connectionForUserId = (userId: number): any | null => {
    let sessionId: string | null = null;
    for (const [sid, uid] of authorizedSessions.entries()) {
        if (userId === uid) { 
            sessionId = sid;
            break;
        }
    }

    if (sessionId !== null) {
        return activeConnections.get(sessionId);
    } else {
        return null;
    }
}

const parseIncomingMessage = (message: string): WebSocketMessage => {
    let json: WebSocketMessage = JSON.parse(message);
    switch (json.type) {
        case WebSocketMessageType.register:
        return {
            type: WebSocketMessageType.register,
            data: json["data"],
            id: json["id"],
        };
        case WebSocketMessageType.createRoom:
        return {
            type: WebSocketMessageType.createRoom,
            data: json["data"],
            id: json["id"]
        }
        case WebSocketMessageType.addUserToRoom:
        return {
            type: WebSocketMessageType.addUserToRoom,
            data: json["data"],
            id: json["id"]
        }
        default:
        throw new Error(`Unknown message type ${json.type}`);
    }
};

const composeMessage = (type: WebSocketMessageType, content: string): string => {
    let message: WebSocketMessage = {
        id: 0,
        type: type,
        data: content,
    };
    
    return JSON.stringify(message);
};
