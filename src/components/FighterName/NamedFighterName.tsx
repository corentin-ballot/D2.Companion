interface NamedFighterNameProps {
    name: string | undefined;
}

const NamedFighterName = ({ name }: NamedFighterNameProps) => <text>{name}</text>

export default NamedFighterName;