import { ContentShip } from "./websocketMessages.js";
import { Point } from "../types.js";

type GameState = {
    firstPlayer: PlayerState | undefined,
    secondPlayer: PlayerState | undefined
};

type PlayerState = {
    playerId: number,
    field: GameField
};

type GameField = {
    field: number[][]
    ships: Ship[],
    shipsLeft: number
};

type Ship = {
    head: Point,
    direction: boolean,
    position: Point[],
    status: number[],
    type: 'small' | 'medium' | 'large' | 'huge'
};

const generate = (contentShips: ContentShip[]): GameField => {
    const rows = 10;
    const columns = 10;
    
    let field: number[][] = Array.from({ length: rows }, () => {
        return new Array(columns).fill(0);
    });

    let ships: Ship[] = [];
    for (const contentShip of contentShips) {
        const ship = shipFromContent(contentShip);
        for (const point of ship.position) {
            field[point.y][point.x] = 1;
        }
        ships.push(ship);
    }

    return {
        field: field,
        ships: ships,
        shipsLeft: ships.length
    }
};

const shipFromContent = (contentShip: ContentShip): Ship => {
    let position: Point[]
    if (contentShip.direction === true) {
        position = [...Array(contentShip.length).keys()].map((yCoordinate) => {
            return { x: contentShip.position.x, y: contentShip.position.y + yCoordinate };
        });
    } else {
        position = [...Array(contentShip.length).keys()].map((xCoordinate) => {
            return { x: contentShip.position.x + xCoordinate, y: contentShip.position.y };
        });
    }

    return {
        head: contentShip.position,
        direction: contentShip.direction,
        position: position,
        status: new Array(contentShip.length).fill(0),
        type: contentShip.type
    }
};

const contentFromShip = (ship: Ship): ContentShip => {
    return {
        position: ship.head,
        direction: ship.direction,
        length: ship.position.length,
        type: ship.type
    }
}

const contentFromShips = (ships: Ship[]): ContentShip[] => {
    return ships.map(ship => {
        return contentFromShip(ship);
    });
}

export { GameState, GameField, PlayerState, Ship, generate, shipFromContent, contentFromShip, contentFromShips }