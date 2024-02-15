type WebSocketMessage = {
    type: string;
    data: string;
    id: number;
}

enum WebSocketMessageType {
    register = 'reg'
}

type RegisterIncomingMessageContent = {
    name: string;
    password: string;
}

type RegisterOutgoingMessageContent = {
    index: number,
    name: string,
    error: boolean,
    errorText: string
}

export { 
    WebSocketMessage, 
    WebSocketMessageType,
    RegisterIncomingMessageContent,
    RegisterOutgoingMessageContent
}