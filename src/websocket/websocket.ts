import { WebSocketServer } from "ws";
import {
    WebSocketMessage,
    RegisterOutgoingMessageContent,
    WebSocketMessageType,
    RegisterIncomingMessageContent,
} from "../model/websocketMessages.js";
import { handle as handleRegister } from "../routes/register.js";

export const run = () => {
    const wss = new WebSocketServer({ port: process.env.WEBSOCKET_PORT });

    wss.on("connection", (ws) => {
        ws.on("message", async (messageBytes) => {
            try {
                const message = parseIncomingMessage(messageBytes.toString());
                switch (message.type) {
                    case WebSocketMessageType.register:
                        const content: RegisterIncomingMessageContent = JSON.parse(message.data);

                        const responseContent = handleRegister(content);
                        ws.send(composeMessage(WebSocketMessageType.register, JSON.stringify(responseContent)));
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
