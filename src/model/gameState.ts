type GameState = {
    firstPlayer: PlayerState | undefined,
    secondPlayer: PlayerState | undefined
};

type PlayerState = {
    playerId: number,
    ships: Ship[]
};

type Ship = {
    position: ShipPosition,
    direction: boolean,
    length: number,
    type: 'small' | 'medium' | 'large' | 'huge',
    damage: number
};

type ShipPosition = {
    x: number,
    y: number
};

export { 
    GameState,
    PlayerState,
    Ship,
    ShipPosition
 }