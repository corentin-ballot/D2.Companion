import NamedFighterName from "./NamedFighterName";
import { Fighter } from "../../providers/sockets/FightContext";

interface PlayerFighterNameProps {
    fighter: Fighter;
}

const PlayerFighterName = ({ fighter }: PlayerFighterNameProps) => {
    const name = fighter.actorInformation.fighter.namedFighter?.name;

    return <NamedFighterName name={name} />
}


export default PlayerFighterName;