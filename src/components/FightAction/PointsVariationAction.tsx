import { Fighter, GameActionFightEvent } from "../../providers/sockets/FightContext"
import FighterName from "../FighterName";

interface PointsVariationActionProps {
    action: GameActionFightEvent
    fighters: Fighter[]
}

// {"actionId":102,"sourceId":"28103409959","pointsVariation":{"targetId":"28103409959","delta":-1}}

const MAPPING = {102: "PA", 129: "PM"}

const PointsVariationAction = ({ action, fighters }: PointsVariationActionProps) => {
    const source = fighters.find(fighter => fighter.actorId === action.sourceId);
    const target = fighters.find(fighter => fighter.actorId === action.pointsVariation?.targetId);

    // @ts-ignore
    if(source?.actorId === target?.actorId) return <div><FighterName fighter={source}/> utilise {typeof action.pointsVariation?.delta === "number" ? action.pointsVariation.delta * -1 : null} {MAPPING[action.actionId] ? MAPPING[action.actionId] : action.actionId}</div>

    // @ts-ignore
    return <div><FighterName fighter={source}/> retire {typeof action.pointsVariation?.delta === "number" ? action.pointsVariation.delta * -1 : null} {MAPPING[action.actionId] ? MAPPING[action.actionId] : action.actionId} à <FighterName fighter={target}/></div>
}

export default PointsVariationAction;