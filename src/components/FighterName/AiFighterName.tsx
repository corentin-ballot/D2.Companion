import NamedFighterName from "./NamedFighterName";
import { Fighter } from "../../providers/sockets/FightContext";
import useDofusMonster from "../../hooks/dofus-data/useDofusMonster";

interface AiFighterNameProps {
    fighter: Fighter;
}

const AiFighterName = ({ fighter }: AiFighterNameProps) => {
    const monsterGid = fighter.actorInformation.fighter.aiFighter?.monsterFighterInformation.monsterGid || 0;
    const monsterRequest = useDofusMonster(monsterGid);

    if(monsterRequest.isPending) return <NamedFighterName name="loading..." />

    return <NamedFighterName name={monsterRequest.data?.name.fr} />
}


export default AiFighterName;