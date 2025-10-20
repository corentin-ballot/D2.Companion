import { Fighter, GameActionFightEvent } from "../../providers/sockets/FightContext"
import FighterName from "../FighterName";

interface DodgePointLossActionProps {
    action: GameActionFightEvent
    fighters: Fighter[]
}

// {"actionId":308,"sourceId":"-1","dodgePointLoss":{"targetId":"-2","amount":1}}

const MAPPING = {308: "PA", 309: "PM"}

const DodgePointLossAction = ({ action, fighters }: DodgePointLossActionProps) => {
    const source = fighters.find(fighter => fighter.actorId === action.sourceId);
    const target = fighters.find(fighter => fighter.actorId === action.dodgePointLoss?.targetId);

    // @ts-ignore
    return <div><FighterName fighter={source}/> esquive la perte de {action.dodgePointLoss.amount} {MAPPING[action.actionId] ? MAPPING[action.actionId] : action.actionId} de <FighterName fighter={target}/></div>
}

export default DodgePointLossAction;