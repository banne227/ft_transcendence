import { state, Segment, Player, Food , MAP_SIZE, Vector} from './game'

const MAX_TURN_RATE = 0.08; // radians par tick, à ajuster selon le rotation voulu

function VectToAngle(v: Vector): number {
    return Math.atan2(v.y, v.x); //fonction pour transformer un vecteur en anglle en radians
}

function AngleToVect(angle: number): Vector {
    return { x: Math.cos(angle), y: Math.sin(angle) };
}

