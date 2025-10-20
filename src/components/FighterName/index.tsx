import { Fighter } from "../../providers/sockets/FightContext";
import AiFighterName from "./AiFighterName";
import EntityFighterName from "./EntityFighterName";
import NamedFighterName from "./NamedFighterName";
import PlayerFighterName from "./PlayerFighterName";

interface FighterNameProps {
    fighter?: Fighter
}

const FighterName = ({ fighter }: FighterNameProps) => {
    if(typeof fighter?.actorInformation.fighter.namedFighter !== "undefined") return <PlayerFighterName fighter={fighter} />
    if(typeof fighter?.actorInformation.fighter.aiFighter !== "undefined") return <AiFighterName fighter={fighter} />
    if(typeof fighter?.actorInformation.fighter.entityFighter !== "undefined") return <EntityFighterName fighter={fighter} />
    return <NamedFighterName name="[?]" />
}

export default FighterName;