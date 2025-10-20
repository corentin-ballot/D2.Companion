import { Fighter, GameActionFightEvent } from "../../providers/sockets/FightContext"
import RemovableEffectAction from "./RemovableEffectAction"
import TargetedAbilityAction from "./TargetedAbilityAction"
import TeleportOnSameMapAction from "./TeleportOnSameMapAction"
import MarkCellsAction from "./MarkCellsAction"
import PointsVariationAction from "./PointsVariationAction"
import LifePointsLostAction from "./LifePointsLostAction"
import LifePointsGainAction from "./LifePointsGainAction"
import SlideAction from "./SlideAction"
import DodgePointLossAction from "./DodgePointLossAction"
import TriggerGlyphTrapAction from "./TriggerGlyphTrapAction"
import DeathAction from "./DeathAction"
import MapMovementAction from "./MapMovementAction"
import SummonAction from "./SummonAction"
import ExchangePositionsAction from "./ExchangePositionsAction"

interface FightActionProps {
    action: GameActionFightEvent
    fighters: Fighter[]
}

const FightAction = ({ action, fighters }: FightActionProps) => {
    if (typeof action.targetedAbility !== "undefined") return <TargetedAbilityAction action={action} fighters={fighters} />
    if (typeof action.removableEffect !== "undefined") return <RemovableEffectAction action={action} fighters={fighters} />
    if (typeof action.teleportOnSameMap !== "undefined") return <TeleportOnSameMapAction action={action} fighters={fighters} />
    if (typeof action.markCells !== "undefined") return <MarkCellsAction action={action} fighters={fighters} />
    if (typeof action.dodgePointLoss !== "undefined") return <DodgePointLossAction action={action} fighters={fighters} />
    if (typeof action.pointsVariation !== "undefined") return <PointsVariationAction action={action} fighters={fighters} />
    if (typeof action.lifePointsLost !== "undefined") return <LifePointsLostAction action={action} fighters={fighters} />
    if (typeof action.lifePointsGain !== "undefined") return <LifePointsGainAction action={action} fighters={fighters} />
    if (typeof action.slide !== "undefined") return <SlideAction action={action} fighters={fighters} />
    if (typeof action.triggerGlyphTrap !== "undefined") return <TriggerGlyphTrapAction action={action} fighters={fighters} />
    if (typeof action.death !== "undefined") return <DeathAction action={action} fighters={fighters} />
    if (typeof action.mapMovement !== "undefined") return <MapMovementAction action={action} fighters={fighters} />
    if (typeof action.summons !== "undefined") return <SummonAction action={action} fighters={fighters} />
    if (typeof action.exchangePositions !== "undefined") return <ExchangePositionsAction action={action} fighters={fighters} />
    
    if (typeof action.spellRemove !== "undefined") return null
    if (typeof action.activateGlyphTrap !== "undefined") return null
    if (typeof action.tackled !== "undefined") return null
    if (typeof action.executeScript !== "undefined") return null
    if (typeof action.spellCoolDownVariation !== "undefined") return null
    if (typeof action.unmarkCells !== "undefined") return null
    if (typeof action.invisibility !== "undefined") return null
    if (typeof action.invisibleDetected !== "undefined") return null
    if (typeof action.changeLook !== "undefined") return null

    return <div>{JSON.stringify(action)}</div>
}

export default FightAction;