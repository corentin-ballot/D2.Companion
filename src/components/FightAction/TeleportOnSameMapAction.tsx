import { Fighter, GameActionFightEvent } from "../../providers/sockets/FightContext"
import FighterName from "../FighterName";

interface TeleportOnSameMapActionProps {
    action: GameActionFightEvent
    fighters: Fighter[]
}

const TeleportOnSameMapAction = ({ action, fighters }: TeleportOnSameMapActionProps) => {
    const source = fighters.find(fighter => fighter.actorId === action.sourceId);
    const target = fighters.find(fighter => fighter.actorId === action.teleportOnSameMap?.targetId);

    if(source?.actorId === target?.actorId) return <div><FighterName fighter={source}/> se téléporte sur la cellule {action.teleportOnSameMap?.cell}</div>

    return <div><FighterName fighter={target}/> est téléporté sur la cellule {action.teleportOnSameMap?.cell} par <FighterName fighter={source}/></div>
}

export default TeleportOnSameMapAction;