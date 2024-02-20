type WebSocketMessage = {
    type: string;
    data: string;
    id: number;
}

enum WebSocketMessageType {
    register = 'reg',
    createRoom = 'create_room',
    updateRoom = 'update_room',
    addUserToRoom = 'add_user_to_room',
    createGame = "create_game",
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

type UpdateRoomsOutgoingMessageContent = {
    roomId: string,
    roomUsers: ContentRoomUser[]
}

type AddUserToRoomIncomingMessageContent = {
    indexRoom: string
}

type CreateGameOutgoingMessageContent = {
    idGame: string,
    idPlayer: number
}

type ContentRoomUser = {
    name: string,
    index: number
}

export { 
    WebSocketMessage, 
    WebSocketMessageType,
    RegisterIncomingMessageContent,
    RegisterOutgoingMessageContent,
    UpdateRoomsOutgoingMessageContent,
    AddUserToRoomIncomingMessageContent,
    ContentRoomUser,
    CreateGameOutgoingMessageContent
}