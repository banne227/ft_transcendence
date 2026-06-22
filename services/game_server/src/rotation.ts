import { state, Segment, Player, Food , MAP_SIZE, Vector} from './game'

export const MAX_TURN_RATE = 0.08; // radians par tick, à ajuster selon le rotation voulu

function VectToAngle(v: Vector): number {
    return Math.atan2(v.y, v.x); //fonction pour transformer un vecteur en anglle (radians)
}

//fonction pour transformer un angle en vecteur 
function AngleToVect(angle: number): Vector {
    return { x: Math.cos(angle), y: Math.sin(angle) };
}

//fonction pour normaliser un angle, faire qui soit compris entre -pi et pi
function normalizeAngle(angle: number): number
{
    // Si l'angle dépasse +180°
    while (angle > Math.PI)
    {
        // On retire un tour complet (360°)
        angle -= 2 * Math.PI;
    }

    // Si l'angle est inférieur à -180°
    while (angle < -Math.PI)
    {
        // On ajoute un tour complet (360°)
        angle += 2 * Math.PI;
    }
    return angle;
}

export function rotate(current: Vector, desired: Vector, Maxturn : number): Vector{
    const currentAngle = VectToAngle(current)
    const desiredAngle = VectToAngle(desired)

    let diff = normalizeAngle(currentAngle - desiredAngle)

    if (Math.abs(diff) <= Maxturn)
        return (desired)

    const turn = diff > 0 ? Maxturn : -Maxturn
    return (AngleToVect(turn))
}