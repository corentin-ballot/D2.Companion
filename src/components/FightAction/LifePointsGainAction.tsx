import { Fighter, GameActionFightEvent } from "../../providers/sockets/FightContext"
import FighterName from "../FighterName";

interface LifePointsGainActionProps {
    action: GameActionFightEvent
    fighters: Fighter[]
}

//
// {"actionId":108,"sourceId":"28103409959","lifePointsGain":{"targetId":"28103409959","delta":316}

const LifePointsGainAction = ({ action, fighters }: LifePointsGainActionProps) => {
    const source = fighters.find(fighter => fighter.actorId === action.sourceId);
    const target = fighters.find(fighter => fighter.actorId === action.lifePointsGain?.targetId);

    if(source?.actorId === target?.actorId) return <div><FighterName fighter={source}/> se soigne de {action.lifePointsGain?.delta}</div>

    return <div><FighterName fighter={target}/> est soigné de {action.lifePointsGain?.delta} par <FighterName fighter={source}/></div>
}

export default LifePointsGainAction;