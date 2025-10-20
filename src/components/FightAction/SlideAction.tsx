import { Fighter, GameActionFightEvent } from "../../providers/sockets/FightContext"
import FighterName from "../FighterName";

interface SlideActionProps {
    action: GameActionFightEvent
    fighters: Fighter[]
}

const SlideAction = ({ action, fighters }: SlideActionProps) => {
    const source = fighters.find(fighter => fighter.actorId === action.sourceId);
    const target = fighters.find(fighter => fighter.actorId === action.slide?.targetId);

    if(source?.actorId === target?.actorId) return <div><FighterName fighter={source}/> se déplace sur la cellule {action.slide?.endCell}</div>

    return <div><FighterName fighter={target}/> est déplacé sur la cellule {action.slide?.endCell} par <FighterName fighter={source}/></div>
}

export default SlideAction;