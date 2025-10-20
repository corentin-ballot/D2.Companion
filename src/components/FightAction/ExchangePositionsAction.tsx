import { Fighter, GameActionFightEvent } from "../../providers/sockets/FightContext"
import FighterName from "../FighterName";

interface ExchangePositionsActionProps {
    action: GameActionFightEvent
    fighters: Fighter[]
}

const ExchangePositionsAction = ({ action, fighters }: ExchangePositionsActionProps) => {
    const source = fighters.find(fighter => fighter.actorId === action.sourceId);
    const target = fighters.find(fighter => fighter.actorId === action.exchangePositions?.targetId);

    return <div><FighterName fighter={source}/> échange de position avec <FighterName fighter={target}/></div>
}

export default ExchangePositionsAction;