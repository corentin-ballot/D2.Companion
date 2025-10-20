import { Fighter, GameActionFightEvent } from "../../providers/sockets/FightContext"
import FighterName from "../FighterName";

interface DeathActionProps {
    action: GameActionFightEvent
    fighters: Fighter[]
}

const DeathAction = ({ action, fighters }: DeathActionProps) => {
    const source = fighters.find(fighter => fighter.actorId === action.sourceId);
    const target = fighters.find(fighter => fighter.actorId === action.death?.targetId);

    return <div><FighterName fighter={source}/> tue <FighterName fighter={target}/></div>
}

export default DeathAction;