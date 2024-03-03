type WebSocketMessage = {
    type: string;
    data: string;
    id: number;
};

enum WebSocketMessageType {
    register = 'reg',
    createRoom = 'create_room',
    updateRoom = 'update_room',
    addUserToRoom = 'add_user_to_room',
    createGame = 'create_game',
    addShips = 'add_ships',
    startGame = 'start_game',
    attack = 'attack',
    randomAttack = 'randomAttack',
    turn = 'turn',
    finish = 'finish',
    updateWinners = 'update_winners'
};

type RegisterIncomingMessageContent = {
    name: string;
    password: string;
};

type RegisterOutgoingMessageContent = {
    index: number,
    name: string,
    error: boolean,
    errorText: string
};

type UpdateRoomsOutgoingMessageContent = {
    roomId: string,
    roomUsers: ContentRoomUser[]
};

type AddUserToRoomIncomingMessageContent = {
    indexRoom: string
};

type CreateGameOutgoingMessageContent = {
    idGame: string,
    idPlayer: number
};

type ContentRoomUser = {
    name: string,
    index: number
};

type AddShipsIncomingMessageContent = {
    gameId: string,
    ships: ContentShip[],
    indexPlayer: number
};

type StartGameOutgoingMessageContent = {
    currentPlayerIndex: number,
    ships: ContentShip[]
};

type TurnOutgoingMessageContent = {
    currentPlayer: number
};

type AttackIncomingMessageContent = {
    gameId: string,
    x: number,
    y: number,
    indexPlayer: number
};

type AttackFeedbackOutgoingMessageContent = {
    position: ContentPosition,
    currentPlayer: number,
    status: 'miss' | 'killed' | 'shot'
};

type RandomAttackIncomingMessageContent = {
    gameId: string,
    indexPlayer: number
};

type FinishOutgoingMessageContent = {
    winPlayer: number
};

type ContentWinner = {
    name: string,
    wins: number
};

type ContentShip = {
    position: ContentPosition,
    direction: boolean,
    length: number,
    type: 'small' | 'medium' | 'large' | 'huge'
};

type ContentPosition = {
    x: number,
    y: number
};

export { 
    WebSocketMessage, 
    WebSocketMessageType,
    RegisterIncomingMessageContent,
    RegisterOutgoingMessageContent,
    UpdateRoomsOutgoingMessageContent,
    AddUserToRoomIncomingMessageContent,
    ContentRoomUser,
    CreateGameOutgoingMessageContent,
    AddShipsIncomingMessageContent,
    StartGameOutgoingMessageContent,
    TurnOutgoingMessageContent,
    AttackIncomingMessageContent,
    AttackFeedbackOutgoingMessageContent,
    RandomAttackIncomingMessageContent,
    FinishOutgoingMessageContent,
    ContentShip,
    ContentPosition,
    ContentWinner
}