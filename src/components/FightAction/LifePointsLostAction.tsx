import { Fighter, GameActionFightEvent } from "../../providers/sockets/FightContext"
import FighterName from "../FighterName";

interface LifePointsLostActionProps {
    action: GameActionFightEvent
    fighters: Fighter[]
}

const ELEMENT = {0: "neutre", 1: "terre", 2: "feu", 3: "eau", 4: "air", 9: "invocation", 4294967295: "poussée"}

const LifePointsLostAction = ({ action, fighters }: LifePointsLostActionProps) => {
    const source = fighters.find(fighter => fighter.actorId === action.sourceId);
    const target = fighters.find(fighter => fighter.actorId === action.lifePointsLost?.targetId);

    const direct = action.lifePointsLost?.loss || 0;
    const shield = action.lifePointsLost?.shieldLoss || 0;

    // @ts-ignore
    if(source?.actorId === target?.actorId) return <div><FighterName fighter={source}/> s&apos;inflige {action.lifePointsLost?.loss} dégats {ELEMENT[action.lifePointsLost?.elementId]}</div>

    // @ts-ignore
    return <div><FighterName fighter={target}/> subit {direct + shield} dégats {ELEMENT[action.lifePointsLost?.elementId]} de <FighterName fighter={source}/></div>
}

export default LifePointsLostAction;