import { Fighter, GameActionFightEvent } from "../../providers/sockets/FightContext"
import FighterName from "../FighterName";

interface TriggerGlyphTrapActionProps {
    action: GameActionFightEvent
    fighters: Fighter[]
}

const TriggerGlyphTrapAction = ({ action, fighters }: TriggerGlyphTrapActionProps) => {
    const source = fighters.find(fighter => fighter.actorId === action.sourceId);
    const target = fighters.find(fighter => fighter.actorId === action.triggerGlyphTrap?.triggeringCharacterId);

    return <div><FighterName fighter={target}/> déclanche un piège de <FighterName fighter={source}/></div>
}

export default TriggerGlyphTrapAction;