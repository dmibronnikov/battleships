import { WebSocketServer } from "ws";
import {
    WebSocketMessage,
    RegisterOutgoingMessageContent,
    WebSocketMessageType,
    RegisterIncomingMessageContent,
} from "../model/websocketMessages.js";
import { handle as handleRegister } from "../routes/register.js";
import { handle as handleUpdateRooms } from "../routes/updateRooms.js";

export const run = () => {
    const wss = new WebSocketServer({ port: process.env.WEBSOCKET_PORT });
    let activeSessions = new Map<string, number>();

    wss.on("connection", (ws, req) => {
        const sessionId = req.headers['sec-websocket-key'];

        ws.on("message", async (messageBytes) => {
            try {
                if (sessionId === undefined) { throw new Error('No Session'); }

                const message = parseIncomingMessage(messageBytes.toString());
                switch (message.type) {
                    case WebSocketMessageType.register:
                        const content: RegisterIncomingMessageContent = JSON.parse(message.data);

                        const registerResponse = handleRegister(content);

                        activeSessions.set(sessionId, registerResponse.index);
                        ws.send(composeMessage(WebSocketMessageType.register, JSON.stringify(registerResponse)));

                        let updateRoomsResponse = handleUpdateRooms();
                        ws.send(composeMessage(WebSocketMessageType.updateRoom, JSON.stringify(updateRoomsResponse)));
                        break;
                    case WebSocketMessageType.createRoom:
                        console.log(`Message from user with index ${activeSessions.get(sessionId)}`)
                        break;
                }
            } catch (error) {
                console.log(error);
            }
        });
    });
};

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
