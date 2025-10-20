import React, { useContext, createContext, useReducer } from 'react'

export interface Disposition {
    cellId: number
    direction: string
    carryingCharacterId: string
}

export interface SubEntityLook {
    bonesId: number
    skins: any[]
    indexedColors: any[]
    scales: any[]
    subEntities: any[]
}

export interface SubEntity {
    bindingPointCategory: string
    bindingPointIndex: number
    subEntityLook: SubEntityLook
}

export interface Look {
    bonesId: number
    skins: number[]
    indexedColors: number[]
    scales: number[]
    subEntities: SubEntity[]
}

export interface Position {
    actorId: string
    disposition: Disposition
}

export interface SpawnInformation {
    team: string
    alive: boolean
    position: Position
}

export interface Value {
    total: string
}

export interface Characteristic {
    characteristicId: number
    value: Value
}

export interface Stats {
    characteristics: Characteristic[]
    summoner: string
    summoned: boolean
    invisibilityState: string
}

export interface EntityFighter {
    entityModelId: number
    level: number
    masterId: string
}

export interface MonsterFighterInformation {
    monsterGid: number
    creatureGrade: number
    creatureLevel: number
}

export interface AiFighter {
    monsterFighterInformation: MonsterFighterInformation
}

export interface Status {
    status: string
}

export interface AlignmentInformation {
    alignment: string
    alignmentQuestNumber: number
    alignmentGrade: number
    characterId: string
    characterLevel: string
}

export interface CharacterInformation {
    level: number
    alignmentInformation: AlignmentInformation
    breedId: number
    gender: string
}

export interface NamedFighter {
    name: string
    status: Status
    leagueId: number
    ladderPosition: number
    hiddenInPreFight: boolean
    characterInformation: CharacterInformation
}

export interface ActorFighter {
    spawnInformation: SpawnInformation
    wave: number
    stats: Stats
    previousPositions: any[]
    entityFighter?: EntityFighter
    aiFighter?: AiFighter
    namedFighter?: NamedFighter
}

export interface ActorInformation {
    look: Look
    fighter: ActorFighter
}

export interface Fighter {
    actorId: string
    disposition: Disposition
    actorInformation: ActorInformation
}

export interface FightSynchronizeEvent {
    fighters: Fighter[]
}

export interface Object {
    id: number
    quantity: number
    priorityHint: number
}

export interface Rewards {
    objects: Object[]
    kamas: string
}

export interface ExperienceData {
    experience: string
    showExperience: boolean
    experienceLevelFloor: string
    showExperienceLevelFloor: boolean
    experienceNextLevelFloor: string
    showExperienceNextLevelFloor: boolean
    experienceFightDelta: string
    showExperienceFightDelta: boolean
    experienceForGuild: string
    showExperienceForGuild: boolean
    experienceForMount: string
    showExperienceForMount: boolean
    reRollExperienceMultiplier: number
}

export interface Additional {
    experienceData: ExperienceData
}

export interface PlayerListEntry {
    level: number
    additional: Additional[]
}

export interface FighterListEntry {
    fighterId: string
    alive: boolean
    playerListEntry?: PlayerListEntry
}

export interface Result {
    outcome: string
    wave: number
    rewards: Rewards
    fighterListEntry: FighterListEntry
}

export interface GameFightEndMessage {
    duration: number
    rewardRate: number
    lootShareLimitMalus: number
    results: Result[]
    namedPartyTeamsOutcomes: any[]
}

export interface SpellCast {
    spellId: number
    spellLevel: number
    portalsId: any[]
}

export interface TargetedAbility {
    targetId: string
    destinationCell: number
    critical: string
    silentCast: boolean
    verboseCast: boolean
    spellCast: SpellCast
}

export interface TemporaryBoostEffect {
    delta: number
    stateId?: number
}

export interface TriggeredEffect {
    firstParam: number
    secondParam: number
    thirdParam: number
    delay: number
}

export interface Effect {
    uid: number
    targetId: string
    turnDuration: number
    dissipationState: string
    spellId: number
    effectId: number
    parentBoostId: number
    temporaryBoostEffect?: TemporaryBoostEffect
    triggeredEffect?: TriggeredEffect
}

export interface RemovableEffect {
    effect: Effect
}

export interface PointsVariation {
    targetId: string
    delta: number
}

export interface LifePointsLost {
    targetId: string
    loss: number
    permanentDamages: number
    elementId: number
    shieldLoss?: number
}

export interface Death {
    targetId: string
}

export interface EffectRemove {
    effect: number
    trigger: boolean
}

export interface SpellRemove {
    targetId: string
    verboseCast: boolean
    effectRemove: EffectRemove
}

export interface Slide {
    targetId: string
    startCell: number
    endCell: number
}

export interface LifePointsGain {
    targetId: string
    delta: number
}

export interface Monster {
    monsterGid: number
    grade: number
}

export interface ActionSpawnInformation {
    monster: Monster
}

export interface Characteristics {
    characteristics: Characteristic[]
    summoner: string
    summoned: boolean
    invisibilityState: string
}

export interface Summon2 {
    team: string
    alive: boolean
    position: Position
}

export interface Summon {
    spawnInformation: ActionSpawnInformation
    wave: number
    look: Look
    characteristics: Characteristics
    summons: Summon2[]
}

export interface SummonsByContextInformation {
    summons: Summon[]
}

export interface Summons {
    summonsByContextInformation: SummonsByContextInformation
}

export interface TeleportOnSameMap {
    targetId: string
    cell: number
}

export interface Cell {
    id: number
    zoneSize: number
    color: number
    cellsType: string
}

export interface Mark {
    authorId: string
    team: string
    spellId: number
    spellLevel: number
    markId: number
    markType: string
    markImpactCell: number
    cells: Cell[]
    active: boolean
}

export interface MarkCells {
    mark: Mark
}

export interface ActivateGlyphTrap {
    markId: number
    active: boolean
}

export interface Tackled {
    tacklersId: string[]
}

export interface DodgePointLoss {
    targetId: string
    amount: number
}

export interface TriggerGlyphTrap {
    markId: number
    markImpactCell: number
    triggeringCharacterId: string
}

export interface MapMovementEvent {
    cells: number[]
    direction: number
    characterId: string
    cautious: boolean
}

export interface ExecuteScript {
    scriptUsageId: number
    critical: boolean
    spellId: number
    spellRank: number
    cell: number
}

export interface Invisibility {
    targetId: string
    invisibilityState: string
}

export interface InvisibleDetected {
    targetId: string
    cell: number
}

export interface UnmarkCells {
    markId: number
}

export interface SpellCoolDownVariation {
    targetId: string
    spellId: number
    value: number
}

export interface ExchangePositions {
    targetId: string
    casterCellId: number
    targetCellId: number
}

export interface GameActionFightEvent {
    actionId: number
    sourceId: string
    teleportOnSameMap?: TeleportOnSameMap
    targetedAbility?: TargetedAbility
    removableEffect?: RemovableEffect
    pointsVariation?: PointsVariation
    lifePointsLost?: LifePointsLost
    death?: Death
    spellRemove?: SpellRemove
    slide?: Slide
    lifePointsGain?: LifePointsGain
    summons?: Summons
    markCells?: MarkCells
    activateGlyphTrap?: ActivateGlyphTrap
    tackled?: Tackled
    dodgePointLoss?: DodgePointLoss
    triggerGlyphTrap?: TriggerGlyphTrap
    executeScript?: ExecuteScript
    invisibility?: Invisibility
    invisibleDetected?: InvisibleDetected
    unmarkCells?: UnmarkCells
    spellCoolDownVariation?: SpellCoolDownVariation
    exchangePositions?: ExchangePositions
    changeLook?: any
    // custom
    mapMovement?: MapMovementEvent
    round?: number;
}

export interface Order {
    id: string
    slain: boolean
}

export interface FightTurnListEvent {
    orders: Order[]
}

export interface Coordinates {
    worldX: number
    worldY: number
}

export interface FightMapInformationEvent {
    subareaId: number
    mapId: string
    coordinates: Coordinates
}

export interface Fight {
    startTime: number;
    endTime: number;
    duration: number;
    mapId: string;
    fighters: Fighter[];
    round: number;
    actions: GameActionFightEvent[];
    turnList: Order[];
}

export const initialFight: Fight = {
    startTime: -1,
    endTime: -1,
    duration: -1,
    mapId: "-1",
    fighters: [],
    round: -1,
    actions: [],
    turnList: [],
}

interface FightState {
    currentFight: Fight
    history: Fight[]
}

const initialState: FightState = {
    currentFight: { ...initialFight },
    history: JSON.parse(localStorage.getItem('Fight.history') ?? '[]').filter((fight: Fight) => fight.startTime > 0) as Fight[],
}

const FightContext = createContext<FightState>(initialState)
export const useFight = (): FightState => useContext(FightContext)

const FightDispatchContext = createContext<React.Dispatch<any>>(() => null)
export const useFightDispatch = (): React.Dispatch<any> => useContext(FightDispatchContext)

const reducer = (state: FightState, action: { type: string, payload: any }): FightState => {
    switch (action.type) {
        case 'fight_start': {
            return {
                ...state,
                currentFight: { ...initialFight, round: 0, startTime: Date.now() }
            }
        }
        case 'fight_map': {
            return {
                ...state,
                currentFight: {
                    ...state.currentFight,
                    mapId: action.payload.mapId
                }
            }
        }
        case 'fight_fighters': {
            return {
                ...state,
                currentFight: {
                    ...state.currentFight,
                    fighters: [
                        ...action.payload.fighters.map((f: Fighter) => ({
                            ...f,
                            actorInformation: {
                                fighter: {
                                    ...f.actorInformation.fighter,
                                    stats: {
                                        summoned: f.actorInformation.fighter.stats.summoned
                                    },
                                },
                                look: undefined,
                            }
                        })),
                    ]
                }
            }
        }
        case 'fight_round': {
            return {
                ...state,
                currentFight: {
                    ...state.currentFight,
                    round: action.payload.roundNumber
                }
            }
        }
        case 'fight_end': {
            const history = [
                {
                    ...state.currentFight,
                    duration: action.payload.duration,
                    endTime: Date.now(),
                },
                ...state.history
            ];

            localStorage.setItem('Fight.history', JSON.stringify(history))

            return {
                ...state,
                currentFight: { ...initialFight },
                history
            }
        }
        case 'fight_action': {
            let summonFighter = null;
            if (typeof action.payload.summons !== "undefined") {
                const summons: Summons = { ...action.payload.summons };
                summonFighter = {
                    actorId: summons.summonsByContextInformation.summons[0].summons[0].position.actorId,
                    actorInformation: {
                        look: summons.summonsByContextInformation.summons[0].look,
                        fighter: {
                            previousPositions: [],
                            spawnInformation: summons.summonsByContextInformation.summons[0].summons[0],
                            wave: summons.summonsByContextInformation.summons[0].wave,
                            stats: summons.summonsByContextInformation.summons[0].characteristics,
                            aiFighter: {
                                monsterFighterInformation: {
                                    monsterGid: summons.summonsByContextInformation.summons[0].spawnInformation.monster.monsterGid,
                                    creatureGrade: summons.summonsByContextInformation.summons[0].spawnInformation.monster.grade,
                                    creatureLevel: 0
                                }
                            }
                        },
                    },
                    disposition: summons.summonsByContextInformation.summons[0].summons[0].position.disposition,
                }
            }

            if(typeof action.payload.changeLook !== "undefined") return state;

            return state.currentFight.startTime < 0 ? state :
                {
                    ...state,
                    currentFight: {
                        ...state.currentFight,
                        actions: [...state.currentFight.actions, { ...action.payload, round: state.currentFight.round }],
                        fighters: (summonFighter) ? [...state.currentFight.fighters, summonFighter] : [...state.currentFight.fighters]
                    }
                };
        }
        case 'fight_movement': {
            return state.currentFight.startTime < 0 ? state :
                {
                    ...state, currentFight: {
                        ...state.currentFight, actions: [...state.currentFight.actions, {
                            actionId: 0,
                            sourceId: action.payload.characterId,
                            mapMovement: action.payload,
                            round: state.currentFight.round,
                        }]
                    }
                };
        }
        case 'fight_turn_list': {
            return {
                ...state,
                currentFight: {
                    ...state.currentFight,
                    turnList: action.payload.orders
                }
            }
        }

        default: {
            throw Error(`FightContext unknown action: ${action.type}`)
        }
    }
}

interface FightProviderProps {
    children: React.ReactElement
}

export const FightProvider = ({ children }: FightProviderProps): React.ReactElement => {
    const [state, dispatch] = useReducer(reducer, initialState)

    return (
        <FightContext.Provider value={state}>
            <FightDispatchContext.Provider value={dispatch}>
                {children}
            </FightDispatchContext.Provider>
        </FightContext.Provider>
    )
}
