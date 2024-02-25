import { WebSocketServer } from "ws";
import {
    WebSocketMessage,
    RegisterOutgoingMessageContent,
    WebSocketMessageType,
    RegisterIncomingMessageContent,
    AddUserToRoomIncomingMessageContent,
    AddShipsIncomingMessageContent,
    StartGameOutgoingMessageContent,
    TurnOutgoingMessageContent,
    AttackIncomingMessageContent,
} from "../model/websocketMessages.js";
import { handle as handleRegister } from "../handlers/register.js";
import { handle as handleUpdateRooms } from "../handlers/updateRooms.js";
import { handle as handleCreateRoom } from "../handlers/createRoom.js";
import { handle as handleAddUserToRoom } from "../handlers/addUserToRoom.js";
import { handle as handleCreateGame } from "../handlers/createGame.js";
import { handle as handleAddShips } from "../handlers/addShips.js";
import { handleTurn } from "../handlers/game.js";
import { GameService } from "../services/game.js";

let authorizedSessions = new Map<string, number>();
let activeConnections = new Map<string, any>();
let gameServices = new Map<string, GameService>();

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
                
                const updateRoomsResponse = handleUpdateRooms();
                const updateRoomsMessage = composeMessage(WebSocketMessageType.updateRoom, JSON.stringify(updateRoomsResponse));
                broadcast(updateRoomsMessage, Array.from(activeConnections.values()));
            } else if (message.type === WebSocketMessageType.createRoom) {
                const userIndex = authorizedSessions.get(sessionId);
                if (userIndex === undefined) { throw new Error('No user'); }
                
                handleCreateRoom(userIndex);
                
                const updateRoomsResponse = handleUpdateRooms();
                let updateRoomsMessage = composeMessage(WebSocketMessageType.updateRoom, JSON.stringify(updateRoomsResponse));
                broadcast(updateRoomsMessage, Array.from(activeConnections.values()));
            } else if (message.type === WebSocketMessageType.addUserToRoom) {
                const userIndex = authorizedSessions.get(sessionId);
                if (userIndex === undefined) { throw new Error('No user'); }
                
                const content: AddUserToRoomIncomingMessageContent = JSON.parse(message.data);
                handleAddUserToRoom(content, userIndex);
                
                const updateRoomsResponse = handleUpdateRooms();
                const updateRoomsMessage = composeMessage(WebSocketMessageType.updateRoom, JSON.stringify(updateRoomsResponse));
                broadcast(updateRoomsMessage, Array.from(activeConnections.values()));
                
                const gameMessagesContent = handleCreateGame(content.indexRoom);
                for (const [userId, messageContent] of gameMessagesContent) {
                    const ws = connectionForUserId(userId);
                    if (ws !== null) {
                        let message = composeMessage(WebSocketMessageType.createGame, JSON.stringify(messageContent));
                        ws.send(message);
                    }
                }
            } else if (message.type === WebSocketMessageType.addShips) {
                const content: AddShipsIncomingMessageContent = JSON.parse(message.data);

                const response = handleAddShips(content);

                if (response === undefined) { return; }

                let gameService = gameServices.get(content.gameId) ?? new GameService(content.gameId);

                const turnResponse = handleTurn(gameService.turn());

                for (const playerResponse of response) {
                    const ws = connectionForUserId(playerResponse.currentPlayerIndex);
                    const message = composeMessage(WebSocketMessageType.startGame, JSON.stringify(playerResponse));
                    ws.send(message);

                    const turnMessage = composeMessage(WebSocketMessageType.turn, JSON.stringify(turnResponse));
                    ws.send(turnMessage);
                }
            } else if (message.type === WebSocketMessageType.attack) {
                const content: AttackIncomingMessageContent = JSON.parse(message.data);
                
                
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
            data: json['data'],
            id: json['id']
        };
        case WebSocketMessageType.createRoom:
        return {
            type: WebSocketMessageType.createRoom,
            data: json['data'],
            id: json['id']
        }
        case WebSocketMessageType.addUserToRoom:
        return {
            type: WebSocketMessageType.addUserToRoom,
            data: json['data'],
            id: json['id']
        }
        case WebSocketMessageType.addShips:
        return {
            type: WebSocketMessageType.addShips,
            data: json['data'],
            id: json['id']
        }
        case WebSocketMessageType.attack:
        return {
            type: WebSocketMessageType.attack,
            data: json['data'],
            id: json['id']
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
